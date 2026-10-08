"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons";
import { Logo } from "@/components/Logo";

interface HeaderProps {
  hasLogoImage?: boolean;
}

export function Header({ hasLogoImage = false }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close mobile menu on route change without cascading renders
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const bookNowUrl = buildWhatsAppLink(
    "Assalam o Alaikum, I would like to book an Umrah package with Noor Travels."
  );

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Logo variant="header" hasLogoImage={hasLogoImage} />
          </div>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center space-x-1 lg:space-x-3"
          >
            {siteConfig.navLinks.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative px-3.5 py-2 text-sm lg:text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm ${
                    isActive
                      ? "text-navy font-semibold"
                      : "text-navy-deep/75 hover:text-navy"
                  }`}
                >
                  <span>{item.title}</span>
                  {isActive && (
                    <span
                      className="absolute bottom-0 inset-x-2.5 h-[2.5px] bg-gradient-to-r from-gold-light via-gold to-gold-dark rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions: Gold "Book Now" Button */}
          <div className="hidden md:flex items-center space-x-3">
            <a
              href={bookNowUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark hover:from-gold hover:to-gold-dark text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              aria-label="Book Now via WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>Book Now</span>
            </a>
          </div>

          {/* Mobile Hamburger / Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation-menu"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              className="p-2.5 rounded-lg text-navy hover:text-navy-deep hover:bg-sand/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              {isOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div
          id="mobile-navigation-menu"
          role="region"
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-border/80 bg-white/98 backdrop-blur-lg px-4 pt-4 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200"
        >
          <nav aria-label="Mobile Menu" className="flex flex-col space-y-1">
            {siteConfig.navLinks.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? "text-navy font-semibold bg-sand/60 border-l-4 border-gold pl-3"
                      : "text-navy-deep/80 hover:text-navy hover:bg-sand/30"
                  }`}
                >
                  <span>{item.title}</span>
                  {isActive && (
                    <span
                      className="w-2 h-2 rounded-full bg-gold"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile "Book Now" Button */}
          <div className="mt-5 pt-4 border-t border-border/70 space-y-3">
            <a
              href={bookNowUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark hover:from-gold hover:to-gold-dark text-white font-semibold text-base shadow-sm transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label="Book Now via WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5 fill-current" />
              <span>Book Now</span>
            </a>

            {/* Quick Phone Call Support in Menu */}
            <div className="flex items-center justify-center gap-4 text-xs text-navy/70 pt-1">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gold-dark" />
                <span>Call: {siteConfig.displayPhones[0]}</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
