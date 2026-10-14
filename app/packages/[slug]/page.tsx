import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Container, Button, PriceGrid } from "@/components/ui";
import { getPackageBySlug, getPublishedPackages } from "@/lib/queries";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { money } from "@/lib/format";
import { siteConfig } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons";
import { InquiryForm } from "@/components/InquiryForm";
import {
  ArrowLeft,
  Plane,
  Building2,
  Calendar,
  MapPin,
  Baby,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export const revalidate = 60;

interface PackagePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const packages = await getPublishedPackages();
  return packages.map((pkg) => ({ slug: pkg.slug }));
}

export async function generateMetadata({ params }: PackagePageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);

  if (!pkg || !pkg.isPublished || pkg.archivedAt) {
    return {
      title: "Package Not Found | Noor Travels",
      description: "The requested Umrah package was not found.",
    };
  }

  const makkahHotel = pkg.hotelStays.find((h) => h.city === "MAKKAH");
  const madinahHotel = pkg.hotelStays.find((h) => h.city === "MADINAH");

  const hotelNames = [makkahHotel?.hotelName, madinahHotel?.hotelName]
    .filter(Boolean)
    .join(" & ");

  return {
    title: `${pkg.title} | Noor Travels`,
    description: `${pkg.durationDays} Days Umrah package departing from ${pkg.departureCity} with ${pkg.airline}. Staying at ${hotelNames || "verified star hotels"}. Confirmed flights, transfers, and complete pilgrim support.`,
  };
}

export default async function PackageDetailPage({ params }: PackagePageProps) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);

  if (!pkg || !pkg.isPublished || pkg.archivedAt) {
    notFound();
  }

  const makkahHotel = pkg.hotelStays.find((h) => h.city === "MAKKAH");
  const madinahHotel = pkg.hotelStays.find((h) => h.city === "MADINAH");

  const departureFormatted = new Date(pkg.departureDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const returnFormatted = new Date(pkg.returnDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const packageNumber = String(pkg.sortOrder || 1).padStart(2, "0");

  const waInquiryUrl = buildWhatsAppLink(
    `Assalam o Alaikum, I would like to inquire about the "${pkg.title}" package with Noor Travels.`
  );

  const childBedDiscountText = pkg.childPricing
    ? `${pkg.childPricing.childBedDiscount.toLocaleString("en-US")} less than the package price`
    : null;

  return (
    <div className="flex flex-col min-h-screen bg-sand/15">
      {/* 1. Navy Title Band */}
      <section className="bg-navy text-cream py-10 sm:py-14 border-b border-navy-deep relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--color-gold),_transparent_60%)] pointer-events-none" />

        <Container className="relative z-10">
          {/* Breadcrumb / Back Navigation */}
          <div className="mb-6">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-cream/70 hover:text-gold-light transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to All Packages</span>
            </Link>
          </div>

          <div className="max-w-4xl">
            {/* Meta tags strip */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
              {/* Package Number */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 text-gold-light text-xs font-bold uppercase tracking-wider border border-gold/40">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{`Package ${packageNumber}`}</span>
              </span>

              {/* Makkah Hotel Tag */}
              {makkahHotel && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cream text-xs font-semibold backdrop-blur-xs border border-white/15">
                  <Building2 className="w-3.5 h-3.5 text-gold-light" aria-hidden="true" />
                  <span>{makkahHotel.hotelName}</span>
                </span>
              )}

              {/* Airline Tag */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cream text-xs font-semibold backdrop-blur-xs border border-white/15">
                <Plane className="w-3.5 h-3.5 text-gold-light" aria-hidden="true" />
                <span>{pkg.airline}</span>
              </span>
            </div>

            {/* Main Title: "20 days Umrah from Peshawar" & Package Name */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cream tracking-tight leading-tight">
              {pkg.title}
            </h1>

            <p className="mt-3 text-lg sm:text-xl text-gold-light font-semibold">
              {`${pkg.durationDays} days Umrah from ${pkg.departureCity}`}
            </p>

            {/* Airline and Flight Dates */}
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-cream/80">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold-light" aria-hidden="true" />
                <span>
                  Dates: {departureFormatted} &ndash; {returnFormatted}
                </span>
              </span>
              <span className="hidden sm:inline text-cream/30">&bull;</span>
              <span className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-gold-light" aria-hidden="true" />
                <span>Carrier: {pkg.airline}</span>
              </span>
              <span className="hidden sm:inline text-cream/30">&bull;</span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-light" aria-hidden="true" />
                <span>Origin: {pkg.departureCity} Airport</span>
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Main Two-Column Layout */}
      <section className="py-12 sm:py-16 flex-1">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left Column (8 cols): Flight Details, Two Hotels, Room Pricing, Child/Infant Pricing */}
            <div className="lg:col-span-8 space-y-10">
              {/* A. Flight Details Table (Responsive scroll inside own container) */}
              <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-border gap-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-dark mb-1">
                      <Plane className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Confirmed Flight Schedule</span>
                    </div>
                    <h2 className="font-display text-2xl font-bold text-navy">
                      Flight Itinerary &amp; Route Details
                    </h2>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sand/60 text-navy font-semibold text-xs border border-border self-start sm:self-auto">
                    <span>Airline: {pkg.airline}</span>
                  </span>
                </div>

                {pkg.flightLegs && pkg.flightLegs.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-left text-xs sm:text-sm min-w-[540px]">
                      <thead className="bg-sand/40 text-navy font-bold uppercase tracking-wider text-[11px] border-b border-border">
                        <tr>
                          <th className="py-3 px-4">Flight / Leg</th>
                          <th className="py-3 px-4">Route</th>
                          <th className="py-3 px-4">Departure Date</th>
                          <th className="py-3 px-4">Departs</th>
                          <th className="py-3 px-4">Arrives</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {pkg.flightLegs.map((leg, index) => {
                          const legDate = new Date(leg.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          });

                          return (
                            <tr key={leg.id || index} className="hover:bg-sand/15 transition-colors">
                              <td className="py-3.5 px-4 font-semibold text-navy">
                                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-navy text-white mr-2">
                                  Leg {index + 1}
                                </span>
                                <span>{leg.flightNo}</span>
                              </td>
                              <td className="py-3.5 px-4 font-bold text-gold-dark">
                                {leg.route}
                              </td>
                              <td className="py-3.5 px-4 text-navy-deep/80">
                                {legDate}
                              </td>
                              <td className="py-3.5 px-4 font-medium text-navy">
                                {leg.depTime}
                              </td>
                              <td className="py-3.5 px-4 font-medium text-navy">
                                {leg.arrTime}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-navy-deep/70 italic py-4">
                    Direct scheduled flights with {pkg.airline}. Specific flight numbers and boarding times are finalized at the time of visa issuance.
                  </p>
                )}
              </div>

              {/* B. Two Hotel Cards (Makkah & Madinah) */}
              <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-xs">
                <div className="pb-5 mb-6 border-b border-border">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-dark mb-1">
                    <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Haramain Accommodations</span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-navy">
                    Hotel Stays &amp; Locations
                  </h2>
                  <p className="text-xs sm:text-sm text-navy-deep/70 mt-1">
                    Verified properties selected for proximity, cleanliness, and ease of access to Haram prayers.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Makkah Hotel Card */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-sand/35 border border-border hover:border-gold/40 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-gold text-white shadow-xs">
                          Makkah Mukarramah
                        </span>
                        {makkahHotel && (
                          <span className="text-xs font-bold text-navy bg-white px-2.5 py-1 rounded-md border border-border">
                            {makkahHotel.nights} Nights
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-xl font-bold text-navy mt-2">
                        {makkahHotel?.hotelName || "Makkah Star Hotel"}
                      </h3>

                      <p className="text-xs sm:text-sm text-navy-deep/80 mt-2 flex items-start gap-1.5 leading-relaxed">
                        <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span>
                          {makkahHotel?.locationNote || "Located in the central hotel district with regular shuttle services to Masjid al-Haram."}
                        </span>
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-border/70 flex items-center gap-2 text-xs text-navy font-medium">
                      <CheckCircle2 className="w-4 h-4 text-gold-dark" aria-hidden="true" />
                      <span>Round-the-clock reception &amp; luggage assistance</span>
                    </div>
                  </div>

                  {/* Madinah Hotel Card */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-sand/35 border border-border hover:border-gold/40 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-navy text-cream shadow-xs">
                          Madinah Munawwarah
                        </span>
                        {madinahHotel && (
                          <span className="text-xs font-bold text-navy bg-white px-2.5 py-1 rounded-md border border-border">
                            {madinahHotel.nights} Nights
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-xl font-bold text-navy mt-2">
                        {madinahHotel?.hotelName || "Madinah Central Hotel"}
                      </h3>

                      <p className="text-xs sm:text-sm text-navy-deep/80 mt-2 flex items-start gap-1.5 leading-relaxed">
                        <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span>
                          {madinahHotel?.locationNote || "Central area within comfortable walking proximity of Masjid an-Nabawi ladies & gents gates."}
                        </span>
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-border/70 flex items-center gap-2 text-xs text-navy font-medium">
                      <CheckCircle2 className="w-4 h-4 text-gold-dark" aria-hidden="true" />
                      <span>Walking distance to the Prophet&apos;s Mosque courtyard</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* C. Price-per-person Grid for the Four Room Types */}
              <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-xs">
                <div className="pb-5 mb-6 border-b border-border">
                  <span className="text-xs uppercase font-bold tracking-wider text-gold-dark block mb-1">
                    Room Pricing &amp; Occupancy
                  </span>
                  <h2 className="font-display text-2xl font-bold text-navy">
                    Price Per Person by Room Type
                  </h2>
                  <p className="text-xs sm:text-sm text-navy-deep/70 mt-1">
                    All-inclusive fares in PKR per pilgrim, including flights, hotels, visa, and ground transport.
                  </p>
                </div>

                <PriceGrid prices={pkg.prices} />
              </div>

              {/* D. Child & Infant Price List */}
              {pkg.childPricing && (
                <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-xs">
                  <div className="pb-5 mb-6 border-b border-border">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-dark mb-1">
                      <Baby className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Young Pilgrims</span>
                    </div>
                    <h2 className="font-display text-2xl font-bold text-navy">
                      Child &amp; Infant Price List
                    </h2>
                    <p className="text-xs sm:text-sm text-navy-deep/70 mt-1">
                      Subsidized rates for minors traveling under parental supervision.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Infant Under 2 Years */}
                    <div className="p-5 rounded-xl bg-sand/30 border border-border text-center flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-navy/70 block">
                          Infant (Under 2 Yrs)
                        </span>
                        <span className="font-display text-2xl sm:text-3xl font-bold text-navy mt-2 block">
                          {money(pkg.childPricing.infantPrice)}
                        </span>
                        <span className="text-[11px] text-navy-deep/70 mt-1 block">
                          Includes visa &amp; airline infant ticket without separate seat or bed.
                        </span>
                      </div>
                    </div>

                    {/* Child Without Bed */}
                    <div className="p-5 rounded-xl bg-sand/30 border border-border text-center flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-navy/70 block">
                          Child (Without Bed)
                        </span>
                        <span className="font-display text-2xl sm:text-3xl font-bold text-navy mt-2 block">
                          {money(pkg.childPricing.childNoBedPrice)}
                        </span>
                        <span className="text-[11px] text-navy-deep/70 mt-1 block">
                          Ages 2&ndash;11 years. Includes airline seat, visa, transport, sharing parents&apos; bed.
                        </span>
                      </div>
                    </div>

                    {/* Child With Bed (Shown as "20,000 less than the package price" calculated from DB value) */}
                    <div className="p-5 rounded-xl bg-gold/10 border border-gold/40 text-center ring-1 ring-gold/20 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gold-dark block">
                          Child (With Bed)
                        </span>
                        <span className="font-display text-xl sm:text-2xl font-bold text-gold-dark mt-2 block">
                          {childBedDiscountText}
                        </span>
                        <span className="text-[11px] text-navy-deep/70 mt-1 block">
                          Deducted from the corresponding adult room rate with full separate bed.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (4 cols, sticky on desktop): "Send an inquiry" card & WhatsApp */}
            <div className="lg:col-span-4">
              <aside className="sticky top-28 space-y-6">
                <InquiryForm
                  packageId={pkg.id}
                  packageTitle={pkg.title}
                  compact={true}
                  title="Send an Inquiry"
                  description={`Reserve seats for ${pkg.title} or request custom dates for your family.`}
                />

                <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                  {/* Primary WhatsApp Action */}
                  <span className="text-xs uppercase font-bold text-navy/70 block mb-2 text-center">
                    Immediate Response via WhatsApp
                  </span>

                    <a
                      href={waInquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark hover:from-gold hover:to-gold-dark text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      aria-label={`Chat on WhatsApp about ${pkg.title}`}
                    >
                      <WhatsAppIcon className="w-5 h-5 fill-current" />
                      <span>Chat on WhatsApp</span>
                    </a>

                    <p className="text-center text-[11px] text-navy-deep/60 mt-3 leading-relaxed">
                      Instant connection with {siteConfig.name} Umrah consultants in Peshawar Saddar.
                    </p>
                  </div>
              </aside>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
