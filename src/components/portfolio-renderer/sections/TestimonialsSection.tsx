import React from "react";
import { NormalizedSectionNode } from "@/lib/rendering-engine/types";
import { PortfolioCard } from "../ui/PortfolioCard";
import { PortfolioImage } from "../ui/PortfolioImage";

export function TestimonialsSection({ node }: { node: NormalizedSectionNode }) {
  const content = node.content || {};
  const testimonials = content.testimonialsList || [];

  return (
    <section id="testimonials" className={`py-16 lg:py-24 ${node.responsiveClasses.containerWidthClass}`}>
      <div className="space-y-12">
        <div>
          <h2 className="text-3xl font-black text-foreground sm:text-4xl">{content.title || "Client Testimonials"}</h2>
          <p className="mt-2 text-base text-foreground/80">Endorsements, recommendations, and reviews from collaborators.</p>
        </div>

        {testimonials.length > 0 ? (
          <div className={`grid ${node.responsiveClasses.gridColumnsClass} ${node.responsiveClasses.gridGapClass}`}>
            {testimonials.map((t: any, idx: number) => (
              <PortfolioCard key={idx} className="flex flex-col justify-between">
                <p className="text-sm italic text-foreground/90 leading-relaxed">&quot;{t.review || t.quote}&quot;</p>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border/40">
                  <PortfolioImage
                    src={t.avatarUrl}
                    alt={t.clientName || "Client"}
                    fallbackText={t.clientName}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{t.clientName || "Client"}</h4>
                    <p className="text-[10px] text-muted-foreground">{t.company || t.position || "Partner"}</p>
                  </div>
                </div>
              </PortfolioCard>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No testimonials added yet.</p>
        )}
      </div>
    </section>
  );
}
