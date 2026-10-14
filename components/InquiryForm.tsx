"use client";

import React, { useActionState, useState } from "react";
import { submitInquiry, initialInquiryState } from "@/app/actions/inquiry";
import { Field, FieldWrapper, Button } from "@/components/ui";
import { Turnstile } from "@/components/Turnstile";
import { WhatsAppIcon } from "@/components/icons";
import { siteConfig } from "@/lib/site";
import {
  CheckCircle2,
  AlertTriangle,
  Send,
  Users,
  Bed,
  PhoneCall,
  Calendar,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

export interface InquiryFormProps {
  packageId?: string;
  packageTitle?: string;
  defaultRoomType?: "SHARING" | "QUAD" | "TRIPLE" | "DOUBLE";
  title?: string;
  description?: string;
  compact?: boolean;
  className?: string;
}

export function InquiryForm({
  packageId,
  packageTitle,
  defaultRoomType = "QUAD",
  title = "Send an Inquiry",
  description = "Fill out the form below and an Umrah consultant will contact you promptly.",
  compact = false,
  className = "",
}: InquiryFormProps) {
  const [state, formAction, isPending] = useActionState(submitInquiry, initialInquiryState);
  const [isSuccessDismissed, setIsSuccessDismissed] = useState(false);

  // When submission succeeds, show the dedicated confirmation view
  if (state.status === "success" && !isSuccessDismissed) {
    return (
      <div
        className={`bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm text-center animate-fadeIn ${className}`}
        tabIndex={-1}
        aria-live="polite"
      >
        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-sand text-gold-dark text-xs font-bold uppercase tracking-wider mb-2">
          Inquiry Received
        </span>

        <h3 className="font-display text-2xl font-bold text-navy mb-2">
          Thank You!
        </h3>

        <p className="text-navy-deep/80 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-6">
          {state.message ||
            `We have safely received your inquiry. Our Umrah team will contact you shortly on ${state.submittedPhone || "your phone number"}.`}
        </p>

        {packageTitle && (
          <div className="bg-sand/30 border border-border rounded-xl p-3 text-xs text-navy/80 mb-6 max-w-sm mx-auto">
            <span className="font-semibold block text-navy mb-0.5">Package Requested:</span>
            <span>{packageTitle}</span>
          </div>
        )}

        <div className="space-y-3 pt-2 max-w-sm mx-auto">
          <a
            href={`https://wa.me/${siteConfig.defaultWhatsAppNumber}?text=${encodeURIComponent(
              `Assalam o Alaikum, I just submitted an inquiry on your website${packageTitle ? ` for ${packageTitle}` : ""}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm shadow-sm hover:shadow transition-all active:scale-98"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current" />
            <span>Chat Directly on WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => setIsSuccessDismissed(true)}
            className="text-xs text-navy/70 hover:text-navy hover:underline py-1"
          >
            Submit Another Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl border border-border p-6 sm:p-7 shadow-sm ${className}`}>
      {/* Header */}
      <div className="pb-4 mb-5 border-b border-border">
        {packageTitle ? (
          <span className="inline-block px-3 py-1 rounded-full bg-sand text-gold-dark text-xs font-bold uppercase tracking-wider mb-2">
            Inquire for {packageTitle}
          </span>
        ) : (
          <span className="inline-block px-3 py-1 rounded-full bg-sand text-gold-dark text-xs font-bold uppercase tracking-wider mb-2">
            Instant Inquiry
          </span>
        )}
        <h2 className="font-display text-2xl font-bold text-navy">{title}</h2>
        {description && (
          <p className="text-xs sm:text-sm text-navy-deep/70 mt-1">{description}</p>
        )}
      </div>

      {/* Global Form-level Error Alert with WhatsApp Fallback link */}
      {state.status === "error" && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm space-y-2 animate-fadeIn"
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">
                {state.message || "Failed to submit inquiry. Please review the errors below."}
              </p>
              {state.errors?._form && (
                <ul className="list-disc pl-5 mt-1 text-xs text-red-800">
                  {state.errors._form.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* WhatsApp Fallback Link */}
          {state.whatsappFallbackUrl && (
            <div className="pt-2 border-t border-red-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs text-red-800 font-medium">
                Need immediate help or booking assistance?
              </span>
              <a
                href={state.whatsappFallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1EBE5D] hover:underline"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                <span>Chat on WhatsApp Instead</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Inquiry Form */}
      <form action={formAction} className="space-y-4" noValidate>
        {/* Hidden Honeypot field (silently catches automated bots) */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="inquiry-website-hp">Leave this field blank</label>
          <input
            id="inquiry-website-hp"
            type="text"
            name="website_hp"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Hidden Package Field */}
        <input type="hidden" name="packageId" value={packageId || ""} />

        {/* Name and Phone */}
        <div className={`grid grid-cols-1 ${compact ? "gap-3" : "sm:grid-cols-2 gap-4"}`}>
          <Field
            id="inquiry-name"
            name="name"
            label="Full Name"
            placeholder="e.g. Ahmad Khan"
            required
            error={state.errors?.name}
            disabled={isPending}
          />

          <Field
            id="inquiry-phone"
            name="phone"
            type="tel"
            label="Phone or WhatsApp Number"
            placeholder="0312-XXXXXXX"
            required
            helperText="We will contact you on this number"
            error={state.errors?.phone}
            disabled={isPending}
          />
        </div>

        {/* Email and Room Type */}
        <div className={`grid grid-cols-1 ${compact ? "gap-3" : "sm:grid-cols-2 gap-4"}`}>
          <Field
            id="inquiry-email"
            name="email"
            type="email"
            label="Email Address (Optional)"
            placeholder="ahmad@example.com"
            error={state.errors?.email}
            disabled={isPending}
          />

          <FieldWrapper
            id="inquiry-roomType"
            label="Room Type"
            error={state.errors?.roomType}
          >
            <div className="relative">
              <select
                id="inquiry-roomType"
                name="roomType"
                defaultValue={defaultRoomType}
                disabled={isPending}
                aria-invalid={Boolean(state.errors?.roomType)}
                aria-describedby={state.errors?.roomType ? "inquiry-roomType-error" : undefined}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-navy-deep bg-white focus:outline-none focus:ring-2 focus:ring-gold/70 focus:border-gold transition-colors ${
                  state.errors?.roomType ? "border-red-500" : "border-border hover:border-gold/40"
                }`}
              >
                <option value="SHARING">Sharing (5-bed economy)</option>
                <option value="QUAD">Quad (4-bed standard)</option>
                <option value="TRIPLE">Triple (3-bed)</option>
                <option value="DOUBLE">Double (2-bed private)</option>
              </select>
            </div>
          </FieldWrapper>
        </div>

        {/* Travelers: Adults, Children, Infants */}
        <div>
          <label className="text-xs sm:text-sm font-semibold text-navy flex items-center gap-1.5 mb-1.5">
            <Users className="w-3.5 h-3.5 text-gold" />
            <span>Travelers in Group</span>
            <span className="text-gold-dark" aria-hidden="true">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label htmlFor="inquiry-adults" className="block text-[11px] text-navy/70 mb-1">
                Adults (12+)
              </label>
              <input
                id="inquiry-adults"
                name="adults"
                type="number"
                min={1}
                defaultValue={1}
                disabled={isPending}
                aria-invalid={Boolean(state.errors?.adults)}
                aria-describedby={state.errors?.adults ? "inquiry-adults-error" : undefined}
                className={`w-full px-3 py-2 rounded-xl border text-center text-sm font-semibold text-navy bg-white focus:outline-none focus:ring-2 focus:ring-gold/70 ${
                  state.errors?.adults ? "border-red-500" : "border-border"
                }`}
              />
              {state.errors?.adults && (
                <p id="inquiry-adults-error" className="text-[11px] text-red-600 mt-1" role="alert">
                  {state.errors.adults[0]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="inquiry-children" className="block text-[11px] text-navy/70 mb-1">
                Children (2-11)
              </label>
              <input
                id="inquiry-children"
                name="children"
                type="number"
                min={0}
                defaultValue={0}
                disabled={isPending}
                aria-invalid={Boolean(state.errors?.children)}
                aria-describedby={state.errors?.children ? "inquiry-children-error" : undefined}
                className={`w-full px-3 py-2 rounded-xl border text-center text-sm font-semibold text-navy bg-white focus:outline-none focus:ring-2 focus:ring-gold/70 ${
                  state.errors?.children ? "border-red-500" : "border-border"
                }`}
              />
              {state.errors?.children && (
                <p id="inquiry-children-error" className="text-[11px] text-red-600 mt-1" role="alert">
                  {state.errors.children[0]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="inquiry-infants" className="block text-[11px] text-navy/70 mb-1">
                Infants (&lt;2)
              </label>
              <input
                id="inquiry-infants"
                name="infants"
                type="number"
                min={0}
                defaultValue={0}
                disabled={isPending}
                aria-invalid={Boolean(state.errors?.infants)}
                aria-describedby={state.errors?.infants ? "inquiry-infants-error" : undefined}
                className={`w-full px-3 py-2 rounded-xl border text-center text-sm font-semibold text-navy bg-white focus:outline-none focus:ring-2 focus:ring-gold/70 ${
                  state.errors?.infants ? "border-red-500" : "border-border"
                }`}
              />
              {state.errors?.infants && (
                <p id="inquiry-infants-error" className="text-[11px] text-red-600 mt-1" role="alert">
                  {state.errors.infants[0]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Message / Special Requests */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="inquiry-message" className="text-xs sm:text-sm font-semibold text-navy flex items-center justify-between">
            <span>Special Requests or Notes (Optional)</span>
            <span className="text-[11px] text-navy/50 font-normal">Max 1000 characters</span>
          </label>
          <textarea
            id="inquiry-message"
            name="message"
            rows={compact ? 2 : 3}
            maxLength={1000}
            disabled={isPending}
            placeholder="Preferred departure dates, wheelchair assistance, or hotel requirements..."
            aria-invalid={Boolean(state.errors?.message)}
            aria-describedby={state.errors?.message ? "inquiry-message-error" : undefined}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-navy-deep bg-white placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-gold/70 focus:border-gold resize-none transition-colors ${
              state.errors?.message ? "border-red-500" : "border-border hover:border-gold/40"
            }`}
          />
          {state.errors?.message && (
            <p id="inquiry-message-error" className="text-xs text-red-600 font-medium" role="alert">
              {state.errors.message.join(", ")}
            </p>
          )}
        </div>

        {/* Cloudflare Turnstile Spam Protection */}
        <div className="pt-1">
          <Turnstile size={compact ? "compact" : "normal"} />
          {state.errors?.turnstile && (
            <p className="text-xs text-red-600 font-medium mt-1" role="alert">
              {state.errors.turnstile[0]}
            </p>
          )}
        </div>

        {/* Submit Button with Pending State */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="md"
            isLoading={isPending}
            disabled={isPending}
            className="shadow-md hover:shadow-lg"
          >
            <Send className="w-4 h-4 mr-1.5" />
            <span>{isPending ? "Sending Inquiry..." : "Submit Inquiry"}</span>
          </Button>

          <p className="text-[11px] text-navy-deep/60 text-center mt-2.5 flex items-center justify-center gap-1.5">
            <PhoneCall className="w-3 h-3 text-gold-dark" />
            <span>We usually respond within 15–30 minutes during office hours.</span>
          </p>
        </div>
      </form>
    </div>
  );
}
