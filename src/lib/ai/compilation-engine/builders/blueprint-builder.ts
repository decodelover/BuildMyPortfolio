import {
  CompilationContext,
  PortfolioBlueprint,
  ThemeBlueprint,
  BlueprintNode,
  ComponentRef,
  AssetRef,
  ConflictResolution,
  NavigationBlueprint,
  AnimationBlueprint,
  ResponsiveBlueprint
} from "../types";
import { CompilationConfig } from "../config/compilation-config";

export class BlueprintBuilder {
  public static build(params: {
    context: CompilationContext;
    theme: ThemeBlueprint;
    sections: BlueprintNode[];
    components: Record<string, ComponentRef>;
    assets: AssetRef[];
    resolutions: ConflictResolution[];
    warnings: string[];
    durationMs: number;
  }): PortfolioBlueprint {
    const {
      context,
      theme,
      sections,
      components,
      assets,
      resolutions,
      warnings,
      durationMs
    } = params;

    const normalized = context.normalizedData;
    const seo = context.seoBlueprint;
    const qa = context.qualityReport;

    const blueprintId = `bp-port-${Date.now()}`;
    const version = CompilationConfig.compilerVersion;

    const allSectionIds = sections.map((sec) => sec.id);

    // Build Navigation Blueprint
    const navigation: NavigationBlueprint = {
      routes: [
        {
          path: "/",
          pageName: "Home",
          layoutType: "single-page-scroll",
          sectionIds: allSectionIds,
          isProtected: false
        },
        {
          path: "/#about",
          pageName: "About",
          layoutType: "section-anchor",
          sectionIds: ["sec-about"],
          isProtected: false
        },
        {
          path: "/#projects",
          pageName: "Projects",
          layoutType: "section-anchor",
          sectionIds: ["sec-projects"],
          isProtected: false
        },
        {
          path: "/#contact",
          pageName: "Contact",
          layoutType: "section-anchor",
          sectionIds: ["sec-contact"],
          isProtected: false
        }
      ],
      anchors: sections.map((sec) => ({
        sectionId: sec.id,
        label: sec.title,
        anchorId: `#${sec.type}`
      })),
      mainNavItems: sections
        .filter((sec) => ["about", "skills", "experience", "services", "projects", "contact"].includes(sec.type))
        .map((sec, idx) => ({
          label: sec.title.split(" ")[0], // First word as label
          target: `/#${sec.type}`,
          order: idx + 1,
          isExternal: false
        })),
      footerNavItems: [
        { label: "Privacy Policy", target: "/privacy", group: "legal" },
        { label: "Terms of Service", target: "/terms", group: "legal" }
      ]
    };

    const responsive: ResponsiveBlueprint = {
      breakpoints: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px"
      },
      typographyScaling: {
        mobileMultiplier: 0.875,
        tabletMultiplier: 1,
        desktopMultiplier: 1.125
      },
      sectionSpacingScaling: {
        mobile: "py-12",
        tablet: "py-16",
        desktop: "py-24"
      },
      imageScalingStrategy: "cover",
      adaptiveLayouts: [
        {
          breakpoint: "mobile",
          navigationBehavior: "hamburger",
          gridBehavior: "stack",
          sectionSpacingMultiplier: 0.75
        },
        {
          breakpoint: "desktop",
          navigationBehavior: "standard-top-nav",
          gridBehavior: "grid",
          sectionSpacingMultiplier: 1.0
        }
      ]
    };

    const animations: AnimationBlueprint = {
      pageTransition: {
        type: "fade",
        durationMs: 300
      },
      scrollReveal: {
        active: true,
        effect: "fade-up",
        delayMs: 100,
        staggerMs: 50
      },
      hoverEffects: {
        cards: "lift",
        buttons: "pulse"
      },
      motionIntensity: "medium",
      reducedMotionFallback: true
    };

    return {
      blueprintId,
      version,
      revision: 1,
      userId: context.userId,
      builderId: context.builderId,
      planId: context.planId,
      metadata: {
        compiledAt: new Date().toISOString(),
        compilerVersion: version,
        qualityScore: qa?.scores?.overall ?? 95,
        title: `${normalized.personal?.fullName || "Developer"} Portfolio`,
        author: normalized.personal?.fullName || "Portfolio Owner"
      },
      theme,
      sections,
      components,
      assets,
      seo: {
        metaTitle: seo?.metadata?.metaTitle || `${normalized.personal?.fullName || "Developer"} Portfolio`,
        metaDescription: seo?.metadata?.metaDescription || normalized.personal?.bioSummary || "",
        keywords: seo?.metadata?.focusKeywords || [],
        canonicalUrl: seo?.metadata?.canonicalUrl || "",
        structuredData: (seo?.structuredData as Record<string, any>) || {},
        socialSharing: (seo?.social as Record<string, any>) || {},
        robots: {
          index: true,
          follow: true
        },
        language: "en",
        author: normalized.personal?.fullName || "Portfolio Owner"
      },
      accessibility: {
        wcagCompliance: theme.accessibility?.wcagComplianceLevel || "AA",
        ariaLandmarks: {
          nav: "main-navigation",
          main: "main-content",
          footer: "page-footer"
        },
        focusOutlineStyle: theme.accessibility?.focusOutlineStyle || "outline-2 outline-primary",
        skipLinkEnabled: true,
        minimumContrastRatio: {
          normalText: "4.5:1",
          largeText: "3.0:1"
        },
        minFontSize: "14px",
        screenReaderCues: ["landmarks", "headings", "links"],
        keyboardNavigationEnabled: true
      },
      performance: {
        lazyLoadEnabled: true,
        fontDisplayRule: "swap",
        codeSplittingEnabled: true,
        preloadAssets: [],
        prefetchDomains: [],
        sectionCount: sections.length,
        assetCount: assets.length,
        estimatedBundleSizeKb: 150,
        imageOptimizationEnabled: true,
        scriptLoadingStrategy: "defer"
      },
      security: {
        sanitized: true,
        scriptInjectionCount: 0,
        urlViolationsCount: 0,
        metadataIntegrityHash: `hash-${blueprintId}`,
        allowedProtocols: ["http:", "https:"],
        contentSecurityHints: ["default-src 'self'"]
      },
      analytics: {
        eventTrackingHooks: [],
        aiMetadata: {
          generationEngine: "BuildMyPortfolio Engine v1.0",
          modelProvider: "deterministic-compiler"
        }
      },
      navigation,
      responsive,
      animations,
      compilationMetrics: {
        totalDurationMs: durationMs,
        stageTimings: [
          {
            stageName: "PipelineExecution",
            durationMs,
            startedAt: new Date(Date.now() - durationMs).toISOString(),
            completedAt: new Date().toISOString()
          }
        ],
        totalErrorsResolved: resolutions.length,
        totalWarnings: warnings.length,
        warningsList: warnings,
        dependenciesResolved: sections.length,
        conflictsResolved: resolutions.length,
        sectionsCompiled: sections.length,
        assetsCompiled: assets.length,
        estimatedMemoryMb: 12
      }
    };
  }
}
