import { CompilationContext, DependencyIssue, DependencyResolutionResult } from "../types";

export class DependencyResolver {
  public static resolve(context: CompilationContext): DependencyResolutionResult {
    const issues: DependencyIssue[] = [];
    const warnings: string[] = [];
    
    const normalized = context.normalizedData;
    const design = context.designBlueprint;
    const seo = context.seoBlueprint;
    const contentBlocks = context.contentBlocks || [];

    // 1. Verify Layout sections vs Content data presence
    if (design?.layouts) {
      design.layouts.forEach((layout) => {
        const type = layout.type;
        let hasContent = false;
        
        if (type === "hero" && (normalized.personal?.headline || normalized.personal?.fullName)) hasContent = true;
        if (type === "about" && (normalized.personal?.bioSummary || normalized.story?.backgroundSummary)) hasContent = true;
        if (type === "projects" && normalized.projects && normalized.projects.length > 0) hasContent = true;
        if (type === "skills" && normalized.skills && normalized.skills.length > 0) hasContent = true;
        if (type === "experience" && normalized.experience && normalized.experience.length > 0) hasContent = true;
        if (type === "education" && normalized.education && normalized.education.length > 0) hasContent = true;
        if (type === "services" && normalized.services && normalized.services.length > 0) hasContent = true;
        if (type === "testimonials" && normalized.testimonials && normalized.testimonials.length > 0) hasContent = true;
        if (type === "contact" && normalized.personal?.email) hasContent = true;
        if (type === "footer" || type === "navigation" || type === "not-found" || type === "legal" || type === "statistics" || type === "resume") {
          hasContent = true;
        }

        // Fallback check against content blocks list
        if (!hasContent) {
          const matchBlock = contentBlocks.find((b) => b.type === type || b.id.includes(type));
          if (matchBlock && matchBlock.status === "ready") {
            hasContent = true;
          }
        }

        if (!hasContent) {
          issues.push({
            type: "missing",
            source: `layouts[type=${type}]`,
            target: `content[type=${type}]`,
            message: `Layout references section type '${type}' but no matching portfolio content has been generated or supplied.`,
            severity: "warning"
          });
        }
      });
    }

    // 2. Check Typography & Font Asset Dependencies
    if (design?.theme?.typography) {
      const { headingsFont, bodyFont } = design.theme.typography;
      if (!headingsFont || !bodyFont) {
        warnings.push("Theme typography is missing explicit font family configurations. System fallback fonts will be applied.");
      }
    }

    // 3. Check Personal Profile Asset Dependencies
    if (!normalized.personal?.avatarUrl) {
      warnings.push("Personal avatar URL is missing. Compilation will fallback to avatar placeholder / initial badge.");
    }

    // 4. Check SEO & Structured Data Dependencies
    if (seo) {
      if (!seo.metadata?.author && !normalized.personal?.fullName) {
        issues.push({
          type: "missing",
          source: "seo.metadata",
          target: "personal.fullName",
          message: "SEO metadata author depends on personal.fullName, which is missing.",
          severity: "info"
        });
      }
    }

    // 5. Component Variant Dependencies
    if (design?.components) {
      design.components.forEach((comp) => {
        if (!comp.variant) {
          warnings.push(`Component for section '${comp.sectionId || comp.type}' is missing variant choice. Default variant will be compiled.`);
        }
      });
    }

    // Filter out critical vs non-critical issues (missing layout content is treated as warning, not fatal)
    const hasCriticalIssues = issues.some((i) => i.severity === "critical");

    return {
      isValid: !hasCriticalIssues,
      issues,
      warnings
    };
  }
}
