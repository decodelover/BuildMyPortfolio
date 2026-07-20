import React from "react";
import { NormalizedSectionNode } from "@/lib/rendering-engine/types";
import { PortfolioProgressBar } from "../ui/PortfolioProgressBar";
import { PortfolioCard } from "../ui/PortfolioCard";

export function SkillsSection({ node }: { node: NormalizedSectionNode }) {
  const content = node.content || {};
  const skills = content.skillsList || [];

  return (
    <section id="skills" className={`py-16 lg:py-24 ${node.responsiveClasses.containerWidthClass}`}>
      <div className="space-y-12">
        <div>
          <h2 className="text-3xl font-black text-foreground sm:text-4xl">{content.title || "Skills & Expertise"}</h2>
          <p className="mt-2 text-base text-foreground/80">Technical competencies, frameworks, and programming languages.</p>
        </div>

        <div className={`grid ${node.responsiveClasses.gridColumnsClass} ${node.responsiveClasses.gridGapClass}`}>
          {skills.map((skill: any, idx: number) => {
            const levelMap: Record<string, number> = { beginner: 40, intermediate: 70, advanced: 85, expert: 95 };
            const pct = typeof skill.level === "number" ? skill.level : levelMap[String(skill.level).toLowerCase()] || 85;

            return (
              <PortfolioCard key={idx} hoverEffect={false}>
                <PortfolioProgressBar label={skill.name} percentage={pct} category={skill.category} />
              </PortfolioCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
