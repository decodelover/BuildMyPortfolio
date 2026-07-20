import React from "react";

export interface PortfolioCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function PortfolioCard({ children, className = "", hoverEffect = true }: PortfolioCardProps) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6 text-foreground shadow-sm transition-all duration-300 ${
        hoverEffect ? "hover:-translate-y-1 hover:shadow-md hover:border-primary/40" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
