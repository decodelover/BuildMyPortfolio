import { WebsiteGenerationPlan, PlanValidationResult } from "./architect-types";

/**
 * Validates a Website Generation Plan for structural and semantic integrity.
 * @param plan The WebsiteGenerationPlan to inspect.
 * @returns PlanValidationResult indicating validation status, scores, errors, and warnings.
 */
export function validatePlan(plan: WebsiteGenerationPlan): PlanValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let scoringPoints = 0;
  let totalPossiblePoints = 0;

  // Helper to add and count scores
  const addScore = (passed: boolean, points: number = 10) => {
    totalPossiblePoints += points;
    if (passed) {
      scoringPoints += points;
    }
  };

  // 1. Branding Validation
  const hasBrandName = !!plan.branding.brandName.trim();
  const hasWebsiteTitle = !!plan.branding.websiteTitle.trim();
  addScore(hasBrandName, 10);
  addScore(hasWebsiteTitle, 10);

  if (!hasBrandName) {
    errors.push("Branding: Personal brand name is missing.");
  }
  if (!hasWebsiteTitle) {
    errors.push("Branding: Website title is missing.");
  }

  // 2. Color Palette Validation
  const hasPrimaryColor = /^#[0-9A-F]{6}$/i.test(plan.palette.primary);
  const hasBackgroundColor = /^#[0-9A-F]{6}$/i.test(plan.palette.background);
  addScore(hasPrimaryColor, 5);
  addScore(hasBackgroundColor, 5);

  if (!hasPrimaryColor || !hasBackgroundColor) {
    errors.push("Palette: Primary or background brand hex colors are invalid.");
  }

  // 3. Pages Validation
  const hasPages = plan.pages && plan.pages.length > 0;
  addScore(hasPages, 10);

  if (!hasPages) {
    errors.push("Structure: Plan does not contain any website pages.");
  } else {
    plan.pages.forEach((page) => {
      // Validate page structure
      const hasPageName = !!page.name.trim();
      const hasPageSlug = page.slug.startsWith("/");
      const hasSections = page.sections && page.sections.length > 0;
      
      addScore(hasPageName, 5);
      addScore(hasPageSlug, 5);
      addScore(hasSections, 10);

      if (!hasPageName) {
        errors.push(`Page: Missing name for page slug ${page.slug}.`);
      }
      if (!hasPageSlug) {
        errors.push(`Page: Invalid slug format for page '${page.name}'.`);
      }
      if (!hasSections) {
        errors.push(`Page: Page '${page.name}' does not contain any layout sections.`);
      } else {
        // Validate page sections
        page.sections.forEach((section) => {
          const hasSecType = !!section.type;
          const hasSecComponent = !!section.componentSuggestion;
          addScore(hasSecType, 2);
          addScore(hasSecComponent, 2);

          if (!hasSecType) {
            errors.push(`Section: Section in '${page.name}' is missing a structural type identifier.`);
          }
          if (!hasSecComponent) {
            errors.push(`Section: Section '${section.id}' in '${page.name}' has no component template selected.`);
          }

          // Content Requirements Check
          if (["hero", "about"].includes(section.type)) {
            const hasReq = !!section.contentRequirement;
            addScore(hasReq, 5);
            if (!hasReq) {
              warnings.push(`Content: Non-data-driven section '${section.type}' in '${page.name}' is missing AI copywriting rules.`);
            }
          }
        });
      }

      // Page SEO Validation
      const hasSEOTitle = !!page.seoPlan.title.trim();
      const hasSEODesc = !!page.seoPlan.description.trim();
      addScore(hasSEOTitle, 5);
      addScore(hasSEODesc, 5);

      if (!hasSEOTitle) {
        warnings.push(`SEO: Page '${page.name}' is missing an optimized title tag.`);
      }
      if (!hasSEODesc) {
        warnings.push(`SEO: Page '${page.name}' is missing a meta description.`);
      }
    });
  }

  // 4. Navigation Validation
  const hasNavStyle = !!plan.navigation.navigationStyle;
  const hasMenuItems = plan.navigation.menuItems && plan.navigation.menuItems.length > 0;
  addScore(hasNavStyle, 5);
  addScore(hasMenuItems, 5);

  if (!hasNavStyle) {
    errors.push("Navigation: Navigation menu style preference is missing.");
  }
  if (!hasMenuItems) {
    errors.push("Navigation: Navigation menu is empty.");
  } else if (hasPages) {
    // Check navigation consistency
    const pageSlugs = plan.pages.map((p) => p.slug);
    const navSlugs = plan.navigation.menuItems.map((m) => m.path);
    
    let isConsistent = true;
    pageSlugs.forEach((slug) => {
      if (!navSlugs.includes(slug)) {
        isConsistent = false;
        warnings.push(`Navigation: Menu items are missing a link to page slug '${slug}'.`);
      }
    });
    addScore(isConsistent, 5);
  }

  // 5. Prompt Templates Validation
  const hasTemplates = plan.promptTemplates && plan.promptTemplates.length > 0;
  addScore(hasTemplates, 10);
  if (!hasTemplates) {
    warnings.push("Prompts: Future AI copywriting templates were not generated.");
  }

  // Calculate percentage
  const completenessScore = totalPossiblePoints > 0 
    ? Math.round((scoringPoints / totalPossiblePoints) * 100) 
    : 0;

  const isValid = errors.length === 0;

  return {
    isValid,
    completenessScore,
    errors,
    warnings,
  };
}
