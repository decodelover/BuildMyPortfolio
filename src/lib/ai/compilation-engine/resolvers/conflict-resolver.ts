import { CompilationContext, ConflictResolution, ConflictResolutionResult } from "../types";

export class ConflictResolver {
  public static resolve(context: CompilationContext): ConflictResolutionResult {
    const resolutions: ConflictResolution[] = [];
    const warnings: string[] = [];

    const rawInput = context.rawInput || {};
    const design = context.designBlueprint;
    const seo = context.seoBlueprint;
    const prefs = rawInput.websitePreferences || {};

    // 1. Resolve Theme Selection Conflicts (User Wizard Preferences vs Design Agent Blueprint suggestions)
    const wizardTheme = prefs.themeId || prefs.theme;
    const designTheme = design?.theme?.themeId;

    let selectedTheme = "modern";
    let themeStrategy = "default-fallback";

    if (wizardTheme) {
      selectedTheme = wizardTheme;
      themeStrategy = "wizard-preference-priority";
      if (designTheme && designTheme !== wizardTheme) {
        warnings.push(`Design theme suggestion '${designTheme}' overriden by wizard user preference: '${wizardTheme}'.`);
      }
    } else if (designTheme) {
      selectedTheme = designTheme;
      themeStrategy = "design-agent-suggestion";
    }

    resolutions.push({
      field: "theme.themeId",
      conflictType: "theme-mismatch",
      resolvedValue: selectedTheme,
      resolutionStrategy: themeStrategy
    });

    // 2. Resolve Border Radius Constraints
    const wizardRadius = prefs.borderRadius;
    const designRadius = design?.theme?.components?.borderRadius;

    let selectedRadius = "8px";
    let radiusStrategy = "default-radius";

    if (wizardRadius) {
      selectedRadius = wizardRadius;
      radiusStrategy = "wizard-borderRadius-priority";
    } else if (designRadius) {
      selectedRadius = designRadius;
      radiusStrategy = "design-agent-borderRadius";
    }

    resolutions.push({
      field: "theme.components.borderRadius",
      conflictType: "border-radius-mismatch",
      resolvedValue: selectedRadius,
      resolutionStrategy: radiusStrategy
    });

    // 3. Resolve Typography Conflicts
    const wizardTypography = prefs.typography || {};
    const designTypography = (design?.theme?.typography || {}) as Record<string, any>;

    const headingsFont = wizardTypography.headingsFont || designTypography.headingsFont || "Inter";
    const bodyFont = wizardTypography.bodyFont || designTypography.bodyFont || "Inter";

    resolutions.push({
      field: "theme.typography.headingsFont",
      conflictType: "font-family-mismatch",
      resolvedValue: headingsFont,
      resolutionStrategy: wizardTypography.headingsFont ? "wizard-preference" : "design-agent"
    });

    resolutions.push({
      field: "theme.typography.bodyFont",
      conflictType: "font-family-mismatch",
      resolvedValue: bodyFont,
      resolutionStrategy: wizardTypography.bodyFont ? "wizard-preference" : "design-agent"
    });

    // 4. Resolve Motion Intensity & Animation Conflicts
    const reducedMotionUser = prefs.reducedMotion === true;
    const designMotion = design?.animations?.motionIntensity || "medium";

    let resolvedMotion = designMotion;
    let motionStrategy = "design-agent-motion";

    if (reducedMotionUser) {
      resolvedMotion = "none";
      motionStrategy = "user-reduced-motion-override";
      warnings.push("User reduced motion preference active. All motion intensity downgraded to 'none'.");
    }

    resolutions.push({
      field: "animations.motionIntensity",
      conflictType: "motion-preference-conflict",
      resolvedValue: resolvedMotion,
      resolutionStrategy: motionStrategy
    });

    // 5. Resolve SEO Meta Title & Description Conflicts
    const rawSeoPref = rawInput.seoInfo || {};
    const seoTitle = rawSeoPref.metaTitle || seo?.metadata?.metaTitle;
    const seoDesc = rawSeoPref.metaDescription || seo?.metadata?.metaDescription;

    if (rawSeoPref.metaTitle && seo?.metadata?.metaTitle && rawSeoPref.metaTitle !== seo.metadata.metaTitle) {
      warnings.push(`User custom SEO meta title overrode SEO Agent recommendation.`);
    }

    resolutions.push({
      field: "seo.metaTitle",
      conflictType: "seo-title-override",
      resolvedValue: seoTitle || "Professional Portfolio",
      resolutionStrategy: rawSeoPref.metaTitle ? "user-custom-override" : "seo-agent-generated"
    });

    resolutions.push({
      field: "seo.metaDescription",
      conflictType: "seo-description-override",
      resolvedValue: seoDesc || "Welcome to my official professional portfolio.",
      resolutionStrategy: rawSeoPref.metaDescription ? "user-custom-override" : "seo-agent-generated"
    });

    // 6. Resolve Accessibility Standards Conflicts
    const designWcag = design?.accessibility?.wcagComplianceLevel || "AA";
    const seoWcag = seo?.accessibility?.wcagLevel || "AA";

    // Enforce AA minimum compliance
    let resolvedWcag = "AA";
    if (designWcag === "AAA" || seoWcag === "AAA") {
      resolvedWcag = "AAA";
    }

    resolutions.push({
      field: "accessibility.wcagCompliance",
      conflictType: "accessibility-level-reconciliation",
      resolvedValue: resolvedWcag,
      resolutionStrategy: "highest-compliance-level"
    });

    // 7. Resolve Dark Mode State
    const wizardDarkMode = prefs.darkMode;
    const designIsDark = design?.theme?.isDark;
    const isDarkResolved = typeof wizardDarkMode === "boolean" ? wizardDarkMode : (designIsDark ?? selectedTheme.includes("dark"));

    resolutions.push({
      field: "theme.isDark",
      conflictType: "color-scheme-mode",
      resolvedValue: isDarkResolved,
      resolutionStrategy: typeof wizardDarkMode === "boolean" ? "user-preference" : "theme-default"
    });

    return {
      resolutions,
      warnings
    };
  }
}
