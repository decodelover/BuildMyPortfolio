import React from "react";
import { NormalizedSectionNode } from "@/lib/rendering-engine/types";
import { PortfolioCard } from "../ui/PortfolioCard";
import { PortfolioBadge } from "../ui/PortfolioBadge";
import { PortfolioImage } from "../ui/PortfolioImage";

export function ProjectsSection({ node }: { node: NormalizedSectionNode }) {
  const content = node.content || {};
  const projects = content.projectsList || [];

  return (
    <section id="projects" className={`py-16 lg:py-24 ${node.responsiveClasses.containerWidthClass}`}>
      <div className="space-y-12">
        <div>
          <h2 className="text-3xl font-black text-foreground sm:text-4xl">{content.title || "Featured Projects"}</h2>
          <p className="mt-2 text-base text-foreground/80">Explore recent work, technical projects, and applications I&apos;ve built.</p>
        </div>

        {projects.length > 0 ? (
          <div className={`grid ${node.responsiveClasses.gridColumnsClass} ${node.responsiveClasses.gridGapClass}`}>
            {projects.map((proj: any, idx: number) => (
              <PortfolioCard key={idx} className="flex flex-col justify-between overflow-hidden">
                <div className="space-y-4">
                  {proj.imageUrl && (
                    <div className="relative h-48 w-full rounded-xl overflow-hidden mb-4 border border-border">
                      <PortfolioImage src={proj.imageUrl} alt={proj.name || proj.title} fallbackText={proj.name} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground">{proj.name || proj.title}</h3>
                    {proj.isFeatured && <PortfolioBadge label="Featured" variant="accent" />}
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{proj.summary || proj.description}</p>
                </div>

                <div className="mt-6 space-y-4 pt-4 border-t border-border/40">
                  {proj.technologies && (
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(proj.technologies) ? proj.technologies : String(proj.technologies).split(",")).map((tech: string, tIdx: number) => (
                        <PortfolioBadge key={tIdx} label={String(tech).trim()} variant="outline" />
                      ))}
                    </div>
                  )}
                  {proj.liveUrl && (
                    <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-xs font-bold text-primary hover:underline">
                      Live Preview →
                    </a>
                  )}
                </div>
              </PortfolioCard>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No projects listed yet.</p>
        )}
      </div>
    </section>
  );
}
