import { BlueprintSectionType, CompilationPipelineStatus } from "../types";

export class CompilationConfig {
  // ─────────────────────────────────────────────────────────────────────────
  // Limits
  // ─────────────────────────────────────────────────────────────────────────

  public static readonly maxSectionsCount = 25;
  public static readonly maxAssetsCount = 100;
  public static readonly maxVersionHistoryDepth = 10;
  public static readonly maxSnapshotRetention = 5;
  public static readonly maxUrlLength = 2048;
  
  // ─────────────────────────────────────────────────────────────────────────
  // Compiler Version
  // ─────────────────────────────────────────────────────────────────────────

  public static readonly compilerVersion = "1.0.0";

  public static readonly compilerVersionHistory: string[] = [
    "1.0.0"
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // Pipeline Stage Order
  // ─────────────────────────────────────────────────────────────────────────

  public static readonly pipelineStageOrder: CompilationPipelineStatus[] = [
    "processing_input",
    "resolving_dependencies",
    "resolving_conflicts",
    "creating_snapshot",
    "compiling_theme",
    "compiling_components",
    "compiling_assets",
    "compiling_sections",
    "compiling_navigation",
    "compiling_seo",
    "compiling_accessibility",
    "compiling_animations",
    "compiling_responsive",
    "compiling_performance",
    "building_blueprint",
    "sanitizing",
    "validating_blueprint",
    "versioning"
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // Default Section Weights (Ordering)
  // ─────────────────────────────────────────────────────────────────────────

  public static readonly defaultSectionWeights: Record<BlueprintSectionType, number> = {
    navigation: 0,
    hero: 10,
    about: 20,
    skills: 30,
    experience: 40,
    education: 50,
    certifications: 60,
    services: 70,
    projects: 80,
    testimonials: 90,
    statistics: 100,
    blog: 110,
    gallery: 120,
    resume: 130,
    contact: 140,
    footer: 150,
    "not-found": 160,
    legal: 170
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Default Theme Palette
  // ─────────────────────────────────────────────────────────────────────────

  public static readonly defaultThemePalette = {
    primary: "#3b82f6",
    secondary: "#1d4ed8",
    accent: "#f59e0b",
    background: "#ffffff",
    cardBg: "#f3f4f6",
    border: "#e5e7eb",
    textPrimary: "#1f2937",
    textSecondary: "#4b5563",
    shadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Default Typography
  // ─────────────────────────────────────────────────────────────────────────

  public static readonly defaultTypography = {
    headingsFont: "Inter",
    bodyFont: "Inter",
    monoFont: "Fira Code",
    headingScale: "perfect-fourth",
    baseFontSize: "16px",
    lineHeightBase: "1.6",
    fontWeightHeading: "700",
    fontWeightBody: "400"
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Default Spacing
  // ─────────────────────────────────────────────────────────────────────────

  public static readonly defaultSpacing = {
    sectionPadding: "py-16 md:py-24",
    containerMaxWidth: "max-w-7xl",
    gridGap: "gap-8",
    itemSpacing: "space-y-6"
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Default Animations
  // ─────────────────────────────────────────────────────────────────────────

  public static readonly defaultAnimations = {
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

  // ─────────────────────────────────────────────────────────────────────────
  // Default Accessibility
  // ─────────────────────────────────────────────────────────────────────────

  public static readonly defaultAccessibility = {
    wcagCompliance: "AA",
    minimumContrastRatio: {
      normalText: "4.5:1",
      largeText: "3.0:1"
    },
    minFontSize: "14px",
    focusOutlineStyle: "outline-2 outline-offset-2 outline-accent",
    skipLinkEnabled: true,
    keyboardNavigationEnabled: true,
    ariaLandmarks: {
      navigation: "navigation",
      hero: "banner",
      about: "main",
      contact: "complementary",
      footer: "contentinfo"
    } as Record<string, string>,
    screenReaderCues: [] as string[]
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Default Responsive
  // ─────────────────────────────────────────────────────────────────────────

  public static readonly defaultResponsive = {
    breakpoints: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px"
    },
    typographyScaling: {
      mobileMultiplier: 0.875,
      tabletMultiplier: 0.9375,
      desktopMultiplier: 1.0
    },
    sectionSpacingScaling: {
      mobile: "py-8",
      tablet: "py-12",
      desktop: "py-16 lg:py-24"
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
        breakpoint: "tablet",
        navigationBehavior: "hamburger",
        gridBehavior: "wrap",
        sectionSpacingMultiplier: 0.9
      },
      {
        breakpoint: "desktop",
        navigationBehavior: "standard-top-nav",
        gridBehavior: "grid",
        sectionSpacingMultiplier: 1.0
      }
    ]
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Default Performance
  // ─────────────────────────────────────────────────────────────────────────

  public static readonly defaultPerformance = {
    lazyLoadEnabled: true,
    fontDisplayRule: "swap",
    codeSplittingEnabled: true,
    imageOptimizationEnabled: true,
    scriptLoadingStrategy: "defer",
    estimatedBundleSizeKb: 0,
    preloadAssets: [] as string[],
    prefetchDomains: ["fonts.googleapis.com", "fonts.gstatic.com"] as string[]
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Default Security
  // ─────────────────────────────────────────────────────────────────────────

  public static readonly defaultSecurity = {
    allowedProtocols: ["https:", "http:", "mailto:", "tel:"],
    contentSecurityHints: [
      "default-src 'self'",
      "img-src 'self' https: data:",
      "font-src 'self' https://fonts.gstatic.com"
    ],
    metadataHashAlgorithm: "sha256"
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Default Analytics
  // ─────────────────────────────────────────────────────────────────────────

  public static readonly defaultAnalytics = {
    eventTrackingHooks: [] as Array<{ eventName: string; sectionId: string; triggerType: string }>,
    aiMetadata: {} as Record<string, any>
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Section Navigation Labels
  // ─────────────────────────────────────────────────────────────────────────

  public static readonly sectionNavLabels: Record<string, string> = {
    hero: "Home",
    about: "About",
    projects: "Projects",
    skills: "Skills",
    experience: "Experience",
    education: "Education",
    certifications: "Certifications",
    services: "Services",
    testimonials: "Testimonials",
    blog: "Blog",
    gallery: "Gallery",
    statistics: "Statistics",
    resume: "Resume",
    contact: "Contact"
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Navigable Sections (sections that appear in main nav)
  // ─────────────────────────────────────────────────────────────────────────

  public static readonly navigableSections: BlueprintSectionType[] = [
    "hero",
    "about",
    "projects",
    "skills",
    "experience",
    "education",
    "services",
    "testimonials",
    "blog",
    "gallery",
    "contact"
  ];
}
