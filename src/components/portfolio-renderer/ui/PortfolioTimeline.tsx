import React from "react";

export interface TimelineItem {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  description: string;
  technologies?: string[];
}

export interface PortfolioTimelineProps {
  items: TimelineItem[];
}

export function PortfolioTimeline({ items }: PortfolioTimelineProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="relative border-l border-border/60 ml-4 md:ml-6 space-y-8 pl-6 md:pl-8">
      {items.map((item) => (
        <div key={item.id} className="relative group">
          <div className="absolute -left-[31px] md:-left-[39px] top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background group-hover:scale-125 group-hover:bg-primary transition-all duration-200" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
            <h4 className="text-base font-bold text-foreground">{item.title}</h4>
            <span className="text-xs font-semibold text-accent px-2 py-0.5 rounded bg-accent/10 self-start sm:self-auto">
              {item.period}
            </span>
          </div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">{item.subtitle}</p>
          <p className="text-sm text-foreground/80 leading-relaxed">{item.description}</p>
          {item.technologies && item.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {item.technologies.map((tech, idx) => (
                <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded border border-border bg-card">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
