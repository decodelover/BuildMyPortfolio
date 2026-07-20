import React from "react";
import { NormalizedSectionNode } from "@/lib/rendering-engine/types";
import { PortfolioCard } from "../ui/PortfolioCard";

export function StatisticsSection({ node }: { node: NormalizedSectionNode }) {
  const content = node.content || {};
  const metrics = content.metrics || [];

  return (
    <section id="statistics" className={`py-16 lg:py-24 ${node.responsiveClasses.containerWidthClass}`}>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-foreground sm:text-4xl">{content.title || "Key Metrics"}</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m: any, idx: number) => (
            <PortfolioCard key={idx} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-primary">{m.value}</div>
              <div className="mt-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{m.label}</div>
            </PortfolioCard>
          ))}
        </div>
      </div>
    </section>
  );
}
