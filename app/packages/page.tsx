import React from "react";
import Link from "next/link";
import {
  Container,
} from "@/components/ui";
import { PackageCard } from "@/components/PackageCard";
import {
  getPublishedPackages,
  getLowestPrice,
  getYearMonthString,
} from "@/lib/queries";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons";
import {
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Calendar,
  DollarSign,
  CheckCircle2,
  X,
} from "lucide-react";

export const metadata = {
  title: "All Umrah Packages & Pilgrimage Itineraries | Noor Travels",
  description:
    "Browse verified Umrah packages departing from Peshawar. Filter by departure month, room price, and seat status with direct flights and star hotels.",
};

interface PackagesPageProps {
  searchParams?: Promise<{
    month?: string;
    price?: string;
    status?: string;
    demo?: string;
  }>;
}

function formatMonthLabel(ym: string): string {
  const [yearStr, monthStr] = ym.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  if (isNaN(year) || isNaN(month)) return ym;
  const date = new Date(Date.UTC(year, month - 1, 1));
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

const priceOptions = [
  { value: "", label: "All Prices" },
  { value: "under-250k", label: "Under PKR 250,000" },
  { value: "250k-275k", label: "PKR 250,000 – 275,000" },
  { value: "275k-300k", label: "PKR 275,000 – 300,000" },
  { value: "above-300k", label: "Above PKR 300,000" },
];

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "OPEN", label: "Open" },
  { value: "FEW_SEATS", label: "Few Seats" },
];

export default async function PackagesPage({ searchParams }: PackagesPageProps) {
  const params = (await searchParams) || {};

  const selectedMonth = typeof params.month === "string" ? params.month : "";
  const selectedPrice = typeof params.price === "string" ? params.price : "";
  const selectedStatus = typeof params.status === "string" ? params.status : "";
  const isDemo = params.demo === "1" || params.demo === "true";

  // Fetch all published, non-archived packages
  const allPackages = await getPublishedPackages();

  // Dynamically extract distinct departure months from all published packages
  const availableMonths = Array.from(
    new Set(allPackages.map((p) => getYearMonthString(p.departureDate)))
  ).sort();

  // Filter packages based on server URL search params
  let filteredPackages = allPackages;

  if (selectedMonth) {
    filteredPackages = filteredPackages.filter(
      (p) => getYearMonthString(p.departureDate) === selectedMonth
    );
  }

  if (selectedStatus) {
    filteredPackages = filteredPackages.filter((p) => p.status === selectedStatus);
  }

  if (selectedPrice) {
    filteredPackages = filteredPackages.filter((p) => {
      const lowest = getLowestPrice(p);
      if (selectedPrice === "under-250k") return lowest < 250000;
      if (selectedPrice === "250k-275k") return lowest >= 250000 && lowest <= 275000;
      if (selectedPrice === "275k-300k") return lowest >= 275000 && lowest <= 300000;
      if (selectedPrice === "above-300k") return lowest > 300000;
      return true;
    });
  }

  // Sort by sortOrder then departure date
  filteredPackages.sort((a, b) => {
    const orderA = a.sortOrder ?? 0;
    const orderB = b.sortOrder ?? 0;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime();
  });

  const hasActiveFilters = Boolean(selectedMonth || selectedPrice || selectedStatus);

  const customWaUrl = buildWhatsAppLink(
    "Assalam o Alaikum, I would like to inquire about custom Umrah package dates and family arrangements with Noor Travels."
  );

  // Helper to build active badge removal URLs
  const createFilterUrl = (overrides: { month?: string; price?: string; status?: string }) => {
    const q = new URLSearchParams();
    const m = overrides.month !== undefined ? overrides.month : selectedMonth;
    const p = overrides.price !== undefined ? overrides.price : selectedPrice;
    const s = overrides.status !== undefined ? overrides.status : selectedStatus;

    if (m) q.set("month", m);
    if (p) q.set("price", p);
    if (s) q.set("status", s);
    if (isDemo) q.set("demo", "1");

    const qs = q.toString();
    return qs ? `/packages?${qs}` : "/packages";
  };

  return (
    <div className="flex flex-col min-h-screen bg-sand/15">
      {/* 1. Header Banner */}
      <section className="py-12 sm:py-16 bg-cream border-b border-border/80">
        <Container>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand text-gold-dark text-xs sm:text-sm font-bold uppercase tracking-wider border border-gold/30 shadow-xs mb-3">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>PILGRIMAGE PROGRAMS</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy tracking-tight leading-tight">
              Umrah Packages &amp; Pilgrimage Itineraries
            </h1>
            <p className="mt-3 text-sm sm:text-base text-navy-deep/80 max-w-2xl leading-relaxed">
              Explore all published packages departing from Peshawar. Direct airline bookings, verified hotels close to the Haramain, and comprehensive ground arrangements.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. Server-Rendered Filter Bar (Works 100% without JavaScript) */}
      <section className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-border shadow-xs py-4">
        <Container>
          <form
            method="GET"
            action="/packages"
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-4"
          >
            {isDemo && <input type="hidden" name="demo" value="1" />}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
              {/* Departure Month Filter */}
              <div>
                <label
                  htmlFor="filter-month"
                  className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5 flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-gold-dark" aria-hidden="true" />
                  <span>Departure Month</span>
                </label>
                <div className="relative">
                  <select
                    id="filter-month"
                    name="month"
                    defaultValue={selectedMonth}
                    className="w-full h-11 px-3 py-2 bg-sand/30 hover:bg-sand/50 text-navy font-medium text-sm rounded-xl border border-border focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none transition-colors cursor-pointer appearance-none"
                  >
                    <option value="">All Months</option>
                    {availableMonths.map((ym) => (
                      <option key={ym} value={ym}>
                        {formatMonthLabel(ym)}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-navy-deep/60">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Price Range (Lowest Room Price) Filter */}
              <div>
                <label
                  htmlFor="filter-price"
                  className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5 flex items-center gap-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5 text-gold-dark" aria-hidden="true" />
                  <span>Price Range (Lowest)</span>
                </label>
                <div className="relative">
                  <select
                    id="filter-price"
                    name="price"
                    defaultValue={selectedPrice}
                    className="w-full h-11 px-3 py-2 bg-sand/30 hover:bg-sand/50 text-navy font-medium text-sm rounded-xl border border-border focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none transition-colors cursor-pointer appearance-none"
                  >
                    {priceOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-navy-deep/60">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Status Filter (Open or Few Seats) */}
              <div>
                <label
                  htmlFor="filter-status"
                  className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-dark" aria-hidden="true" />
                  <span>Status</span>
                </label>
                <div className="relative">
                  <select
                    id="filter-status"
                    name="status"
                    defaultValue={selectedStatus}
                    className="w-full h-11 px-3 py-2 bg-sand/30 hover:bg-sand/50 text-navy font-medium text-sm rounded-xl border border-border focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none transition-colors cursor-pointer appearance-none"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-navy-deep/60">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2.5 pt-1 lg:pt-0">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-navy hover:bg-navy-deep text-white font-semibold text-sm shadow-xs hover:shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <SlidersHorizontal className="w-4 h-4 text-gold-light" aria-hidden="true" />
                <span>Apply Filters</span>
              </button>

              {hasActiveFilters && (
                <Link
                  href={isDemo ? "/packages?demo=1" : "/packages"}
                  className="inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-xl bg-sand/60 hover:bg-sand text-navy font-semibold text-sm border border-border hover:border-gold/40 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-navy-deep/70" aria-hidden="true" />
                  <span>Reset</span>
                </Link>
              )}
            </div>
          </form>

          {/* Active Filter Badges Strip */}
          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-t border-border/60 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-navy-deep/70 font-semibold">Active filters:</span>

              {selectedMonth && (
                <Link
                  href={createFilterUrl({ month: "" })}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sand text-navy font-medium border border-border hover:border-rose-400 hover:text-rose-700 transition-colors"
                  title="Remove month filter"
                >
                  <span>Month: {formatMonthLabel(selectedMonth)}</span>
                  <X className="w-3 h-3" aria-hidden="true" />
                </Link>
              )}

              {selectedPrice && (
                <Link
                  href={createFilterUrl({ price: "" })}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sand text-navy font-medium border border-border hover:border-rose-400 hover:text-rose-700 transition-colors"
                  title="Remove price filter"
                >
                  <span>
                    Price: {priceOptions.find((p) => p.value === selectedPrice)?.label || selectedPrice}
                  </span>
                  <X className="w-3 h-3" aria-hidden="true" />
                </Link>
              )}

              {selectedStatus && (
                <Link
                  href={createFilterUrl({ status: "" })}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sand text-navy font-medium border border-border hover:border-rose-400 hover:text-rose-700 transition-colors"
                  title="Remove status filter"
                >
                  <span>
                    Status: {statusOptions.find((s) => s.value === selectedStatus)?.label || selectedStatus}
                  </span>
                  <X className="w-3 h-3" aria-hidden="true" />
                </Link>
              )}

              <Link
                href={isDemo ? "/packages?demo=1" : "/packages"}
                className="text-gold-dark hover:underline font-semibold ml-1"
              >
                Clear all filters
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* 3. Packages Grid or Empty State */}
      <section className="py-12 sm:py-16 flex-1">
        <Container>
          {/* Results Summary Bar */}
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-border/80">
            <div>
              <span className="text-sm font-semibold text-navy">
                Showing {filteredPackages.length}{" "}
                {filteredPackages.length === 1 ? "Package" : "Packages"}
              </span>
              {hasActiveFilters && (
                <span className="text-xs text-navy-deep/60 ml-2">
                  (filtered from {allPackages.length} total)
                </span>
              )}
            </div>

            <div className="text-xs text-navy-deep/60">
              Sorted by featured order &amp; departure date
            </div>
          </div>

          {filteredPackages.length > 0 ? (
            /* Shared PackageCard Grid (Exact same cards as home page) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPackages.map((pkg, index) => (
                <PackageCard
                  key={pkg.id || pkg.slug}
                  package={pkg}
                  index={index}
                  priorityImage={index === 0}
                />
              ))}
            </div>
          ) : (
            /* Empty State: Required when filters match nothing */
            <div className="max-w-2xl mx-auto my-10 p-8 sm:p-12 rounded-3xl bg-white border border-border shadow-sm text-center">
              <div className="w-16 h-16 rounded-full bg-sand flex items-center justify-center mx-auto mb-4 text-gold-dark border border-gold/30">
                <SlidersHorizontal className="w-8 h-8" aria-hidden="true" />
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-sand text-gold-dark text-xs font-bold uppercase tracking-wider mb-3">
                No Results
              </span>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy">
                No Packages Found
              </h2>

              <p className="mt-3 text-sm sm:text-base text-navy-deep/80 leading-relaxed max-w-md mx-auto">
                No packages matched your selected filter criteria. Try choosing a different departure month, price range, or reset your filters.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={isDemo ? "/packages?demo=1" : "/packages"}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-navy hover:bg-navy-deep text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-gold-light" aria-hidden="true" />
                  <span>Clear filters</span>
                </Link>

                <a
                  href={customWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-sand hover:bg-sand/80 text-navy font-semibold text-sm border border-border transition-all"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current text-gold-dark" />
                  <span>Inquire Custom Dates</span>
                </a>
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
