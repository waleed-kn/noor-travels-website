export interface PhoneContact {
  display: string;
  raw: string;
  label: string;
  isPrimary?: boolean;
}

export interface NavLinkItem {
  title: string;
  href: string;
}

export interface AddressInfo {
  street: string;
  landmark?: string;
  city: string;
  country: string;
  full: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  tiktok: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  phones: PhoneContact[];
  displayPhones: readonly string[];
  defaultWhatsAppNumber: string;
  defaultWhatsAppMessage: string;
  address: AddressInfo;
  social: SocialLinks;
  navLinks: NavLinkItem[];
  copyright: string;
  officeHours: string;
}

export const siteConfig: SiteConfig = {
  name: "Noor Travels",
  tagline: "Sacred Journeys with Peace of Mind",
  description:
    "Specialized Umrah packages and pilgrimage travel services from Peshawar, Pakistan.",
  phones: [
    {
      display: "0312-9121411",
      raw: "923129121411",
      label: "Primary WhatsApp",
      isPrimary: true,
    },
    {
      display: "0313-4774880",
      raw: "923134774880",
      label: "Support WhatsApp",
      isPrimary: false,
    },
  ],
  displayPhones: ["0312-9121411", "0313-4774880"] as const,
  defaultWhatsAppNumber: "923129121411",
  defaultWhatsAppMessage:
    "Assalam o Alaikum, I would like to inquire about Umrah packages with Noor Travels.",
  address: {
    street: "GF-1 Dilbar Flats, Main Nauthia Road",
    landmark: "Near Lewanay Baba Ziarat",
    city: "Peshawar Saddar",
    country: "Pakistan",
    full: "GF-1 Dilbar Flats, Main Nauthia Road, Near Lewanay Baba Ziarat, Peshawar Saddar, Pakistan",
  },
  social: {
    // TODO URLs in config as required by project specification
    facebook: "https://facebook.com/TODO_NOOR_TRAVELS",
    instagram: "https://instagram.com/TODO_NOOR_TRAVELS",
    tiktok: "https://tiktok.com/@TODO_NOOR_TRAVELS",
  },
  navLinks: [
    { title: "Home", href: "/" },
    { title: "Packages", href: "/packages" },
    { title: "About Us", href: "/about" },
    { title: "Services", href: "/services" },
    { title: "Gallery", href: "/gallery" },
    { title: "Contact", href: "/contact" },
  ],
  copyright: "© 2026 Noor Travels. All Rights Reserved.",
  officeHours: "Monday – Saturday: 9:00 AM – 7:00 PM (PKT)",
};
