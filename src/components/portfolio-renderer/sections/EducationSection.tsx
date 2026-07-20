import React from "react";
import { NormalizedSectionNode } from "@/lib/rendering-engine/types";
import { PortfolioTimeline } from "../ui/PortfolioTimeline";

export function EducationSection({ node }: { node: NormalizedSectionNode }) {
  const content = node.content || {};
  const eduList = content.educationList || [];

  const timelineItems = eduList.map((edu: any, idx: number) => ({
    id: `edu-${idx}`,
    title: edu.degree || "Bachelor of Science",
    subtitle: edu.school || edu.institution || "University",
    period: edu.graduationYear || edu.year || "2023",
    description: edu.description || edu.fieldOfStudy || ""
  }));

  return (
    <section id="education" className={`py-16 lg:py-24 ${node.responsiveClasses.containerWidthClass}`}>
      <div className="space-y-12">
        <div>
          <h2 className="text-3xl font-black text-foreground sm:text-4xl">{content.title || "Education"}</h2>
          <p className="mt-2 text-base text-foreground/80">Academic background, degrees, and university studies.</p>
        </div>

        <PortfolioTimeline items={timelineItems} />
      </div>
    </section>
  );
}
