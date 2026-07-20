import React from "react";
import { NormalizedSectionNode } from "@/lib/rendering-engine/types";
import { PortfolioCard } from "../ui/PortfolioCard";
import { PortfolioBadge } from "../ui/PortfolioBadge";

export function AboutSection({ node }: { node: NormalizedSectionNode }) {
  const content = node.content || {};

  return (
    <section id="about" className={`py-16 lg:py-24 ${node.responsiveClasses.containerWidthClass}`}>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-foreground sm:text-4xl">{content.title || "About Me"}</h2>
          <p className="mt-2 text-base text-foreground/80 leading-relaxed max-w-3xl">
            {content.bioSummary || content.backgroundSummary}
          </p>
        </div>

        {content.coreValues && content.coreValues.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Core Values</h3>
            <div className="flex flex-wrap gap-2">
              {content.coreValues.map((val: string, idx: number) => (
                <PortfolioBadge key={idx} label={val} variant="accent" />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
