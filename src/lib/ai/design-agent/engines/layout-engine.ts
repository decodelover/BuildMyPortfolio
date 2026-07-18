import { LayoutDecision, DesignContext, ProfessionCategory } from "../types";

export class LayoutEngine {
  
  public static resolve(context: DesignContext): LayoutDecision[] {
    const category = context.professionCategory;
    const layouts: LayoutDecision[] = [];

    // Base structure sections list
    const sections: Array<{ type: string; weight: number }> = [
      { type: "hero", weight: 10 },
      { type: "about", weight: 20 },
      { type: "skills", weight: 30 },
      { type: "projects", weight: 40 },
      { type: "experience", weight: 50 },
      { type: "services", weight: 60 },
      { type: "testimonials", weight: 70 },
      { type: "blog", weight: 80 },
      { type: "contact", weight: 90 },
      { type: "footer", weight: 100 }
    ];

    sections.forEach((sec) => {
      const layoutVariant = this.determineLayoutVariant(sec.type, category);
      const gridColumns = this.determineGridColumns(sec.type, category);

      layouts.push({
        sectionId: `sec-${sec.type}-${Date.now()}`,
        type: sec.type,
        layoutVariant,
        orderWeight: sec.weight,
        gridColumns
      });
    });

    return layouts.sort((a, b) => a.orderWeight - b.orderWeight);
  }

  private static determineLayoutVariant(sectionType: string, category: ProfessionCategory): string {
    switch (sectionType) {
      case "hero":
        if (["ui-ux-designer", "product-designer", "marketing-creative"].includes(category)) {
          return "centered-hero-bold";
        }
        if (["full-stack-developer", "frontend-developer", "software-engineer"].includes(category)) {
          return "split-right-image";
        }
        return "split-left-text";

      case "about":
        if (["general-consultant", "general-professional"].includes(category)) {
          return "corporate-split";
        }
        return "split-avatar-bio";

      case "skills":
        if (["dark-developer", "devops-cloud-engineer", "cybersecurity-engineer", "ai-ml-engineer"].includes(category as string)) {
          return "grouped-skills-tags-with-level";
        }
        return "grid-category-cards";

      case "projects":
        if (["ui-ux-designer", "product-designer", "game-developer"].includes(category)) {
          return "masonry-grid-visual";
        }
        if (["full-stack-developer", "frontend-developer"].includes(category)) {
          return "featured-main-with-grid";
        }
        return "standard-grid-cards";

      case "experience":
        if (["general-consultant", "general-professional"].includes(category)) {
          return "resume-two-column-list";
        }
        return "interactive-vertical-timeline";

      case "services":
        return "feature-cards-grid";

      case "testimonials":
        return "carousel-slider-cards";

      case "blog":
        return "list-row-postings";

      case "contact":
        return "split-form-and-details";

      case "footer":
        return "minimal-centered-links";

      default:
        return "default-stack";
    }
  }

  private static determineGridColumns(sectionType: string, category: ProfessionCategory): LayoutDecision["gridColumns"] {
    const isGridHeavy = ["projects", "skills", "services"].includes(sectionType);

    if (isGridHeavy) {
      if (sectionType === "projects" && ["ui-ux-designer", "product-designer"].includes(category)) {
        return { mobile: 1, tablet: 2, desktop: 3 };
      }
      return { mobile: 1, tablet: 2, desktop: 3 };
    }

    return { mobile: 1, tablet: 1, desktop: 1 };
  }
}
