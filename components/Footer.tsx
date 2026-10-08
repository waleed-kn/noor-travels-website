import React from "react";
import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import { siteConfig } from "@/lib/site";
import {
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/icons";
import { Logo } from "@/components/Logo";

interface FooterProps {
  hasLogoImage?: boolean;
}

export function Footer({ hasLogoImage = false }: FooterProps) {
  return (
    <footer className="bg-navy-deep text-cream border-t-2 border-gold/40 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Col 1: Brand & Tagline & Social Links (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center">
              <Logo variant="footer" hasLogoImage={hasLogoImage} />
            </div>

            <p className="text-cream/80 text-sm leading-relaxed max-w-sm">
              {siteConfig.description} Personalized itineraries, certified hotels
              near Haram in Makkah & Madinah, and dedicated travel support from
              Peshawar.
            </p>

            {/* Social Media Links from lib/site.ts config */}
            <div className="pt-2">
              <span className="block text-xs uppercase font-semibold tracking-wider text-gold-light mb-3">
                Follow Us Online
              </span>
              <div className="flex items-center space-x-3">
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Noor Travels on Facebook"
                  className="w-10 h-10 rounded-full bg-navy/80 hover:bg-navy flex items-center justify-center text-cream hover:text-gold-light border border-cream/15 hover:border-gold/60 transition-all duration-200 active:scale-95 shadow-xs"
                >
                  <FacebookIcon className="w-5 h-5 fill-current" />
                </a>

                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Noor Travels on Instagram"
                  className="w-10 h-10 rounded-full bg-navy/80 hover:bg-navy flex items-center justify-center text-cream hover:text-gold-light border border-cream/15 hover:border-gold/60 transition-all duration-200 active:scale-95 shadow-xs"
                >
                  <InstagramIcon className="w-5 h-5 fill-current" />
                </a>

                <a
                  href={siteConfig.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Noor Travels on TikTok"
                  className="w-10 h-10 rounded-full bg-navy/80 hover:bg-navy flex items-center justify-center text-cream hover:text-gold-light border border-cream/15 hover:border-gold/60 transition-all duration-200 active:scale-95 shadow-xs"
                >
                  <TikTokIcon className="w-5 h-5 fill-current" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-display text-lg font-bold text-cream tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {siteConfig.navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-cream/75 hover:text-gold-light transition-colors inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-xs"
                  >
                    <span className="text-gold/60">›</span>
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact, Phone Numbers with WhatsApp Icon & Address (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-display text-lg font-bold text-cream tracking-wide">
              Contact & Inquiries
            </h3>

            {/* Both Phone numbers with WhatsApp icon */}
            <div className="space-y-3">
              <span className="text-xs uppercase font-semibold tracking-wider text-gold-light block">
                Direct WhatsApp & Call
              </span>
              <ul className="space-y-2">
                {siteConfig.phones.map((phone) => (
                  <li key={phone.raw}>
                    <a
                      href={`https://wa.me/${phone.raw}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 px-3.5 py-2 rounded-lg bg-navy/60 hover:bg-navy border border-cream/10 hover:border-gold/40 text-cream transition-all duration-200 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <WhatsAppIcon className="w-4 h-4 fill-current" />
                      </span>
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-sm tracking-wide text-cream group-hover:text-gold-light transition-colors">
                          {phone.display}
                        </span>
                        <span className="text-[11px] text-cream/60">
                          {phone.label}
                        </span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Office Address */}
            <div className="pt-2 space-y-2">
              <span className="text-xs uppercase font-semibold tracking-wider text-gold-light block">
                Office Location
              </span>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-cream/80">
                <MapPin className="w-4 h-4 text-gold-light flex-shrink-0 mt-0.5" />
                <address className="not-italic leading-relaxed">
                  {siteConfig.address.full}
                </address>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-cream/70 pt-1">
                <Clock className="w-3.5 h-3.5 text-gold-light flex-shrink-0" />
                <span>{siteConfig.officeHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="mt-12 pt-8 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/60">
          <p>{siteConfig.copyright}</p>
          <p className="text-cream/50 text-[11px]">
            Licensed Umrah Operator • Government of Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}
