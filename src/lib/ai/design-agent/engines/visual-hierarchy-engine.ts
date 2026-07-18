import { VisualHierarchyDecision, DesignContext, ProfessionCategory } from "../types";

export class VisualHierarchyEngine {
  
  public static resolve(context: DesignContext): VisualHierarchyDecision {
    const category = context.professionCategory;

    // Default hierarchy maps
    let whitespaceDistribution: VisualHierarchyDecision["whitespaceDistribution"] = "medium";
    let contentDensity: VisualHierarchyDecision["contentDensity"] = "normal";
    let readingFlow: VisualHierarchyDecision["readingFlow"] = "F-Pattern";
    let ctaPlacement: VisualHierarchyDecision["ctaPlacement"] = "hero-center";

    // Layout configurations based on profession categories
    if (["ui-ux-designer", "product-designer", "marketing-creative"].includes(category)) {
      whitespaceDistribution = "extra-large";
      contentDensity = "spacious";
      readingFlow = "Z-Pattern";
      ctaPlacement = "hero-center";
    } else if (["dark-developer", "devops-cloud-engineer", "cybersecurity-engineer", "ai-ml-engineer"].includes(category as string)) {
      whitespaceDistribution = "snug";
      contentDensity = "compact";
      readingFlow = "F-Pattern";
      ctaPlacement = "navbar-end";
    }

    const sectionOrder = [
      "hero",
      "about",
      "skills",
      "projects",
      "experience",
      "services",
      "testimonials",
      "blog",
      "contact",
      "footer"
    ];

    const visualWeightScale = {
      headings: "font-bold tracking-tight",
      body: "font-normal leading-relaxed"
    };

    const buttonHierarchy = {
      primaryClass: "bg-primary text-white hover:bg-secondary",
      secondaryClass: "border border-border text-textPrimary hover:bg-cardBg"
    };

    return {
      sectionOrder,
      visualWeightScale,
      ctaPlacement,
      buttonHierarchy,
      contentDensity,
      whitespaceDistribution,
      readingFlow
    };
  }
}
