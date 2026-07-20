import React from "react";
import { NormalizedSectionNode } from "@/lib/rendering-engine/types";
import { PortfolioButton } from "../ui/PortfolioButton";
import { PortfolioCard } from "../ui/PortfolioCard";

export function ResumeSection({ node }: { node: NormalizedSectionNode }) {
  const content = node.content || {};

  return (
    <section id="resume" className={`py-16 lg:py-24 ${node.responsiveClasses.containerWidthClass}`}>
      <PortfolioCard className="p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl font-black text-foreground">{content.title || "Curriculum Vitae"}</h2>
        <p className="text-base text-foreground/80 leading-relaxed max-w-xl mx-auto">
          {content.description || "Download or view my official resume detailing my experience, tech stack, and background."}
        </p>
        {content.downloadUrl && content.downloadUrl !== "#" && (
          <a href={content.downloadUrl} target="_blank" rel="noreferrer" className="inline-block">
            <PortfolioButton variant="primary" size="lg">
              📄 Download Resume (PDF)
            </PortfolioButton>
          </a>
        )}
      </PortfolioCard>
    </section>
  );
}
