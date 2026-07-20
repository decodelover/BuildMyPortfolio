import React from "react";
import { NormalizedSectionNode } from "@/lib/rendering-engine/types";
import { PortfolioTimeline } from "../ui/PortfolioTimeline";

export function ExperienceSection({ node }: { node: NormalizedSectionNode }) {
  const content = node.content || {};
  const expList = content.experienceList || [];

  const timelineItems = expList.map((exp: any, idx: number) => ({
    id: `exp-${idx}`,
    title: exp.position || exp.role || "Software Engineer",
    subtitle: exp.company || "Company",
    period: `${exp.startDate || ""} - ${exp.currentlyWorking ? "Present" : exp.endDate || ""}`,
    description: exp.description || exp.summary || "",
    technologies: exp.technologies
  }));

  return (
    <section id="experience" className={`py-16 lg:py-24 ${node.responsiveClasses.containerWidthClass}`}>
      <div className="space-y-12">
        <div>
          <h2 className="text-3xl font-black text-foreground sm:text-4xl">{content.title || "Work Experience"}</h2>
          <p className="mt-2 text-base text-foreground/80">Career milestones, engineering leadership, and employment history.</p>
        </div>

        <PortfolioTimeline items={timelineItems} />
      </div>
    </section>
  );
}
