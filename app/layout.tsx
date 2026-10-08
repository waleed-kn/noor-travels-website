import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import fs from "fs";
import path from "path";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileWhatsAppButton } from "@/components/MobileWhatsAppButton";
import { siteConfig } from "@/lib/site";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Umrah Packages & Travel Services`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Detect if /public/logo.png is present on server
  const hasLogoImage = fs.existsSync(
    path.join(process.cwd(), "public", "logo.png")
  );

  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col bg-cream text-navy-deep font-sans antialiased selection:bg-gold-light selection:text-white">
        <Header hasLogoImage={hasLogoImage} />
        <main className="flex-1 pb-24 md:pb-0">{children}</main>
        <Footer hasLogoImage={hasLogoImage} />
        <MobileWhatsAppButton />
      </body>
    </html>
  );
}
