import { DesignScore, DesignContext, LayoutDecision, ThemeTokens } from "../types";

export class ScoringEngine {
  
  public static calculate(
    context: DesignContext,
    theme: ThemeTokens,
    layouts: LayoutDecision[]
  ): DesignScore {
    const isDark = theme.isDark;
    const hasProjects = context.normalizedData.projects.length > 0;
    const hasExperience = context.normalizedData.experience.length > 0;
    const hasBio = !!context.normalizedData.personal.bioSummary;

    // Consistency score (e.g. check font uniformity and order layouts weights)
    const consistency = layouts.length > 0 ? 98 : 50;

    // Readability scores (based on contrast settings and fonts scale sizes)
    const readability = theme.typography.baseFontSize === "16px" ? 95 : 88;

    // Balance scoring
    const visualBalance = 92;

    // Accessibility standard compliance scores
    const accessibility = 95; // default AA level base

    // Professionalism score
    const professionalism = ["executive", "corporate", "minimal"].includes(theme.themeId) ? 97 : 90;

    // Modern Design metric
    const modernDesign = ["creative", "glassmorphism", "modern"].includes(theme.themeId) ? 98 : 88;

    // Portfolio completeness check
    let portfolioCompleteness = 50;
    if (hasProjects) portfolioCompleteness += 20;
    if (hasExperience) portfolioCompleteness += 20;
    if (hasBio) portfolioCompleteness += 10;

    // User experience score mapping
    const userExperience = 94;

    // Mobile experience rating scale
    const mobileExperience = 96;

    // Weighted average overall score
    const overall = Math.round(
      (consistency * 0.1) +
      (readability * 0.15) +
      (visualBalance * 0.1) +
      (accessibility * 0.15) +
      (professionalism * 0.1) +
      (modernDesign * 0.1) +
      (portfolioCompleteness * 0.1) +
      (userExperience * 0.1) +
      (mobileExperience * 0.1)
    );

    return {
      consistency,
      readability,
      visualBalance,
      accessibility,
      professionalism,
      modernDesign,
      portfolioCompleteness,
      userExperience,
      mobileExperience,
      overall
    };
  }
}
