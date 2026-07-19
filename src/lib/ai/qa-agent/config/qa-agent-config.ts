export class QaAgentConfig {
  public static readonly scoringWeights = {
    contentQuality: 0.15,
    designQuality: 0.15,
    seoQuality: 0.15,
    accessibility: 0.15,
    performance: 0.10,
    technicalIntegrity: 0.15,
    security: 0.15
  };

  // Pass/fail thresholds
  public static readonly thresholds = {
    overallMinScore: 60,
    dimensionMinScore: 40
  };

  // Content verification rules
  public static readonly content = {
    minBioLength: 50,
    maxBioLength: 1000,
    minProjectsCount: 1,
    minExperienceCount: 1,
    maxSectionImbalanceRatio: 5, // Ratio of longest section to shortest section
    minSkillsCount: 3
  };

  // Performance guidelines (heuristics)
  public static readonly performance = {
    maxSingleImageSizeKb: 500,
    maxTotalAssetSizeKb: 5120, // 5MB
    minLazyLoadedBelowFoldCount: 1
  };

  // Accessibility rules
  public static readonly accessibility = {
    minContrastRatio: 4.5,
    minFontSizePx: 14,
    requiredAriaLabels: ["main-navigation", "social-links", "contact-form"]
  };

  // Security risk patterns
  public static readonly security = {
    dangerousProtocols: /^(javascript|data|vbscript|file):/i,
    scriptInjections: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    sqlInjectionHeuristics: /UNION\s+SELECT|OR\s+['"]?1['"]?\s*=\s*['"]?1/i,
    xssEventHandlerPatterns: /\bon\w+\s*=/i
  };
}
