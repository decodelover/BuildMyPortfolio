import React from "react";
import { NormalizedSectionNode } from "@/lib/rendering-engine/types";
import { PortfolioCard } from "../ui/PortfolioCard";
import { PortfolioBadge } from "../ui/PortfolioBadge";

export function ServicesSection({ node }: { node: NormalizedSectionNode }) {
  const content = node.content || {};
  const services = content.servicesList || [];

  return (
    <section id="services" className={`py-16 lg:py-24 ${node.responsiveClasses.containerWidthClass}`}>
      <div className="space-y-12">
        <div>
          <h2 className="text-3xl font-black text-foreground sm:text-4xl">{content.title || "Services Offered"}</h2>
          <p className="mt-2 text-base text-foreground/80">Professional consulting, engineering services, and technical solutions.</p>
        </div>

        <div className={`grid ${node.responsiveClasses.gridColumnsClass} ${node.responsiveClasses.gridGapClass}`}>
          {services.map((service: any, idx: number) => (
            <PortfolioCard key={idx} className="flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">{service.name || service.title}</h3>
                  {service.category && <PortfolioBadge label={service.category} variant="secondary" />}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{service.shortDesc || service.description}</p>
              </div>
              {service.startingPrice && (
                <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-bold text-primary">
                  <span>Starting at</span>
                  <span className="text-sm">{service.startingPrice}</span>
                </div>
              )}
            </PortfolioCard>
          ))}
        </div>
      </div>
    </section>
  );
}
