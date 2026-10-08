import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "navy" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  isLoading = false,
  fullWidth = false,
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none select-none cursor-pointer";

  const sizeStyles = {
    sm: "px-4 py-1.5 text-xs sm:text-sm tracking-wide gap-1.5",
    md: "px-6 py-2.5 text-sm sm:text-base tracking-wide gap-2",
    lg: "px-8 py-3.5 text-base sm:text-lg tracking-wide gap-2.5",
  }[size];

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-gold-light to-gold-dark hover:from-gold hover:to-gold-dark text-white shadow-md hover:shadow-lg focus-visible:ring-gold border border-gold-dark/20 active:scale-[0.98]",
    outline:
      "border-2 border-navy text-navy hover:bg-navy hover:text-cream focus-visible:ring-navy active:scale-[0.98]",
    navy:
      "bg-navy text-white hover:bg-navy-deep shadow-md hover:shadow-lg focus-visible:ring-navy-deep active:scale-[0.98]",
    ghost:
      "text-navy hover:bg-sand/60 focus-visible:ring-navy",
  }[variant];

  const combinedClasses = `${baseStyles} ${sizeStyles} ${variantStyles} ${fullWidth ? "w-full" : ""} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
        {children}
      </Link>
    );
  }

  return (
    <button
      className={combinedClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
