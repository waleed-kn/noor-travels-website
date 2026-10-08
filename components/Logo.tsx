"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site";

export interface LogoProps {
  variant?: "header" | "footer";
  className?: string;
  hasLogoImage?: boolean;
}

export function Logo({
  variant = "header",
  className = "",
  hasLogoImage = false,
}: LogoProps) {
  const [imageError, setImageError] = useState(false);

  const isLight = variant === "footer";
  const textColor = isLight ? "text-cream" : "text-navy";

  if (hasLogoImage && !imageError) {
    return (
      <Link
        href="/"
        className={`inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm ${className}`}
        aria-label={`${siteConfig.name} - Home`}
      >
        <Image
          src="/logo.png"
          alt={siteConfig.name}
          width={180}
          height={48}
          className={`h-9 sm:h-10 w-auto object-contain ${
            isLight ? "brightness-0 invert" : ""
          }`}
          onError={() => setImageError(true)}
          priority
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm group transition-opacity hover:opacity-90 ${className}`}
      aria-label={`${siteConfig.name} - Home`}
    >
      <span
        className={`font-display text-2xl sm:text-[28px] font-bold tracking-tight ${textColor}`}
      >
        {siteConfig.name}
      </span>
    </Link>
  );
}
