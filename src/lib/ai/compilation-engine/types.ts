import { NormalizedPortfolioData, ContentBlock } from "../content-agent/types";
import { DesignBlueprint } from "../design-agent/types";
import { SEOBlueprint } from "../seo-agent/types";
import { QualityReport } from "../qa-agent/types";

// ─────────────────────────────────────────────────────────────────────────────
// Section Types
// ─────────────────────────────────────────────────────────────────────────────

export type BlueprintSectionType =
  | "hero"
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "education"
  | "certifications"
  | "testimonials"
  | "services"
  | "blog"
  | "gallery"
  | "statistics"
  | "resume"
  | "contact"
  | "footer"
  | "navigation"
  | "not-found"
  | "legal";

// ─────────────────────────────────────────────────────────────────────────────
// Component Reference
// ─────────────────────────────────────────────────────────────────────────────

export interface ComponentRef {
  componentId: string;
  variant: string;
  props: Record<string, any>;
  interactiveFeatures: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Blueprint Node (Individual Section)
// ─────────────────────────────────────────────────────────────────────────────

export interface BlueprintNode {
  id: string;
  type: BlueprintSectionType;
  order: number;
  title: string;
  content: Record<string, any>;
  componentRef: ComponentRef;
  styles: Record<string, any>;
  responsive?: Record<string, any>;
  animation?: Record<string, any>;
  accessibility?: Record<string, any>;
  metadata?: Record<string, any>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Asset Reference
// ─────────────────────────────────────────────────────────────────────────────

export type AssetType = "image" | "document" | "video" | "logo" | "icon" | "certificate" | "resume" | "social";

export interface AssetRef {
  assetId: string;
  type: AssetType;
  url: string;
  alt: string;
  optimizationHints: {
    lazyLoad: boolean;
    formatPreference?: string;
    maxSizeKb?: number;
    width?: number;
    height?: number;
  };
  sourceSectionId?: string;
  deduplicationKey?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Theme Blueprint
// ─────────────────────────────────────────────────────────────────────────────

export interface ThemeBlueprint {
  themeId: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    cardBg: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    shadow: string;
  };
  typography: {
    headingsFont: string;
    bodyFont: string;
    monoFont: string;
    headingScale: string;
    baseFontSize: string;
    lineHeightBase: string;
    fontWeightHeading: string;
    fontWeightBody: string;
  };
  spacing: {
    sectionPadding: string;
    containerMaxWidth: string;
    gridGap: string;
    itemSpacing: string;
  };
  components: {
    borderRadius: string;
    elevation: Record<string, string>;
    cardStyle: Record<string, any>;
    buttonStyle: Record<string, any>;
    inputStyle: Record<string, any>;
  };
  responsive: Record<string, any>;
  animations: Record<string, any>;
  accessibility: Record<string, any>;
  isDark: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Route Blueprint
// ─────────────────────────────────────────────────────────────────────────────

export interface RouteBlueprint {
  path: string;
  pageName: string;
  layoutType: string;
  sectionIds: string[];
  isProtected: boolean;
  metadata?: Record<string, any>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Navigation Blueprint
// ─────────────────────────────────────────────────────────────────────────────

export interface NavigationBlueprint {
  routes: RouteBlueprint[];
  anchors: Array<{
    sectionId: string;
    label: string;
    anchorId: string;
  }>;
  mainNavItems: Array<{
    label: string;
    target: string;
    order: number;
    isExternal: boolean;
  }>;
  footerNavItems: Array<{
    label: string;
    target: string;
    group: string;
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Animation Blueprint
// ─────────────────────────────────────────────────────────────────────────────

export interface AnimationBlueprint {
  pageTransition: {
    type: string;
    durationMs: number;
  };
  scrollReveal: {
    active: boolean;
    effect: string;
    delayMs: number;
    staggerMs: number;
  };
  hoverEffects: {
    cards: string;
    buttons: string;
  };
  motionIntensity: string;
  reducedMotionFallback: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Accessibility Blueprint
// ─────────────────────────────────────────────────────────────────────────────

export interface AccessibilityBlueprint {
  wcagCompliance: string;
  ariaLandmarks: Record<string, string>;
  focusOutlineStyle: string;
  skipLinkEnabled: boolean;
  minimumContrastRatio: {
    normalText: string;
    largeText: string;
  };
  minFontSize: string;
  screenReaderCues: string[];
  keyboardNavigationEnabled: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Responsive Blueprint
// ─────────────────────────────────────────────────────────────────────────────

export interface ResponsiveBlueprint {
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
  imageScalingStrategy: string;
  adaptiveLayouts: Array<{
    breakpoint: string;
    navigationBehavior: string;
    gridBehavior: string;
    sectionSpacingMultiplier: number;
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Performance Blueprint
// ─────────────────────────────────────────────────────────────────────────────

export interface PerformanceBlueprint {
  lazyLoadEnabled: boolean;
  fontDisplayRule: string;
  codeSplittingEnabled: boolean;
  preloadAssets: string[];
  prefetchDomains: string[];
  sectionCount: number;
  assetCount: number;
  estimatedBundleSizeKb: number;
  imageOptimizationEnabled: boolean;
  scriptLoadingStrategy: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Security Blueprint
// ─────────────────────────────────────────────────────────────────────────────

export interface SecurityBlueprint {
  sanitized: boolean;
  scriptInjectionCount: number;
  urlViolationsCount: number;
  metadataIntegrityHash: string;
  allowedProtocols: string[];
  contentSecurityHints: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Analytics Blueprint
// ─────────────────────────────────────────────────────────────────────────────

export interface AnalyticsBlueprint {
  googleAnalyticsId?: string;
  eventTrackingHooks: Array<{
    eventName: string;
    sectionId: string;
    triggerType: string;
  }>;
  aiMetadata: Record<string, any>;
}

// ─────────────────────────────────────────────────────────────────────────────
// SEO Blueprint (compiled output shape)
// ─────────────────────────────────────────────────────────────────────────────

export interface CompiledSEOBlueprint {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  structuredData: Record<string, any>;
  socialSharing: Record<string, any>;
  robots: {
    index: boolean;
    follow: boolean;
  };
  language: string;
  author: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Compilation Metrics
// ─────────────────────────────────────────────────────────────────────────────

export interface CompilationStageMetric {
  stageName: string;
  durationMs: number;
  startedAt: string;
  completedAt: string;
}

export interface CompilationMetrics {
  totalDurationMs: number;
  stageTimings: CompilationStageMetric[];
  totalErrorsResolved: number;
  totalWarnings: number;
  warningsList: string[];
  dependenciesResolved: number;
  conflictsResolved: number;
  sectionsCompiled: number;
  assetsCompiled: number;
  estimatedMemoryMb: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Portfolio Blueprint (Final Output — Single Source of Truth)
// ─────────────────────────────────────────────────────────────────────────────

export interface PortfolioBlueprint {
  blueprintId: string;
  version: string;
  revision: number;
  userId: string;
  builderId: string;
  planId: string;
  metadata: {
    compiledAt: string;
    compilerVersion: string;
    qualityScore: number;
    title: string;
    author: string;
  };
  theme: ThemeBlueprint;
  sections: BlueprintNode[];
  components: Record<string, ComponentRef>;
  assets: AssetRef[];
  seo: CompiledSEOBlueprint;
  accessibility: AccessibilityBlueprint;
  performance: PerformanceBlueprint;
  security: SecurityBlueprint;
  analytics: AnalyticsBlueprint;
  navigation: NavigationBlueprint;
  responsive: ResponsiveBlueprint;
  animations: AnimationBlueprint;
  compilationMetrics: CompilationMetrics;
}

// ─────────────────────────────────────────────────────────────────────────────
// Compilation Context (Input to pipeline)
// ─────────────────────────────────────────────────────────────────────────────

export interface CompilationContext {
  userId: string;
  builderId: string;
  planId: string;
  rawInput: Record<string, any>;
  normalizedData: NormalizedPortfolioData;
  contentBlocks: ContentBlock[];
  designBlueprint?: DesignBlueprint;
  seoBlueprint?: SEOBlueprint;
  qualityReport?: QualityReport;
}

// ─────────────────────────────────────────────────────────────────────────────
// Dependency & Conflict Resolution
// ─────────────────────────────────────────────────────────────────────────────

export interface DependencyIssue {
  type: "missing" | "incompatible";
  source: string;
  target: string;
  message: string;
  severity: "critical" | "warning" | "info";
}

export interface ConflictResolution {
  field: string;
  conflictType: string;
  resolvedValue: any;
  resolutionStrategy: string;
}

export interface DependencyResolutionResult {
  isValid: boolean;
  issues: DependencyIssue[];
  warnings: string[];
}

export interface ConflictResolutionResult {
  resolutions: ConflictResolution[];
  warnings: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Blueprint Versioning
// ─────────────────────────────────────────────────────────────────────────────

export interface BlueprintSnapshot {
  snapshotId: string;
  timestamp: string;
  context: CompilationContext;
  metadata: {
    reason: string;
    triggeredBy: string;
  };
}

export interface BlueprintVersion {
  versionId: string;
  revision: number;
  changeLog: string;
  timestamp: string;
  blueprintSnapshot: BlueprintSnapshot;
  diffSummary: {
    sectionsAdded: number;
    sectionsRemoved: number;
    sectionsModified: number;
    themeChanged: boolean;
    assetsChanged: number;
  };
  isRollbackTarget: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Pipeline Status
// ─────────────────────────────────────────────────────────────────────────────

export type CompilationPipelineStatus =
  | "idle"
  | "processing_input"
  | "resolving_dependencies"
  | "resolving_conflicts"
  | "creating_snapshot"
  | "compiling_theme"
  | "compiling_components"
  | "compiling_assets"
  | "compiling_sections"
  | "compiling_navigation"
  | "compiling_seo"
  | "compiling_accessibility"
  | "compiling_animations"
  | "compiling_responsive"
  | "compiling_performance"
  | "building_blueprint"
  | "sanitizing"
  | "validating_blueprint"
  | "versioning"
  | "completed"
  | "failed";

// ─────────────────────────────────────────────────────────────────────────────
// Pipeline Progress Callback
// ─────────────────────────────────────────────────────────────────────────────

export interface CompilationProgressEvent {
  status: CompilationPipelineStatus;
  progress: number;
  stageName: string;
  message: string;
}

export type CompilationProgressCallback = (event: CompilationProgressEvent) => void;

// ─────────────────────────────────────────────────────────────────────────────
// Compilation Result
// ─────────────────────────────────────────────────────────────────────────────

export interface CompilationResult {
  success: boolean;
  blueprint: PortfolioBlueprint | null;
  version: BlueprintVersion | null;
  errors: string[];
  warnings: string[];
  metrics: CompilationMetrics;
}
