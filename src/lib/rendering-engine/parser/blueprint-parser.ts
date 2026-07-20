import { PortfolioBlueprint, BlueprintNode } from "../../ai/compilation-engine/types";
import { RenderContext, NormalizedSectionNode } from "../types";
import { ThemeRenderer } from "../renderers/theme-renderer";
import { AnimationRenderer } from "../renderers/animation-renderer";
import { ResponsiveRenderer } from "../renderers/responsive-renderer";
import { BlueprintParsingError } from "../errors/rendering-errors";

export class BlueprintParser {
  public static parse(blueprintInput: any): RenderContext {
    if (!blueprintInput) {
      throw new BlueprintParsingError("Cannot parse null or undefined blueprint input.");
    }

    const isFullBlueprint = Boolean(blueprintInput.blueprintId && blueprintInput.theme && blueprintInput.sections);

    const blueprintId = blueprintInput.blueprintId || blueprintInput.manifestId || `bp-${Date.now()}`;
    const userId = blueprintInput.userId || "anonymous";
    const builderId = blueprintInput.builderId || "builder-default";
    const planId = blueprintInput.planId || "plan-default";

    // 1. Resolve Theme
    const themeRaw = isFullBlueprint ? blueprintInput.theme : this.convertLegacyTheme(blueprintInput.theme);
    const cssVariables = ThemeRenderer.computeCSSVariables(themeRaw);

    // 2. Resolve Sections
    const rawSections = isFullBlueprint ? blueprintInput.sections : this.convertLegacyPagesToSections(blueprintInput.pages);

    const sections: NormalizedSectionNode[] = rawSections.map((sec: any) => {
      const compRef = sec.componentRef || {
        componentId: `comp-${sec.type}`,
        variant: "default",
        props: {}
      };

      const animConfig = AnimationRenderer.computeAnimationVariants(blueprintInput.animations, sec.animation);
      const respClasses = ResponsiveRenderer.computeResponsiveClasses(sec.styles);

      return {
        id: sec.id || `sec-${sec.type}`,
        type: sec.type || "hero",
        title: sec.title || "Section",
        order: sec.order ?? 0,
        content: sec.content || {},
        componentId: compRef.componentId,
        variant: compRef.variant || "default",
        props: compRef.props || {},
        styles: sec.styles || {},
        responsiveClasses: respClasses,
        animationConfig: animConfig
      };
    });

    // 3. Resolve Navigation & SEO
    const seo = blueprintInput.seo || {
      metaTitle: blueprintInput.metadata?.title || "Professional Portfolio",
      metaDescription: "Welcome to my portfolio website.",
      keywords: ["Portfolio", "Developer"],
      canonicalUrl: "",
      structuredData: {},
      socialSharing: {},
      robots: { index: true, follow: true },
      language: "en",
      author: "Portfolio Owner"
    };

    const routes = blueprintInput.navigation?.routes || [
      { path: "/", pageName: "Home", sectionIds: sections.map((s) => s.id) }
    ];

    const mainNav = blueprintInput.navigation?.mainNavItems || [
      { label: "About", target: "#about", isExternal: false },
      { label: "Projects", target: "#projects", isExternal: false },
      { label: "Contact", target: "#contact", isExternal: false }
    ];

    const footerNav = blueprintInput.navigation?.footerNavItems || [];

    const assets = blueprintInput.assets || [];

    return {
      renderId: `rnd-${blueprintId}-${Date.now()}`,
      blueprintId,
      userId,
      builderId,
      planId,
      title: seo.metaTitle,
      author: seo.author,
      theme: themeRaw,
      cssVariables,
      sections,
      assets,
      seo,
      routes,
      mainNav,
      footerNav,
      isDarkMode: themeRaw?.isDark ?? false
    };
  }

  private static convertLegacyTheme(legacyTheme: any) {
    const palette = legacyTheme?.palette || {};
    const typography = legacyTheme?.typography || {};
    return {
      themeId: legacyTheme?.themeId || "modern",
      colors: {
        primary: palette.primary || "#3b82f6",
        secondary: palette.secondary || "#1d4ed8",
        accent: palette.accent || "#f59e0b",
        background: palette.background || "#ffffff",
        cardBg: palette.cardBg || "#f3f4f6",
        border: palette.border || "#e5e7eb",
        textPrimary: palette.textPrimary || "#1f2937",
        textSecondary: palette.textSecondary || "#4b5563",
        shadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
      },
      typography: {
        headingsFont: typography.headingsFont || "Inter",
        bodyFont: typography.bodyFont || "Inter",
        monoFont: typography.monoFont || "Fira Code",
        headingScale: "perfect-fourth",
        baseFontSize: "16px",
        lineHeightBase: "1.6",
        fontWeightHeading: "700",
        fontWeightBody: "400"
      },
      spacing: { sectionPadding: "py-16", containerMaxWidth: "max-w-7xl", gridGap: "gap-8", itemSpacing: "space-y-6" },
      components: { borderRadius: "8px", elevation: {}, cardStyle: {}, buttonStyle: {}, inputStyle: {} },
      responsive: {},
      animations: {},
      accessibility: {},
      isDark: false
    };
  }

  private static convertLegacyPagesToSections(pages: any[] = []) {
    const sections: any[] = [];
    pages.forEach((page) => {
      if (page.sections && Array.isArray(page.sections)) {
        sections.push(...page.sections);
      }
    });
    return sections;
  }
}
