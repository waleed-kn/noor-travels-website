import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "sand" | "cream" | "navy";
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Card({
  variant = "default",
  hoverable = false,
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-white border-border text-navy-deep",
    sand: "bg-sand border-border text-navy-deep",
    cream: "bg-cream border-border text-navy-deep",
    navy: "bg-navy border-navy-deep text-cream",
  }[variant];

  const paddingStyles = {
    none: "",
    sm: "p-4 sm:p-5",
    md: "p-6 sm:p-8",
    lg: "p-8 sm:p-10",
  }[padding];

  const hoverStyles = hoverable
    ? "transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:border-gold/40"
    : "shadow-sm";

  return (
    <div
      className={`rounded-2xl border ${variantStyles} ${paddingStyles} ${hoverStyles} overflow-hidden ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardContent({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-6 pt-4 border-t border-border ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
