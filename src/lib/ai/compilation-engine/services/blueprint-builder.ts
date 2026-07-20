import {
  CompilationContext,
  PortfolioBlueprint,
  ConflictResolution,
  SecurityBlueprint,
  AnalyticsBlueprint,
  CompilationMetrics,
  CompilationStageMetric
} from "../types";
import { CompilationConfig } from "../config/compilation-config";

import { ThemeCompiler } from "../compilers/theme-compiler";
import { ComponentCompiler } from "../compilers/component-compiler";
import { SectionCompiler } from "../compilers/section-compiler";
import { AssetCompiler } from "../compilers/asset-compiler";
import { NavigationCompiler } from "../compilers/navigation-compiler";
import { SEOCompiler } from "../compilers/seo-compiler";
import { AccessibilityCompiler } from "../compilers/accessibility-compiler";
import { AnimationCompiler } from "../compilers/animation-compiler";
import { ResponsiveCompiler } from "../compilers/responsive-compiler";
import { PerformanceCompiler } from "../compilers/performance-compiler";

export interface BlueprintBuilderParams {
  context: CompilationContext;
  resolutions: ConflictResolution[];
  stageMetrics: CompilationStageMetric[];
  warnings: string[];
  totalErrorsResolved: number;
  dependenciesCount: number;
}

export class BlueprintBuilder {
  public static build(params: BlueprintBuilderParams): PortfolioBlueprint {
    const { context, resolutions, stageMetrics, warnings, totalErrorsResolved, dependenciesCount } = params;

    const blueprintId = `bp-${context.planId}-${Date.now()}`;
    const version = CompilationConfig.compilerVersion;
    const revision = 1;

    // 1. Theme
    const theme = ThemeCompiler.compile(context, resolutions);

    // 2. Components
    const components = ComponentCompiler.compile(context);

    // 3. Assets
    const assets = AssetCompiler.compile(context);

    // 4. Sections
    const sections = SectionCompiler.compile(context, components, resolutions);

    // 5. Navigation
    const navigation = NavigationCompiler.compile(context, sections);

    // 6. SEO
    const seo = SEOCompiler.compile(context, resolutions);

    // 7. Accessibility
    const accessibility = AccessibilityCompiler.compile(context, resolutions);

    // 8. Animations
    const animations = AnimationCompiler.compile(context, resolutions);

    // 9. Responsive
    const responsive = ResponsiveCompiler.compile(context);

    // 10. Performance
    const performance = PerformanceCompiler.compile(context, sections, assets);

    // 11. Security Blueprint
    const security: SecurityBlueprint = {
      sanitized: false, // will be marked true after sanitization pass
      scriptInjectionCount: 0,
      urlViolationsCount: 0,
      metadataIntegrityHash: "",
      allowedProtocols: CompilationConfig.defaultSecurity.allowedProtocols,
      contentSecurityHints: CompilationConfig.defaultSecurity.contentSecurityHints
    };

    // 12. Analytics Blueprint
    const analytics: AnalyticsBlueprint = {
      googleAnalyticsId: context.rawInput?.websitePreferences?.googleAnalyticsId || undefined,
      eventTrackingHooks: CompilationConfig.defaultAnalytics.eventTrackingHooks,
      aiMetadata: {
        compilationTarget: "production-blueprint",
        targetRenderers: ["Next.js", "React", "Vue", "Nuxt", "Astro", "Static HTML", "Mobile", "Desktop"]
      }
    };

    // 13. Calculate Quality Score from QA report or fallback
    const qualityScore = context.qualityReport?.scores?.overall ?? 95;

    // 14. Calculate Compilation Metrics
    const totalDurationMs = stageMetrics.reduce((sum, m) => sum + m.durationMs, 0);

    const compilationMetrics: CompilationMetrics = {
      totalDurationMs,
      stageTimings: stageMetrics,
      totalErrorsResolved,
      totalWarnings: warnings.length,
      warningsList: warnings,
      dependenciesResolved: dependenciesCount,
      conflictsResolved: resolutions.length,
      sectionsCompiled: sections.length,
      assetsCompiled: assets.length,
      estimatedMemoryMb: Math.round((JSON.stringify({ sections, theme, assets }).length / (1024 * 1024)) * 100) / 100
    };

    // Construct final Portfolio Blueprint
    const blueprint: PortfolioBlueprint = {
      blueprintId,
      version,
      revision,
      userId: context.userId,
      builderId: context.builderId,
      planId: context.planId,
      metadata: {
        compiledAt: new Date().toISOString(),
        compilerVersion: version,
        qualityScore,
        title: seo.metaTitle,
        author: seo.author
      },
      theme,
      sections,
      components,
      assets,
      seo,
      accessibility,
      performance,
      security,
      analytics,
      navigation,
      responsive,
      animations,
      compilationMetrics
    };

    return blueprint;
  }
}
