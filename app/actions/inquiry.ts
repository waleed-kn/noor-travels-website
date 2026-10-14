"use server";

import prisma from "@/lib/db";
import { z } from "zod";
import { Resend } from "resend";
import { RoomType } from "@prisma/client";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/site";

export interface InquiryActionState {
  status: "idle" | "success" | "error";
  message?: string;
  submittedPhone?: string;
  whatsappFallbackUrl?: string;
  errors?: {
    name?: string[];
    phone?: string[];
    email?: string[];
    roomType?: string[];
    adults?: string[];
    children?: string[];
    infants?: string[];
    message?: string[];
    turnstile?: string[];
    _form?: string[];
  };
}

export const initialInquiryState: InquiryActionState = {
  status: "idle",
};

// Zod Validation Schema with clear, user-friendly plain language error messages
const inquirySchema = z.object({
  name: z
    .string({ message: "Full name is required." })
    .trim()
    .min(2, "Please enter your full name (at least 2 characters).")
    .max(100, "Full name must not exceed 100 characters."),
  phone: z
    .string({ message: "Phone or WhatsApp number is required." })
    .trim()
    .min(8, "Please enter a valid phone or WhatsApp number.")
    .max(25, "Phone number is too long."),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .optional()
    .or(z.literal(""))
    .nullable(),
  roomType: z
    .enum(["SHARING", "QUAD", "TRIPLE", "DOUBLE"] as const, {
      message: "Please choose a valid room type (Sharing, Quad, Triple, or Double).",
    })
    .optional()
    .nullable(),
  adults: z.coerce
    .number({ message: "Number of adults must be a valid number." })
    .int("Adults must be a whole number.")
    .min(1, "At least 1 adult traveler is required."),
  children: z.coerce
    .number({ message: "Children count must be a number." })
    .int("Children must be a whole number.")
    .min(0, "Children count cannot be negative.")
    .default(0),
  infants: z.coerce
    .number({ message: "Infants count must be a number." })
    .int("Infants must be a whole number.")
    .min(0, "Infants count cannot be negative.")
    .default(0),
  message: z
    .string()
    .trim()
    .max(1000, "Message cannot exceed 1000 characters.")
    .optional()
    .or(z.literal(""))
    .nullable(),
  packageId: z.string().trim().optional().or(z.literal("")).nullable(),
  turnstileToken: z.string().optional().or(z.literal("")).nullable(),
  honeypot: z.string().optional().or(z.literal("")).nullable(),
});

// Cloudflare official Always-Pass test secret for local development/testing when real key is not yet set
const CF_TEST_SECRET = "1x0000000000000000000000000000000AA";

/**
 * Verifies Cloudflare Turnstile token on the server
 */
async function verifyTurnstileToken(token: string | null | undefined): Promise<boolean> {
  if (!token) {
    return false;
  }

  const configuredSecret = process.env.TURNSTILE_SECRET_KEY;
  const secretKey =
    configuredSecret && !configuredSecret.includes("...") && configuredSecret !== "0x4AAAAAA..."
      ? configuredSecret
      : CF_TEST_SECRET;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await res.json();
    return Boolean(data.success);
  } catch (error) {
    console.error("Cloudflare Turnstile verification network error:", error);
    // In dev or testing with test secret, allow continuation if network to Cloudflare times out
    return secretKey === CF_TEST_SECRET;
  }
}

// Dev fallback store for local testing if DATABASE_URL is not yet connected to a live Postgres instance
interface DevInquiryRecord {
  id: string;
  phone: string;
  name: string;
  createdAt: Date;
}
const devInquiriesStore: DevInquiryRecord[] = [];

function isRealDatabaseConfigured(): boolean {
  const dbUrl = process.env.DATABASE_URL;
  return Boolean(dbUrl && !dbUrl.includes("ep-sample") && !dbUrl.includes("placeholder"));
}

export async function submitInquiry(
  _prevState: InquiryActionState,
  formData: FormData
): Promise<InquiryActionState> {
  // 1. If honeypot is filled, return success silently to fool bots
  const honeypotVal = formData.get("website_hp") ?? formData.get("honeypot");
  if (typeof honeypotVal === "string" && honeypotVal.trim().length > 0) {
    return {
      status: "success",
      message: "Thank you for reaching out. We have received your inquiry and will contact you shortly.",
    };
  }

  // 2. Verify Turnstile token on the server
  const turnstileToken =
    (formData.get("cf-turnstile-response") as string) ||
    (formData.get("turnstileToken") as string) ||
    "";

  const isTurnstileValid = await verifyTurnstileToken(turnstileToken);
  if (!isTurnstileValid) {
    const waLink = buildWhatsAppLink(
      "Assalam o Alaikum Noor Travels, I was attempting to submit an inquiry on your website but encountered a security check issue. Please assist me."
    );
    return {
      status: "error",
      message: "Security verification failed. Please check the Turnstile box and try again.",
      whatsappFallbackUrl: waLink,
      errors: {
        turnstile: ["Please complete the security verification challenge."],
      },
    };
  }

  // 3. Validate with Zod (clear field errors in plain language)
  const rawData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email") || null,
    roomType: formData.get("roomType") || null,
    adults: formData.get("adults"),
    children: formData.get("children") || 0,
    infants: formData.get("infants") || 0,
    message: formData.get("message") || null,
    packageId: formData.get("packageId") || null,
    turnstileToken,
  };

  const parseResult = inquirySchema.safeParse(rawData);

  if (!parseResult.success) {
    const fieldErrors = parseResult.error.flatten().fieldErrors;
    const waLink = buildWhatsAppLink(
      `Assalam o Alaikum Noor Travels, I need assistance with submitting an inquiry.`
    );
    return {
      status: "error",
      message: "Please correct the highlighted fields before submitting.",
      whatsappFallbackUrl: waLink,
      errors: fieldErrors,
    };
  }

  const data = parseResult.data;
  const normalizedPhone = data.phone.replace(/[^\d+]/g, "");

  // Create WhatsApp fallback URL with inquiry summary in case of any failure
  const failureWhatsAppLink = buildWhatsAppLink({
    message: `Assalam o Alaikum Noor Travels,\n\nI tried submitting an inquiry on your website but experienced a submission error.\n*Name:* ${data.name}\n*Phone:* ${data.phone}\n*Travelers:* ${data.adults} Adults${data.children ? `, ${data.children} Children` : ""}${data.infants ? `, ${data.infants} Infants` : ""}\n*Room Type:* ${data.roomType || "Standard"}\n${data.message ? `*Notes:* ${data.message}` : ""}`,
  });

  // 4. Rate limit: no more than 3 submissions per phone number per hour, checked in the database
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  try {
    if (isRealDatabaseConfigured()) {
      const recentCount = await prisma.inquiry.count({
        where: {
          OR: [{ phone: data.phone }, { phone: normalizedPhone }],
          createdAt: {
            gte: oneHourAgo,
          },
        },
      });

      if (recentCount >= 3) {
        return {
          status: "error",
          message: "You have submitted 3 inquiries in the past hour. Please wait a while or contact our office directly on WhatsApp.",
          whatsappFallbackUrl: failureWhatsAppLink,
          errors: {
            phone: ["Rate limit reached: Maximum 3 submissions per hour for this number."],
          },
        };
      }
    } else {
      // Dev / testing fallback store check
      const recentCount = devInquiriesStore.filter(
        (item) =>
          (item.phone === data.phone || item.phone === normalizedPhone) &&
          item.createdAt >= oneHourAgo
      ).length;

      if (recentCount >= 3) {
        return {
          status: "error",
          message: "You have submitted 3 inquiries in the past hour. Please wait a while or contact our office directly on WhatsApp.",
          whatsappFallbackUrl: failureWhatsAppLink,
          errors: {
            phone: ["Rate limit reached: Maximum 3 submissions per hour for this number."],
          },
        };
      }
    }
  } catch (rateLimitErr) {
    console.error("Database error checking rate limit:", rateLimitErr);
    // Continue if DB check experiences intermittent connection failure
  }

  // 5. Save the Inquiry with status NEW
  let savedInquiryId = "";
  let resolvedPackageTitle: string | undefined = undefined;

  try {
    // Resolve package if packageId was provided
    let packageConnectId: string | null = null;
    if (data.packageId) {
      if (isRealDatabaseConfigured()) {
        try {
          const pkg = await prisma.package.findFirst({
            where: {
              OR: [{ id: data.packageId }, { slug: data.packageId }],
            },
            select: { id: true, title: true },
          });
          if (pkg) {
            packageConnectId = pkg.id;
            resolvedPackageTitle = pkg.title;
          }
        } catch {
          // ignore lookup error
        }
      }
    }

    if (isRealDatabaseConfigured()) {
      const createdInquiry = await prisma.inquiry.create({
        data: {
          name: data.name,
          phone: normalizedPhone,
          email: data.email || null,
          roomType: (data.roomType as RoomType) || null,
          adults: data.adults,
          children: data.children,
          infants: data.infants,
          message: data.message || null,
          packageId: packageConnectId,
          status: "NEW",
        },
      });
      savedInquiryId = createdInquiry.id;
    } else {
      // In-memory dev fallback record
      const mockId = `mock-${Date.now()}`;
      devInquiriesStore.push({
        id: mockId,
        phone: normalizedPhone,
        name: data.name,
        createdAt: new Date(),
      });
      savedInquiryId = mockId;
    }
  } catch (dbSaveError) {
    console.error("Database save failed for inquiry:", dbSaveError);
    return {
      status: "error",
      message: "We encountered a temporary database error while processing your request. Please message us on WhatsApp so we can assist you immediately.",
      whatsappFallbackUrl: failureWhatsAppLink,
    };
  }

  // 6. Email the agency (AGENCY_EMAIL) through Resend with all details and a WhatsApp reply link.
  // If the email fails, log the error but still return success because the inquiry is saved.
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const agencyEmail = process.env.AGENCY_EMAIL || "info@noortravels.pk";

    // Build the direct WhatsApp reply link for the agency staff to respond to the visitor
    const visitorWhatsAppReplyLink = buildWhatsAppLink({
      phone: normalizedPhone,
      message: `Assalam o Alaikum ${data.name},\nThank you for inquiring with Noor Travels${resolvedPackageTitle ? ` about ${resolvedPackageTitle}` : ""}. How may we assist you today?`,
    });

    const emailSubject = `New Umrah Inquiry from ${data.name}${resolvedPackageTitle ? ` (${resolvedPackageTitle})` : " (General Inquiry)"}`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E9E0CC; border-radius: 12px; background-color: #FBF8F1;">
        <div style="text-align: center; border-bottom: 2px solid #B8862B; padding-bottom: 16px; margin-bottom: 20px;">
          <h1 style="color: #0B2A5B; margin: 0; font-size: 24px;">Noor Travels</h1>
          <p style="color: #B8862B; margin: 4px 0 0 0; font-size: 14px; font-weight: bold;">New Website Inquiry</p>
        </div>

        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #E9E0CC; margin-bottom: 20px;">
          <h2 style="color: #0B2A5B; margin-top: 0; font-size: 18px; border-bottom: 1px solid #E9E0CC; padding-bottom: 8px;">Traveler Details</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #0A2250;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 35%;">Full Name:</td>
              <td style="padding: 8px 0;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Phone / WhatsApp:</td>
              <td style="padding: 8px 0;">
                <a href="${visitorWhatsAppReplyLink}" style="color: #0B2A5B; font-weight: bold; text-decoration: underline;">
                  ${data.phone}
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0;">${data.email || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Package:</td>
              <td style="padding: 8px 0;">${resolvedPackageTitle || (data.packageId ? `Package ID: ${data.packageId}` : "General Umrah Inquiry")}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Room Type:</td>
              <td style="padding: 8px 0;">${data.roomType || "Standard / Flexible"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Travelers:</td>
              <td style="padding: 8px 0;">
                <strong>${data.adults}</strong> Adults
                ${data.children > 0 ? `, <strong>${data.children}</strong> Children` : ""}
                ${data.infants > 0 ? `, <strong>${data.infants}</strong> Infants` : ""}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Special Requests:</td>
              <td style="padding: 8px 0; white-space: pre-wrap;">${data.message || "None"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Status:</td>
              <td style="padding: 8px 0;"><span style="background-color: #D9A73A; color: #ffffff; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">NEW</span></td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${visitorWhatsAppReplyLink}" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 12px 24px; border-radius: 9999px; font-weight: bold; text-decoration: none; font-size: 15px;">
            Reply to ${data.name} on WhatsApp
          </a>
        </div>

        <div style="margin-top: 24px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #E9E0CC; padding-top: 12px;">
          <p style="margin: 0;">Inquiry Reference ID: ${savedInquiryId}</p>
          <p style="margin: 4px 0 0 0;">Received at: ${new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" })} PKT</p>
        </div>
      </div>
    `;

    if (resendApiKey && !resendApiKey.includes("sample")) {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: `Noor Travels Inquiries <onboarding@resend.dev>`,
        to: agencyEmail,
        replyTo: data.email || undefined,
        subject: emailSubject,
        html: emailHtml,
      });
    } else {
      console.log("[Resend Dev Mock] Email would be sent to:", agencyEmail, "with subject:", emailSubject);
    }
  } catch (emailError) {
    // If the email fails, log the error but still return success because the inquiry is saved
    console.error("Resend email delivery failed, but inquiry is safely saved:", emailError);
  }

  // Success response informing visitor that agency will contact them on their number
  return {
    status: "success",
    submittedPhone: data.phone,
    message: `Thank you, ${data.name}! Your inquiry has been received. Our team will contact you shortly on ${data.phone}.`,
  };
}
