import { PortfolioBlueprint, BlueprintNode, AssetRef, ThemeBlueprint, CompiledSEOBlueprint } from "../ai/compilation-engine/types";

// ─────────────────────────────────────────────────────────────────────────────
// Render Context & State Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ThemeCSSVariables {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  cardBg: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  shadow: string;
  radius: string;
  headingsFont: string;
  bodyFont: string;
  monoFont: string;
}

export interface AnimationVariantsConfig {
  reducedMotion: boolean;
  pageTransition: {
    initial: Record<string, any>;
    animate: Record<string, any>;
    exit: Record<string, any>;
    transition: Record<string, any>;
  };
  scrollReveal: {
    initial: Record<string, any>;
    whileInView: Record<string, any>;
    viewport: Record<string, any>;
    transition: Record<string, any>;
  };
  hoverEffect: {
    card: Record<string, any>;
    button: Record<string, any>;
  };
}

export interface ResponsiveClassesConfig {
  containerWidthClass: string;
  sectionPaddingClass: string;
  gridColumnsClass: string;
  gridGapClass: string;
}

export interface NormalizedSectionNode {
  id: string;
  type: string;
  title: string;
  order: number;
  content: Record<string, any>;
  componentId: string;
  variant: string;
  props: Record<string, any>;
  styles: Record<string, any>;
  responsiveClasses: ResponsiveClassesConfig;
  animationConfig: AnimationVariantsConfig;
}

export interface RenderContext {
  renderId: string;
  blueprintId: string;
  userId: string;
  builderId: string;
  planId: string;
  title: string;
  author: string;
  theme: ThemeBlueprint;
  cssVariables: ThemeCSSVariables;
  sections: NormalizedSectionNode[];
  assets: AssetRef[];
  seo: CompiledSEOBlueprint;
  routes: Array<{
    path: string;
    pageName: string;
    sectionIds: string[];
  }>;
  mainNav: Array<{ label: string; target: string; isExternal: boolean }>;
  footerNav: Array<{ label: string; target: string; group: string }>;
  isDarkMode: boolean;
}

export interface RenderPerformanceMetrics {
  totalDurationMs: number;
  blueprintParsingTimeMs: number;
  sectionsCount: number;
  assetsCount: number;
  estimatedDOMNodes: number;
  memoryEstimateMb: number;
}

export interface RenderReport {
  renderId: string;
  success: boolean;
  context: RenderContext | null;
  metrics: RenderPerformanceMetrics;
  warnings: string[];
  errors: string[];
  renderedAt: string;
}
