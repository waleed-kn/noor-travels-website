"use server";

import { requireAuth } from "@/lib/auth-helpers";
import prisma from "@/lib/db";
import { InquiryStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

function isRealDatabaseConfigured(): boolean {
  const dbUrl = process.env.DATABASE_URL;
  return Boolean(dbUrl && !dbUrl.includes("ep-sample") && !dbUrl.includes("placeholder"));
}

export async function updateInquiryStatus(inquiryId: string, status: InquiryStatus) {
  // Call auth() / requireAuth inside every admin server action!
  const admin = await requireAuth();

  if (isRealDatabaseConfigured()) {
    try {
      await prisma.inquiry.update({
        where: { id: inquiryId },
        data: { status },
      });
    } catch (err) {
      console.error("Failed to update inquiry status in DB:", err);
      return { success: false, error: "Database update failed" };
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  return { success: true };
}
