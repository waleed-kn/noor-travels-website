import { siteConfig } from "./site";

export const DEFAULT_WHATSAPP_NUMBER = siteConfig.defaultWhatsAppNumber;
export const DISPLAY_PHONES = siteConfig.displayPhones;

interface WhatsAppLinkOptions {
  phone?: string;
  message?: string;
}

/**
 * Builds a wa.me direct chat link with a pre-filled message.
 *
 * @param messageOrOptions Either a string message or an options object
 * @param phone Optional phone number override (defaults to 923129121411)
 * @returns Fully qualified wa.me URL
 */
export function buildWhatsAppLink(
  messageOrOptions?: string | WhatsAppLinkOptions,
  phone?: string
): string {
  let targetPhone = DEFAULT_WHATSAPP_NUMBER;
  let text = "";

  if (typeof messageOrOptions === "string") {
    text = messageOrOptions;
    if (phone) targetPhone = phone;
  } else if (messageOrOptions) {
    if (messageOrOptions.phone) targetPhone = messageOrOptions.phone;
    if (messageOrOptions.message) text = messageOrOptions.message;
  }

  // Strip non-digit characters from the phone number
  const sanitizedPhone = targetPhone.replace(/\D/g, "");

  if (!text) {
    return `https://wa.me/${sanitizedPhone}`;
  }

  return `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(text.trim())}`;
}
