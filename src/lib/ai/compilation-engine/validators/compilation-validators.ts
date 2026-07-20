import { PortfolioBlueprint, BlueprintNode, AssetRef, NavigationBlueprint, CompiledSEOBlueprint, AccessibilityBlueprint, PerformanceBlueprint } from "../types";

export class CompilationValidators {
  public static validateBlueprint(blueprint: PortfolioBlueprint): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 1. Structural checks
    if (!blueprint.blueprintId) errors.push("Blueprint ID is missing.");
    if (!blueprint.userId) errors.push("User ID is missing.");
    if (!blueprint.builderId) errors.push("Builder ID is missing.");
    if (!blueprint.planId) errors.push("Plan ID is missing.");
    if (!blueprint.version) errors.push("Version code is missing.");

    // 2. Sections check
    if (!blueprint.sections || blueprint.sections.length === 0) {
      errors.push("Portfolio blueprint must contain at least one page section.");
    } else {
      blueprint.sections.forEach((node, index) => {
        const nodeVal = this.validateSectionNode(node);
        if (!nodeVal.isValid) {
          errors.push(`Section index ${index} ('${node.id || "unknown"}') validation failed: ${nodeVal.errors.join(", ")}`);
        }
      });
    }

    // 3. Theme check
    const theme = blueprint.theme;
    if (!theme) {
      errors.push("Theme configuration mapping is missing.");
    } else {
      if (!theme.themeId) errors.push("Theme ID is missing.");
      if (!theme.colors || !theme.colors.primary) errors.push("Theme color palette mapping is incomplete.");
      if (!theme.typography || !theme.typography.headingsFont) errors.push("Theme typography mapping is incomplete.");
    }

    // 4. Asset checks
    if (blueprint.assets) {
      blueprint.assets.forEach((asset, index) => {
        const assetVal = this.validateAssetRef(asset);
        if (!assetVal.isValid) {
          errors.push(`Asset index ${index} ('${asset.assetId || "unknown"}') validation failed: ${assetVal.errors.join(", ")}`);
        }
      });
    }

    // 5. Navigation checks
    if (blueprint.navigation) {
      const navVal = this.validateNavigation(blueprint.navigation);
      if (!navVal.isValid) errors.push(...navVal.errors);
    } else {
      errors.push("Navigation blueprint mapping is missing.");
    }

    // 6. SEO checks
    if (blueprint.seo) {
      const seoVal = this.validateSEO(blueprint.seo);
      if (!seoVal.isValid) errors.push(...seoVal.errors);
    } else {
      errors.push("SEO blueprint mapping is missing.");
    }

    // 7. Accessibility checks
    if (blueprint.accessibility) {
      const accVal = this.validateAccessibility(blueprint.accessibility);
      if (!accVal.isValid) errors.push(...accVal.errors);
    } else {
      errors.push("Accessibility blueprint mapping is missing.");
    }

    // 8. Performance checks
    if (blueprint.performance) {
      const perfVal = this.validatePerformance(blueprint.performance);
      if (!perfVal.isValid) errors.push(...perfVal.errors);
    } else {
      errors.push("Performance blueprint mapping is missing.");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public static validateSectionNode(node: BlueprintNode): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!node.id) errors.push("Section ID is required.");
    if (!node.type) errors.push("Section type is required.");
    if (typeof node.order !== "number") errors.push("Section layout ordering weight is required.");
    if (!node.content) errors.push("Section content payload is required.");
    if (!node.componentRef || !node.componentRef.componentId) errors.push("Section component rendering reference is required.");
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public static validateAssetRef(ref: AssetRef): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!ref.assetId) errors.push("Asset ID is required.");
    if (!ref.type) errors.push("Asset type identifier is required.");
    if (!ref.url) errors.push("Asset file URL is required.");
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public static validateNavigation(nav: NavigationBlueprint): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!nav.routes || nav.routes.length === 0) errors.push("Navigation must contain at least one route.");
    nav.routes?.forEach((r) => {
      if (!r.path) errors.push("Route path is missing.");
      if (!r.pageName) errors.push("Route pageName is missing.");
    });
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public static validateSEO(seo: CompiledSEOBlueprint): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!seo.metaTitle) errors.push("SEO metaTitle is required.");
    if (!seo.metaDescription) errors.push("SEO metaDescription is required.");
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public static validateAccessibility(acc: AccessibilityBlueprint): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!acc.wcagCompliance) errors.push("Accessibility WCAG compliance level is required.");
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public static validatePerformance(perf: PerformanceBlueprint): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (typeof perf.sectionCount !== "number") errors.push("Performance section count metric is required.");
    if (typeof perf.assetCount !== "number") errors.push("Performance asset count metric is required.");
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
