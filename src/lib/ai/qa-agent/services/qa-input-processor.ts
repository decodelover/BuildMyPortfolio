import { QAContext, QAScores } from "../types";
import { QaInputError } from "../errors/qa-agent-errors";
import { QaSanitizer } from "../security/qa-sanitizer";
import { DataNormalizer } from "../../content-agent/services/data-normalizer";
import { DesignBlueprint } from "../../design-agent/types";
import { SEOBlueprint } from "../../seo-agent/types";

export interface QaInputProcessorParams {
  userId: string;
  builderId: string;
  planId: string;
  rawInput: Record<string, any>;
  contentBlocks?: any[];
  designBlueprint?: any;
  seoBlueprint?: any;
}

export class QaInputProcessor {
  public static process(params: QaInputProcessorParams): QAContext {
    const {
      userId,
      builderId,
      planId,
      rawInput,
      contentBlocks = [],
      designBlueprint: rawDesign,
      seoBlueprint: rawSeo
    } = params;

    if (!rawInput) {
      throw new QaInputError("Raw input data is required for QA validation.");
    }

    // Normalize using standard normalizer from content-agent
    const normalizedData = DataNormalizer.normalize(rawInput);

    // Map Design output to DesignBlueprint if it's lightweight or undefined
    let designBlueprint: DesignBlueprint | undefined = undefined;
    if (rawDesign) {
      if (rawDesign.blueprintId) {
        designBlueprint = rawDesign as DesignBlueprint;
      } else {
        // Wrap lightweight resolvedStyles from orchestrator wrapper
        const styles = rawDesign.resolvedStyles || {};
        const globalStyles = styles.global || {};
        designBlueprint = {
          blueprintId: "bp-design-wrapped",
          userId,
          builderId,
          planId,
          theme: {
            themeId: rawDesign.themeId || "modern",
            colors: {
              primary: globalStyles.primary || "#3b82f6",
              secondary: globalStyles.secondary || "#1d4ed8",
              accent: globalStyles.accent || "#f59e0b",
              background: globalStyles.background || "#ffffff",
              cardBg: globalStyles.cardBg || "#f3f4f6",
              border: globalStyles.border || "#e5e7eb",
              textPrimary: globalStyles.textPrimary || "#1f2937",
              textSecondary: globalStyles.textSecondary || "#4b5563",
              shadow: ""
            },
            typography: {
              headingsFont: "Inter",
              bodyFont: "Inter",
              monoFont: "Fira Code",
              headingScale: "major-third",
              baseFontSize: "16px",
              lineHeightBase: "1.6",
              fontWeightHeading: "700",
              fontWeightBody: "400"
            },
            spacing: {
              sectionPadding: "py-20 lg:py-32",
              containerMaxWidth: globalStyles.containerWidth || "max-w-7xl",
              gridGap: globalStyles.gapSize || "gap-8",
              itemSpacing: "space-y-6"
            },
            components: {
              borderRadius: globalStyles.borderRadius || "8px",
              elevation: { none: "", sm: "", md: "", lg: "" },
              cardStyle: { borderWidth: "1px", borderColor: "" },
              buttonStyle: { padding: "", borderRadius: "", fontWeight: "", shadow: "", hoverEffect: "" },
              inputStyle: { padding: "", borderRadius: "", bg: "", border: "", focusRing: "" }
            },
            responsive: {
              breakpoints: { sm: "", md: "", lg: "", xl: "", "2xl": "" },
              typographyScaling: { mobileMultiplier: 1, tabletMultiplier: 1, desktopMultiplier: 1 },
              sectionSpacingScaling: { mobile: "", tablet: "", desktop: "" }
            },
            isDark: false
          },
          layouts: Object.entries(styles.sections || {}).map(([key, val]: [string, any]) => ({
            sectionId: `sec-${key}`,
            type: key,
            layoutVariant: val.layoutType || "",
            orderWeight: 0,
            gridColumns: { mobile: 1, tablet: 2, desktop: 3 }
          })),
          components: [],
          visualHierarchy: {
            sectionOrder: [],
            visualWeightScale: { headings: "", body: "" },
            ctaPlacement: "hero-center",
            buttonHierarchy: { primaryClass: "", secondaryClass: "" },
            contentDensity: "normal",
            whitespaceDistribution: "medium",
            readingFlow: "F-Pattern"
          },
          responsive: { adaptiveLayouts: [] },
          animations: {
            pageTransition: { type: "fade", durationMs: 300 },
            scrollReveal: { active: true, effect: "fade-up", delayMs: 100, staggerMs: 50 },
            hoverEffects: { cards: "lift", buttons: "pulse" },
            motionIntensity: "medium",
            reducedMotionFallback: true
          },
          accessibility: {
            minimumContrastRatio: { normalText: "4.5:1", largeText: "3.0:1" },
            minFontSize: "14px",
            focusOutlineStyle: "outline-2 outline-offset-2 outline-accent",
            keyboardNavigationHints: { supportsSkipLink: true, ariaRolesMap: {} },
            ariaLabelsNeeded: [],
            wcagComplianceLevel: "AA"
          },
          scores: {
            consistency: 95,
            readability: 95,
            visualBalance: 95,
            accessibility: 95,
            professionalism: 95,
            modernDesign: 95,
            portfolioCompleteness: 95,
            userExperience: 95,
            mobileExperience: 95,
            overall: 95
          },
          metadata: {
            compilerVersion: "1.0.0",
            timestamp: new Date().toISOString(),
            designRulesApplied: 10
          }
        };
      }
    }

    // Map SEO output to SEOBlueprint if it's lightweight or undefined
    let seoBlueprint: SEOBlueprint | undefined = undefined;
    if (rawSeo) {
      if (rawSeo.blueprintId) {
        seoBlueprint = rawSeo as SEOBlueprint;
      } else {
        // Wrap lightweight seoMetadata from orchestrator wrapper
        const metadata = rawSeo.seoMetadata || {};
        seoBlueprint = {
          blueprintId: "bp-seo-wrapped",
          userId,
          builderId,
          planId,
          metadata: {
            metaTitle: metadata.titleTemplate?.replace("%s", "Home") || rawSeo.metaTitle || "",
            metaDescription: metadata.defaultDescription || rawSeo.metaDescription || "",
            focusKeywords: metadata.keywords || [],
            secondaryKeywords: [],
            canonicalUrl: rawSeo.canonicalUrl || "",
            portfolioSlug: metadata.portfolioSlug || rawSeo.portfolioSlug || "portfolio",
            robots: {
              index: true,
              follow: true
            },
            viewport: "width=device-width, initial-scale=1.0",
            author: normalizedData.personal?.fullName || "",
            language: "en"
          },
          structuredData: {
            person: metadata.schemaJsonLd?.mainEntity || {},
            profilePage: metadata.schemaJsonLd || {},
            webSite: {},
            organization: {},
            breadcrumbList: {}
          },
          social: {
            openGraph: {
              title: metadata.titleTemplate || "",
              description: metadata.defaultDescription || "",
              url: "",
              type: "profile",
              siteName: "",
              image: "",
              locale: "en"
            },
            twitter: {
              card: "summary",
              title: "",
              description: "",
              image: ""
            },
            linkedin: {
              title: "",
              description: "",
              image: ""
            },
            discord: {
              title: "",
              description: "",
              image: ""
            },
            whatsapp: {
              title: "",
              description: "",
              image: ""
            },
            telegram: {
              title: "",
              description: "",
              image: ""
            }
          },
          urlRules: {
            portfolioSlug: metadata.portfolioSlug || "portfolio",
            canonicalPath: "",
            sectionAnchors: [],
            projectPaths: [],
            blogPaths: [],
            redirects: [],
            multilingual: {
              enabled: false,
              locales: [],
              defaultLocale: "en"
            }
          },
          contentAnalysis: {
            headingHierarchy: { isValid: true, issues: [] },
            keywordDensity: {},
            sectionStructureScore: 95,
            internalLinkingScore: 95,
            contentLengthScore: 95,
            duplicateContentWarnings: [],
            readabilityScore: 95,
            semanticRelevanceIndex: 95,
            imageAltCoverageScore: 95,
            freshnessIndex: 95,
            recommendations: []
          },
          technicalRules: {
            sitemapStructure: { priority: 1, changefreq: "monthly" },
            robotsRules: { disallowPaths: [], allowPaths: [] },
            lazyLoadingStrategy: { images: "lazy", scripts: "defer" },
            assetOptimization: { fontDisplayRule: "swap", preloadAssets: [], prefetchDomains: [] }
          },
          accessibility: {
            linkLabels: { isValid: true, warnings: [] },
            imageAltTextStatus: { hasAlt: true, missingCount: 0 },
            ariaLabelsStatus: { isValid: true, issues: [] },
            contrastTargetsMet: true,
            screenReaderCues: [],
            wcagLevel: "AA"
          },
          scores: {
            metadata: 95,
            content: 95,
            technical: 95,
            structuredData: 95,
            accessibility: 95,
            performance: 95,
            socialSharing: 95,
            urlStructure: 95,
            readability: 95,
            keywordOptimization: 95,
            overall: 95
          },
          version: "1.0.0",
          timestamp: new Date().toISOString()
        };
      }
    }

    const context: QAContext = {
      userId,
      builderId,
      planId,
      rawInput,
      normalizedData,
      contentBlocks,
      designBlueprint,
      seoBlueprint
    };

    // Apply security sanitizer filters
    return QaSanitizer.sanitize(context);
  }
}
