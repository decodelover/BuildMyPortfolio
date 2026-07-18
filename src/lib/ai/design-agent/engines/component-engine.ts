import { ComponentDecision, DesignContext, ProfessionCategory } from "../types";

export class ComponentEngine {
  
  public static resolve(context: DesignContext): ComponentDecision[] {
    const category = context.professionCategory;
    const themePreference = context.themePreference.toLowerCase();
    
    // Determine card structure design base
    const cardVariant: ComponentDecision["cardVariant"] = themePreference.includes("glass")
      ? "glassmorphic"
      : themePreference.includes("minimal")
      ? "minimal"
      : "solid";

    // Determine button design defaults
    const buttonVariant: ComponentDecision["buttonVariant"] = {
      primary: themePreference.includes("minimal") ? "outline" : "filled",
      secondary: "text"
    };

    const decisions: ComponentDecision[] = [];

    // Main section mapping types
    const types = [
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

    types.forEach((type) => {
      const variant = this.determineComponentVariant(type, category);
      const interactiveFeatures = this.determineInteractiveFeatures(type, category);

      decisions.push({
        sectionId: `comp-${type}-${Date.now()}`,
        type,
        variant,
        interactiveFeatures,
        cardVariant,
        buttonVariant
      });
    });

    return decisions;
  }

  private static determineComponentVariant(sectionType: string, category: ProfessionCategory): string {
    switch (sectionType) {
      case "hero":
        return ["ui-ux-designer", "product-designer"].includes(category)
          ? "hero-creative-split"
          : "hero-developer-terminal";
      case "about":
        return "about-biography-card";
      case "skills":
        return "skills-badge-clouds";
      case "projects":
        return "projects-grid-modern";
      case "experience":
        return "experience-timeline-interactive";
      case "services":
        return "services-pricing-cards";
      case "testimonials":
        return "testimonials-slider-box";
      case "blog":
        return "blog-grid-teaser";
      case "contact":
        return "contact-form-minimal";
      case "footer":
        return "footer-social-footer";
      default:
        return "default-component-stub";
    }
  }

  private static determineInteractiveFeatures(sectionType: string, category: ProfessionCategory): string[] {
    switch (sectionType) {
      case "projects":
        return ["tag-filter", "image-lightbox", "details-modal"];
      case "experience":
        return ["toggle-expand", "company-tab-filter"];
      case "skills":
        return ["search-filter"];
      case "testimonials":
        return ["swipe-scroll", "auto-rotation"];
      default:
        return [];
    }
  }
}
