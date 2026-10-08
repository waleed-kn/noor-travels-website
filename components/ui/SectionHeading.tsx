import React from "react";

export interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
  theme?: "light" | "dark";
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  description,
  align = "center",
  theme = "light",
  className = "",
}: SectionHeadingProps) {
  const alignStyles = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end",
  }[align];

  const titleColor = theme === "dark" ? "text-cream" : "text-navy";
  const descColor = theme === "dark" ? "text-cream/80" : "text-navy-deep/80";

  return (
    <div className={`flex flex-col max-w-2xl ${alignStyles} mb-8 sm:mb-12 ${className}`.trim()}>
      {badge && (
        <span className="inline-block px-3.5 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-sand text-gold-dark border border-border mb-3">
          {badge}
        </span>
      )}
      <h2 className={`font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${titleColor}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-3 text-sm sm:text-base leading-relaxed ${descColor}`}>
          {description}
        </p>
      )}
    </div>
  );
}
