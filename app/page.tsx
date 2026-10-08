import React from "react";
import Image from "next/image";
import { Container, SectionHeading, Card, Button, IconRing } from "@/components/ui";
import { getFeaturedPackages, getMockupPackages, PackageWithRelations } from "@/lib/queries";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { money } from "@/lib/format";
import { siteConfig } from "@/lib/site";
import { PackageCard } from "@/components/PackageCard";
import {
  Plane,
  Building2,
  Calendar,
  MapPin,
  Sparkles,
  Compass,
  Headphones,
  Users,
  Baby,
  CheckCircle2,
  Info,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";

export const metadata = {
  title: "Noor Travels | Umrah Packages & Travel Services",
  description: "Specialized Umrah packages and pilgrimage travel services from Peshawar, Pakistan.",
};

interface HomePageProps {
  searchParams?: Promise<{ demo?: string; preview?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const isDemo = params?.demo === "1" || params?.demo === "true" || params?.preview === "1";

  // Fetch featured packages from the database
  const dbPackages = await getFeaturedPackages(3);

  // If database returned packages, use them. If DB is empty/unconnected but demo flag is passed, use mockup packages.
  let packages: PackageWithRelations[] = dbPackages;
  if (packages.length === 0 && isDemo) {
    packages = getMockupPackages();
  }

  const hasPackages = packages.length > 0;
  const firstPackage = hasPackages ? packages[0] : null;

  const defaultWaLink = buildWhatsAppLink(siteConfig.defaultWhatsAppMessage);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <header className="relative py-20 sm:py-28 md:py-32 overflow-hidden bg-sand/30 border-b border-border">
        {/* Hero Background Image - Bright and Vibrant */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.jpg"
            alt="Masjid al-Haram Kaaba Makkah during golden hour"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-110 contrast-105 saturate-110"
          />
          {/* Subtle directional gradient so text on left is readable while Kaaba on right shines bright */}
          <div className="absolute inset-0 bg-gradient-to-r from-cream/90 via-cream/45 to-transparent sm:from-cream/85 sm:via-cream/35 sm:to-transparent" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-3xl">
            {/* Heading & Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sand text-gold-dark text-xs sm:text-sm font-bold tracking-wider uppercase border border-gold/30 shadow-xs mb-4">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>UMRAH PACKAGE</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-navy leading-[1.15] drop-shadow-xs">
              Your Spiritual Journey /{" "}
              <span className="text-gold-dark">Our Dedicated Service</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-navy-deep/90 font-medium leading-relaxed max-w-2xl">
              Carefully organized Umrah pilgrimage programs from Peshawar. Direct flights, handpicked hotels close to the Haramain, and 24/7 personalized care.
            </p>

            {/* The white "20 Days / Peshawar / Qatar Airways" card */}
            <div className="mt-8 inline-flex flex-wrap items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-white border border-border shadow-md">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sand text-navy font-bold text-sm sm:text-base">
                <Calendar className="w-4 h-4 text-gold-dark" aria-hidden="true" />
                <span>{firstPackage?.durationDays || 20} Days</span>
              </div>
              <span className="text-border hidden sm:inline" aria-hidden="true">/</span>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sand/60 text-navy font-semibold text-sm sm:text-base">
                <MapPin className="w-4 h-4 text-gold-dark" aria-hidden="true" />
                <span>{firstPackage?.departureCity || "Peshawar"}</span>
              </div>
              <span className="text-border hidden sm:inline" aria-hidden="true">/</span>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sand/60 text-navy font-semibold text-sm sm:text-base">
                <Plane className="w-4 h-4 text-gold-dark" aria-hidden="true" />
                <span>{firstPackage?.airline || "Qatar Airways"}</span>
              </div>
            </div>

            {/* Hero CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href={defaultWaLink} variant="primary" size="lg">
                <WhatsAppIcon className="w-5 h-5 fill-current mr-2" />
                Book via WhatsApp
              </Button>
              <Button
                href="#packages"
                variant="outline"
                size="lg"
                className="bg-white/80 hover:bg-white text-navy border-navy/30 hover:border-navy"
              >
                View Packages
              </Button>
            </div>
          </div>

          {/* Four Icon Perks Strip in Hero */}
          <div className="mt-14 pt-8 border-t border-navy/15 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/85 backdrop-blur-sm border border-white/90 shadow-sm hover:bg-white transition-colors">
              <IconRing icon={<Building2 className="w-5 h-5" />} size="md" variant="solid" />
              <div>
                <span className="text-xs sm:text-sm font-bold text-navy block">
                  Comfortable Accommodation
                </span>
                <span className="text-[11px] text-navy-deep/70 hidden sm:block">
                  Verified hotels near Haram
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/85 backdrop-blur-sm border border-white/90 shadow-sm hover:bg-white transition-colors">
              <IconRing icon={<Plane className="w-5 h-5" />} size="md" variant="solid" />
              <div>
                <span className="text-xs sm:text-sm font-bold text-navy block">
                  Reliable Transport
                </span>
                <span className="text-[11px] text-navy-deep/70 hidden sm:block">
                  Modern AC buses & shuttles
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/85 backdrop-blur-sm border border-white/90 shadow-sm hover:bg-white transition-colors">
              <IconRing icon={<Users className="w-5 h-5" />} size="md" variant="solid" />
              <div>
                <span className="text-xs sm:text-sm font-bold text-navy block">
                  Experienced Guides
                </span>
                <span className="text-[11px] text-navy-deep/70 hidden sm:block">
                  Rituals guidance & Ziyarats
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/85 backdrop-blur-sm border border-white/90 shadow-sm hover:bg-white transition-colors">
              <IconRing icon={<Headphones className="w-5 h-5" />} size="md" variant="solid" />
              <div>
                <span className="text-xs sm:text-sm font-bold text-navy block">
                  24/7 Customer Support
                </span>
                <span className="text-[11px] text-navy-deep/70 hidden sm:block">
                  Constant peace of mind
                </span>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* When packages exist: render Flight Details, Packages, Child Pricing */}
      {hasPackages ? (
        <>
          {/* 2. Flight Details Card with four legs from first featured package */}
          {firstPackage && firstPackage.flightLegs && firstPackage.flightLegs.length > 0 && (
            <section className="py-12 sm:py-16 bg-cream">
              <Container>
                <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-border gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand text-gold-dark text-xs font-bold uppercase tracking-wider mb-2">
                        <Plane className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Confirmed Flight Schedule</span>
                      </div>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy">
                        Flight Itinerary & Route Details
                      </h2>
                      <p className="text-xs sm:text-sm text-navy-deep/70 mt-1">
                        Scheduled airline service with {firstPackage.airline} for {firstPackage.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 bg-sand/60 px-4 py-2.5 rounded-xl border border-border">
                      <Plane className="w-5 h-5 text-gold-dark" aria-hidden="true" />
                      <div>
                        <span className="text-xs text-navy-deep/70 block">Carrier</span>
                        <span className="text-sm font-bold text-navy">{firstPackage.airline}</span>
                      </div>
                    </div>
                  </div>

                  {/* Four Flight Legs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {firstPackage.flightLegs.map((leg, index) => {
                      const legDate = new Date(leg.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      });

                      return (
                        <div
                          key={leg.id || index}
                          className="p-4 rounded-xl bg-sand/30 border border-border hover:border-gold/50 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-navy text-white">
                                Leg {index + 1}
                              </span>
                              <span className="text-xs font-semibold text-gold-dark">
                                {leg.flightNo}
                              </span>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              <div className="text-center">
                                <span className="font-display text-xl font-bold text-navy block">
                                  {leg.route.split("-")[0]}
                                </span>
                                <span className="text-xs text-navy-deep/70 font-semibold">
                                  {leg.depTime}
                                </span>
                              </div>

                              <div className="flex-1 px-3 flex flex-col items-center">
                                <Plane className="w-4 h-4 text-gold transform rotate-90" aria-hidden="true" />
                                <div className="w-full h-[1.5px] bg-border my-1" />
                                <span className="text-[10px] text-navy-deep/50 uppercase font-medium">
                                  Direct
                                </span>
                              </div>

                              <div className="text-center">
                                <span className="font-display text-xl font-bold text-navy block">
                                  {leg.route.split("-")[1]}
                                </span>
                                <span className="text-xs text-navy-deep/70 font-semibold">
                                  {leg.arrTime}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-navy-deep/70">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-gold" aria-hidden="true" />
                              <span>{legDate}</span>
                            </span>
                            <span className="font-medium text-navy">Flight {leg.flightNo}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Container>
            </section>
          )}

          {/* 3. "Choose Your Package" Section */}
          <section id="packages" className="py-16 sm:py-20 bg-sand/20">
            <Container>
              <SectionHeading
                badge="Featured Pilgrimage Packages"
                title="Choose Your Package"
                description="Transparent, all-inclusive rates per person. Select from economy and premium star hotel options."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg, index) => (
                  <PackageCard key={pkg.id || pkg.slug} package={pkg} index={index} />
                ))}
              </div>
            </Container>
          </section>

          {/* 4. Child and Infant Pricing Strip from Database */}
          {firstPackage && firstPackage.childPricing && (
            <section className="py-12 bg-white border-y border-border">
              <Container>
                <div className="bg-sand/60 rounded-2xl border border-border p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-dark mb-1">
                        <Baby className="w-4 h-4" aria-hidden="true" />
                        <span>Family Accommodations</span>
                      </div>
                      <h2 className="font-display text-2xl font-bold text-navy">
                        Child & Infant Pricing
                      </h2>
                      <p className="text-xs sm:text-sm text-navy-deep/70 mt-1 max-w-md">
                        Special subsidized fares for young pilgrims traveling with parents.
                      </p>
                    </div>

                    {/* Pricing Grid Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 flex-1 max-w-2xl">
                      {/* Infant */}
                      <div className="p-4 rounded-xl bg-white border border-border shadow-xs text-center">
                        <span className="text-xs uppercase font-semibold text-navy/70 block">
                          Infant (Under 2 Yrs)
                        </span>
                        <span className="font-display text-xl sm:text-2xl font-bold text-navy-deep mt-1 block">
                          {money(firstPackage.childPricing.infantPrice)}
                        </span>
                        <span className="text-[11px] text-navy-deep/60 mt-0.5 block">
                          Without Bed & Seat
                        </span>
                      </div>

                      {/* Child Without Bed */}
                      <div className="p-4 rounded-xl bg-white border border-border shadow-xs text-center">
                        <span className="text-xs uppercase font-semibold text-navy/70 block">
                          Child Without Bed
                        </span>
                        <span className="font-display text-xl sm:text-2xl font-bold text-navy-deep mt-1 block">
                          {money(firstPackage.childPricing.childNoBedPrice)}
                        </span>
                        <span className="text-[11px] text-navy-deep/60 mt-0.5 block">
                          Ages 2 to 11 Years
                        </span>
                      </div>

                      {/* Child With Bed Discount */}
                      <div className="p-4 rounded-xl bg-white border border-gold/40 shadow-xs text-center ring-1 ring-gold/20">
                        <span className="text-xs uppercase font-bold text-gold-dark block">
                          Child Bed Discount
                        </span>
                        <span className="font-display text-xl sm:text-2xl font-bold text-gold-dark mt-1 block">
                          -{money(firstPackage.childPricing.childBedDiscount)}
                        </span>
                        <span className="text-[11px] text-navy-deep/60 mt-0.5 block">
                          Off Adult Quad Rate
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Container>
            </section>
          )}
        </>
      ) : (
        /* Empty State: Shown when no packages are published (works with zero packages) */
        <section id="packages" className="py-20 bg-sand/30">
          <Container>
            <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl bg-white border border-border shadow-md text-center">
              <div className="w-16 h-16 rounded-full bg-sand flex items-center justify-center mx-auto mb-5 text-gold-dark border border-gold/30">
                <Compass className="w-8 h-8" aria-hidden="true" />
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-sand text-gold-dark text-xs font-bold uppercase tracking-wider mb-3">
                Seasonal Update
              </span>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy">
                Umrah Packages Being Finalized
              </h2>

              <p className="mt-3 text-sm sm:text-base text-navy-deep/80 leading-relaxed max-w-lg mx-auto">
                Our team is currently finalizing seat reservations and hotel allocations for the upcoming pilgrimage season. Custom private and family packages are available on demand.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button href={defaultWaLink} variant="primary" size="lg">
                  <WhatsAppIcon className="w-5 h-5 fill-current mr-2" />
                  Inquire on WhatsApp
                </Button>
                <Button
                  href={`tel:${siteConfig.displayPhones[0].replace(/-/g, "")}`}
                  variant="outline"
                  size="lg"
                >
                  Call {siteConfig.displayPhones[0]}
                </Button>
              </div>

              <p className="mt-6 text-xs text-navy-deep/60 flex items-center justify-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                <span>Visit our Peshawar Saddar office for immediate bookings.</span>
              </p>
            </div>
          </Container>
        </section>
      )}

      {/* 5. Four-Perk Strip */}
      <section className="py-16 sm:py-20 bg-cream">
        <Container>
          <SectionHeading
            badge="Our Commitments"
            title="Why Pilgrims Choose Noor Travels"
            description="With years of dedicated pilgrimage service from Peshawar, we prioritize your spiritual comfort at every step."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card hoverable padding="md" className="bg-white flex flex-col justify-between">
              <div>
                <IconRing icon={<Building2 className="w-6 h-6" />} size="lg" variant="solid" className="mb-4" />
                <h3 className="font-display text-xl font-bold text-navy mb-2">
                  Comfortable Accommodation
                </h3>
                <p className="text-sm text-navy-deep/75 leading-relaxed">
                  Verified hotels located within walking distance of the Haramain or with reliable round-the-clock private shuttle services.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center text-xs text-gold-dark font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                <span>Makkah & Madinah</span>
              </div>
            </Card>

            <Card hoverable padding="md" className="bg-white flex flex-col justify-between">
              <div>
                <IconRing icon={<Plane className="w-6 h-6" />} size="lg" variant="solid" className="mb-4" />
                <h3 className="font-display text-xl font-bold text-navy mb-2">
                  Reliable Transport
                </h3>
                <p className="text-sm text-navy-deep/75 leading-relaxed">
                  Comfortable air-conditioned coach transfers between airport, Makkah, Madinah, and historical Ziyarat locations.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center text-xs text-gold-dark font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                <span>Seamless transfers</span>
              </div>
            </Card>

            <Card hoverable padding="md" className="bg-white flex flex-col justify-between">
              <div>
                <IconRing icon={<Users className="w-6 h-6" />} size="lg" variant="solid" className="mb-4" />
                <h3 className="font-display text-xl font-bold text-navy mb-2">
                  Experienced Guides
                </h3>
                <p className="text-sm text-navy-deep/75 leading-relaxed">
                  Knowledgeable religious scholars and local coordinators assisting you through every ritual of Umrah with care.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center text-xs text-gold-dark font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                <span>Urdu & Pashto support</span>
              </div>
            </Card>

            <Card hoverable padding="md" className="bg-white flex flex-col justify-between">
              <div>
                <IconRing icon={<Headphones className="w-6 h-6" />} size="lg" variant="solid" className="mb-4" />
                <h3 className="font-display text-xl font-bold text-navy mb-2">
                  24/7 Customer Support
                </h3>
                <p className="text-sm text-navy-deep/75 leading-relaxed">
                  Direct WhatsApp access to our management team in Pakistan and Saudi Arabia for immediate assistance anytime.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center text-xs text-gold-dark font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                <span>Round-the-clock care</span>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Navy "Ready for Your Blessed Journey?" Call-to-Action Band */}
      <section className="bg-navy py-14 sm:py-20 text-cream border-t border-navy-deep relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-gold),_transparent_70%)] pointer-events-none" />

        <Container className="text-center relative z-10">
          <span className="inline-block px-4 py-1 rounded-full bg-sand/15 text-gold-light text-xs font-bold tracking-wider uppercase border border-gold/30 mb-4">
            Start Your Journey
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-cream max-w-2xl mx-auto">
            Ready for Your Blessed Journey?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-cream/80 max-w-xl mx-auto leading-relaxed">
            Contact {siteConfig.name} today for personalized itineraries, customized flight routes, and confirmed hotel reservations near the Haram.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href={defaultWaLink} variant="primary" size="lg">
              <WhatsAppIcon className="w-5 h-5 fill-current mr-2" />
              Chat on WhatsApp
            </Button>
            <Button
              href={`tel:${siteConfig.displayPhones[0].replace(/-/g, "")}`}
              variant="outline"
              size="lg"
              className="border-cream text-cream hover:bg-cream hover:text-navy"
            >
              Call {siteConfig.displayPhones[0]}
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
