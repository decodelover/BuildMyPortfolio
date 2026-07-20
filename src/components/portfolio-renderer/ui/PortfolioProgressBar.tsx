import React from "react";

export interface PortfolioProgressBarProps {
  label: string;
  percentage: number;
  category?: string;
}

export function PortfolioProgressBar({ label, percentage, category }: PortfolioProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs font-semibold text-foreground">
        <span>{label} {category && <span className="text-muted-foreground font-normal">({category})</span>}</span>
        <span className="text-primary">{clamped}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-border/40 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
