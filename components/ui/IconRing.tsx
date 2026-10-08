import React from "react";

export interface IconRingProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "ring" | "soft";
  className?: string;
}

export function IconRing({
  icon,
  size = "md",
  variant = "solid",
  className = "",
  ...props
}: IconRingProps) {
  const sizeStyles = {
    sm: "w-8 h-8 text-sm",
    md: "w-11 h-11 text-base",
    lg: "w-14 h-14 text-xl",
  }[size];

  const variantStyles = {
    solid: "bg-gradient-to-br from-gold-light to-gold-dark text-white shadow-sm border border-gold-dark/30",
    ring: "border-2 border-gold text-gold-dark bg-sand/70 shadow-inner",
    soft: "bg-sand text-gold-dark border border-border",
  }[variant];

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full shrink-0 ${sizeStyles} ${variantStyles} ${className}`.trim()}
      {...props}
    >
      {icon}
    </div>
  );
}
