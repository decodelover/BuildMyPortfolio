import { NormalizedPortfolioData, ContentBlock } from "../content-agent/types";

export type DesignThemeId =
  | "modern"
  | "minimal"
  | "executive"
  | "corporate"
  | "creative"
  | "startup"
  | "dark-developer"
  | "glassmorphism";

export type ProfessionCategory =
  | "full-stack-developer"
  | "frontend-developer"
  | "backend-developer"
  | "mobile-developer"
  | "ai-ml-engineer"
  | "data-scientist"
  | "devops-cloud-engineer"
  | "cybersecurity-engineer"
  | "blockchain-developer"
  | "game-developer"
  | "ui-ux-designer"
  | "product-designer"
  | "software-engineer"
  | "general-consultant"
  | "marketing-creative"
  | "general-professional";

export interface DesignContext {
  userId: string;
  builderId: string;
  planId: string;
  rawInput: Record<string, any>;
  normalizedData: NormalizedPortfolioData;
  contentBlocks: ContentBlock[];
  professionCategory: ProfessionCategory;
  themePreference: string;
  colorPalettePreference?: string;
  fontPreference?: string;
  borderRadiusPreference?: string;
}

export interface ColorTokens {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  cardBg: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  shadow: string;
}

export interface TypographyTokens {
  headingsFont: string;
  bodyFont: string;
  monoFont: string;
  headingScale: "minor-second" | "major-second" | "minor-third" | "major-third" | "perfect-fourth" | "perfect-fifth" | "golden-ratio";
  baseFontSize: string; // e.g. "16px"
  lineHeightBase: string; // e.g. "1.6"
  fontWeightHeading: string; // e.g. "700"
  fontWeightBody: string; // e.g. "400"
}

export interface SpacingTokens {
  sectionPadding: string; // e.g. "py-20 lg:py-32"
  containerMaxWidth: string; // e.g. "max-w-7xl"
  gridGap: string; // e.g. "gap-8"
  itemSpacing: string; // e.g. "space-y-6"
}

export interface ComponentStyleTokens {
  borderRadius: string; // e.g. "8px"
  elevation: {
    none: string;
    sm: string;
    md: string;
    lg: string;
  };
  cardStyle: {
    borderWidth: string;
    borderColor: string;
    backdropBlur?: string;
    bgOpacity?: number;
  };
  buttonStyle: {
    padding: string;
    borderRadius: string;
    fontWeight: string;
    shadow: string;
    hoverEffect: string;
  };
  inputStyle: {
    padding: string;
    borderRadius: string;
    bg: string;
    border: string;
    focusRing: string;
  };
}

export interface ResponsiveTokens {
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
  };
  typographyScaling: {
    mobileMultiplier: number;
    tabletMultiplier: number;
    desktopMultiplier: number;
  };
  sectionSpacingScaling: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

export interface ThemeTokens {
  themeId: DesignThemeId;
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  components: ComponentStyleTokens;
  responsive: ResponsiveTokens;
  isDark: boolean;
}

export interface LayoutDecision {
  sectionId: string;
  type: string; // E.g. "hero", "about", "projects", "experience", "skills", "services", "testimonials", "blog", "contact", "footer"
  layoutVariant: string; // E.g. "split-right-image", "centered-hero", "masonry-grid", "interactive-timeline"
  orderWeight: number;
  gridColumns: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export interface ComponentDecision {
  sectionId: string;
  type: string;
  variant: string; // E.g. "featured-hero-card", "project-card-glass", "experience-timeline-dot"
  interactiveFeatures: string[]; // E.g. ["modal-popup", "filter-tabs", "load-more-pagination"]
  cardVariant: "glassmorphic" | "solid" | "minimal" | "outlined" | "flat";
  buttonVariant: {
    primary: "filled" | "outline" | "text" | "gradient";
    secondary: "filled" | "outline" | "text" | "gradient";
  };
}

export interface ResponsiveDecision {
  adaptiveLayouts: Array<{
    breakpoint: "mobile" | "tablet" | "laptop" | "desktop" | "large-display" | "foldable";
    navigationBehavior: "hamburger" | "side-nav" | "standard-top-nav" | "floating-bar";
    gridBehavior: "stack" | "scroll" | "wrap" | "grid";
    imageScalingStrategy: "cover" | "contain" | "aspect-auto";
    sectionSpacingMultiplier: number;
    fontSizeBaseScale: string;
  }>;
}

export interface AnimationDecision {
  pageTransition: {
    type: "fade" | "slide" | "zoom" | "none";
    durationMs: number;
  };
  scrollReveal: {
    active: boolean;
    effect: "fade-up" | "fade-in" | "zoom-in" | "slide-left";
    delayMs: number;
    staggerMs: number;
  };
  hoverEffects: {
    cards: "lift" | "scale" | "glow" | "border-draw" | "none";
    buttons: "pulse" | "fill-swipe" | "scale-up" | "none";
  };
  motionIntensity: "high" | "medium" | "low" | "none";
  reducedMotionFallback: boolean;
}

export interface AccessibilityDecision {
  minimumContrastRatio: {
    normalText: string; // e.g. "4.5:1"
    largeText: string; // e.g. "3.0:1"
  };
  minFontSize: string; // e.g. "14px"
  focusOutlineStyle: string; // e.g. "outline-2 outline-offset-2 outline-accent"
  keyboardNavigationHints: {
    supportsSkipLink: boolean;
    ariaRolesMap: Record<string, string>;
  };
  ariaLabelsNeeded: string[];
  wcagComplianceLevel: "AA" | "AAA";
}

export interface VisualHierarchyDecision {
  sectionOrder: string[];
  visualWeightScale: {
    headings: string; // e.g. "font-black"
    body: string; // e.g. "font-normal"
  };
  ctaPlacement: "hero-center" | "hero-right" | "navbar-end" | "sticky-bottom";
  buttonHierarchy: {
    primaryClass: string;
    secondaryClass: string;
  };
  contentDensity: "spacious" | "compact" | "normal";
  whitespaceDistribution: "extra-large" | "medium" | "snug";
  readingFlow: "F-Pattern" | "Z-Pattern" | "Gutenberg-Diagram";
}

export interface DesignScore {
  consistency: number; // 0-100
  readability: number;
  visualBalance: number;
  accessibility: number;
  professionalism: number;
  modernDesign: number;
  portfolioCompleteness: number;
  userExperience: number;
  mobileExperience: number;
  overall: number;
}

export interface DesignBlueprint {
  blueprintId: string;
  userId: string;
  builderId: string;
  planId: string;
  theme: ThemeTokens;
  layouts: LayoutDecision[];
  components: ComponentDecision[];
  visualHierarchy: VisualHierarchyDecision;
  responsive: ResponsiveDecision;
  animations: AnimationDecision;
  accessibility: AccessibilityDecision;
  scores: DesignScore;
  metadata: {
    compilerVersion: string;
    timestamp: string;
    designRulesApplied: number;
  };
}

export type DesignPipelineStatus =
  | "idle"
  | "processing_input"
  | "resolving_theme"
  | "resolving_layout"
  | "resolving_components"
  | "resolving_animations"
  | "resolving_responsive"
  | "resolving_accessibility"
  | "scoring"
  | "completed"
  | "failed";
