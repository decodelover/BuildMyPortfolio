import { CompilationContext, ComponentRef, BlueprintSectionType } from "../types";

export class ComponentCompiler {
  public static compile(
    context: CompilationContext
  ): Record<string, ComponentRef> {
    const componentsMap: Record<string, ComponentRef> = {};
    const design = context.designBlueprint;
    const designComponents = design?.components || [];

    // Helper to map component decision to ComponentRef
    const resolveComponent = (
      sectionId: string,
      type: BlueprintSectionType,
      defaultVariant: string
    ): ComponentRef => {
      const match = designComponents.find(c => c.sectionId === sectionId || c.type === type);

      const variant = match?.variant || defaultVariant;
      const cardVariant = match?.cardVariant || "glassmorphic";
      const interactiveFeatures = match?.interactiveFeatures || ["modal-popup", "hover-zoom"];

      return {
        componentId: `comp-${type}-${sectionId}`,
        variant,
        props: {
          cardVariant,
          buttonVariant: match?.buttonVariant || {
            primary: "filled",
            secondary: "outline"
          },
          density: design?.visualHierarchy?.contentDensity || "normal"
        },
        interactiveFeatures
      };
    };

    // Standard sections components mapping
    const sectionTypes: { id: string; type: BlueprintSectionType; variant: string }[] = [
      { id: "sec-hero", type: "hero", variant: "featured-hero-card" },
      { id: "sec-about", type: "about", variant: "split-story-card" },
      { id: "sec-projects", type: "projects", variant: "project-grid-card" },
      { id: "sec-skills", type: "skills", variant: "skill-badge-group" },
      { id: "sec-experience", type: "experience", variant: "timeline-experience-card" },
      { id: "sec-education", type: "education", variant: "education-degree-card" },
      { id: "sec-certifications", type: "certifications", variant: "certification-badge-card" },
      { id: "sec-services", type: "services", variant: "service-offering-card" },
      { id: "sec-testimonials", type: "testimonials", variant: "testimonial-quote-card" },
      { id: "sec-blog", type: "blog", variant: "blog-post-card" },
      { id: "sec-gallery", type: "gallery", variant: "media-gallery-grid" },
      { id: "sec-statistics", type: "statistics", variant: "metric-counter-card" },
      { id: "sec-resume", type: "resume", variant: "resume-download-card" },
      { id: "sec-contact", type: "contact", variant: "interactive-contact-form" },
      { id: "sec-footer", type: "footer", variant: "minimal-footer" },
      { id: "sec-navigation", type: "navigation", variant: "sticky-header-nav" },
      { id: "sec-not-found", type: "not-found", variant: "standard-404-card" },
      { id: "sec-legal", type: "legal", variant: "legal-document-viewer" }
    ];

    sectionTypes.forEach(s => {
      componentsMap[s.id] = resolveComponent(s.id, s.type, s.variant);
    });

    return componentsMap;
  }
}
