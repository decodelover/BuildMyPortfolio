import React from "react";

export interface PortfolioBadgeProps {
  label: string;
  variant?: "primary" | "secondary" | "accent" | "outline";
  className?: string;
}

export function PortfolioBadge({ label, variant = "primary", className = "" }: PortfolioBadgeProps) {
  const variantClasses = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/10 text-secondary border-secondary/20",
    accent: "bg-accent/10 text-accent border-accent/20",
    outline: "bg-card border-border text-foreground"
  }[variant];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantClasses} ${className}`}>
      {label}
    </span>
  );
}
