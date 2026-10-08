import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, Calendar } from "lucide-react";
import { PriceGrid } from "@/components/ui/PriceGrid";
import { WhatsAppIcon } from "@/components/icons";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PackageWithRelations } from "@/lib/queries";

export interface PackageCardProps {
  package: PackageWithRelations;
  index?: number;
  priorityImage?: boolean;
}

const statusConfig: Record<string, { label: string; containerClass: string; dotClass: string }> = {
  OPEN: {
    label: "Open",
    containerClass: "bg-white/95 text-emerald-800 border-emerald-300/80 shadow-xs",
    dotClass: "bg-emerald-500",
  },
  FEW_SEATS: {
    label: "Few Seats",
    containerClass: "bg-white/95 text-amber-800 border-amber-300/80 shadow-xs",
    dotClass: "bg-amber-500",
  },
  CLOSED: {
    label: "Closed",
    containerClass: "bg-white/95 text-rose-800 border-rose-300/80 shadow-xs",
    dotClass: "bg-rose-500",
  },
};

export function PackageCard({ package: pkg, index, priorityImage = false }: PackageCardProps) {
  const makkahHotel = pkg.hotelStays?.find((h) => h.city === "MAKKAH");
  const madinahHotel = pkg.hotelStays?.find((h) => h.city === "MADINAH");

  const isClosed = pkg.status === "CLOSED";
  const statusInfo = statusConfig[pkg.status] || statusConfig.OPEN;

  const packageWaUrl = buildWhatsAppLink(
    isClosed
      ? `Assalam o Alaikum, I would like to inquire about seat availability for the "${pkg.title}" package with Noor Travels.`
      : `Assalam o Alaikum, I would like to book the "${pkg.title}" package with Noor Travels.`
  );

  const badgeNumber = index !== undefined ? String(index + 1).padStart(2, "0") : undefined;

  const formattedDepDate = pkg.departureDate
    ? new Date(pkg.departureDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <article className="flex flex-col bg-white rounded-2xl border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Package Cover Image with Numbered Gold Badge and Status Badge */}
      <div className="relative h-52 w-full bg-navy overflow-hidden">
        <Image
          src={pkg.coverImage || "/package-default.jpg"}
          alt={`${pkg.title} Cover`}
          fill
          priority={priorityImage}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        {/* Numbered Gold Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-white font-bold text-xs tracking-wider shadow-md border border-white/20">
          {badgeNumber && (
            <>
              <span>{badgeNumber}</span>
              <span className="text-white/60">/</span>
            </>
          )}
          <span>{pkg.durationDays}D</span>
        </div>

        {/* Status Badge & Airline Badge */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
          {/* Status Label Badge: Open, Few Seats, or Closed */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide backdrop-blur-xs border ${statusInfo.containerClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} aria-hidden="true" />
            <span>{statusInfo.label}</span>
          </span>

          {/* Airline Badge */}
          <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-xs text-navy font-semibold text-xs shadow-xs border border-white/40">
            {pkg.airline}
          </span>
        </div>

        {/* Package Duration, City and Departure Date bottom overlay */}
        <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-xs text-cream">
          <span className="flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-gold-light" aria-hidden="true" />
            <span>Departing {pkg.departureCity}</span>
          </span>
          <span className="font-semibold flex items-center gap-1">
            {formattedDepDate && (
              <>
                <Calendar className="w-3.5 h-3.5 text-gold-light" aria-hidden="true" />
                <span>{formattedDepDate}</span>
                <span className="text-cream/50">•</span>
              </>
            )}
            <span>{pkg.durationDays} Days</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Title linking to /packages/[slug] */}
          <Link
            href={`/packages/${pkg.slug}`}
            className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
          >
            <h3 className="font-display text-2xl font-bold text-navy group-hover:text-gold-dark transition-colors line-clamp-1">
              {pkg.title}
            </h3>
          </Link>

          {/* Hotel Stays Details */}
          <div className="mt-4 space-y-3 pt-3 border-t border-border/80">
            {/* Makkah Hotel and Note */}
            {makkahHotel && (
              <div className="p-3 rounded-xl bg-sand/40 border border-border/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gold-dark">
                    Makkah Hotel
                  </span>
                  <span className="text-[11px] font-bold text-navy bg-white px-2 py-0.5 rounded border border-border">
                    {makkahHotel.nights} Nights
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm text-navy">
                  {makkahHotel.hotelName}
                </h4>
                <p className="text-xs text-navy-deep/75 mt-0.5 flex items-start gap-1">
                  <MapPin className="w-3 h-3 text-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{makkahHotel.locationNote}</span>
                </p>
              </div>
            )}

            {/* Madinah Hotel and Note */}
            {madinahHotel && (
              <div className="p-3 rounded-xl bg-sand/40 border border-border/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gold-dark">
                    Madinah Hotel
                  </span>
                  <span className="text-[11px] font-bold text-navy bg-white px-2 py-0.5 rounded border border-border">
                    {madinahHotel.nights} Nights
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm text-navy">
                  {madinahHotel.hotelName}
                </h4>
                <p className="text-xs text-navy-deep/75 mt-0.5 flex items-start gap-1">
                  <MapPin className="w-3 h-3 text-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{madinahHotel.locationNote}</span>
                </p>
              </div>
            )}
          </div>

          {/* PriceGrid */}
          <div className="mt-5">
            <span className="text-xs uppercase font-bold tracking-wider text-navy/70 block mb-2">
              Room Pricing (Per Person)
            </span>
            <PriceGrid prices={pkg.prices} />
          </div>
        </div>

        {/* Card Footer: Book Now Button or Ask on WhatsApp */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-3">
          <Link
            href={`/packages/${pkg.slug}`}
            className="text-xs font-semibold text-navy hover:text-gold-dark transition-colors inline-flex items-center gap-1"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>

          {isClosed ? (
            <a
              href={packageWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-navy hover:bg-navy-deep text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
              aria-label={`Ask about ${pkg.title} on WhatsApp`}
            >
              <WhatsAppIcon className="w-4 h-4 fill-current text-green-400" />
              <span>Ask on WhatsApp</span>
            </a>
          ) : (
            <a
              href={packageWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-light to-gold-dark hover:from-gold hover:to-gold-dark text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label={`Book ${pkg.title} on WhatsApp`}
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>Book Now</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
