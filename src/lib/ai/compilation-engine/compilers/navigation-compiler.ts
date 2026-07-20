import { CompilationContext, NavigationBlueprint, BlueprintNode, RouteBlueprint } from "../types";
import { CompilationConfig } from "../config/compilation-config";

export class NavigationCompiler {
  public static compile(
    context: CompilationContext,
    sections: BlueprintNode[]
  ): NavigationBlueprint {
    const rawInput = context.rawInput || {};
    const customSlug = context.seoBlueprint?.urlRules?.portfolioSlug || rawInput.customSlug || "portfolio";

    // 1. Generate Routes
    const homeSectionIds = sections.map((s) => s.id);

    const routes: RouteBlueprint[] = [
      {
        path: "/",
        pageName: "Home",
        layoutType: "single-page-portfolio",
        sectionIds: homeSectionIds,
        isProtected: false,
        metadata: {
          slug: "home",
          canonical: `/${customSlug}`
        }
      },
      {
        path: "/404",
        pageName: "404 Not Found",
        layoutType: "standalone-card",
        sectionIds: ["sec-not-found"],
        isProtected: false,
        metadata: {
          slug: "404"
        }
      },
      {
        path: "/legal",
        pageName: "Legal & Privacy",
        layoutType: "legal-document",
        sectionIds: ["sec-legal"],
        isProtected: false,
        metadata: {
          slug: "legal"
        }
      }
    ];

    // 2. Generate Anchors
    const anchors: NavigationBlueprint["anchors"] = [];
    sections.forEach((sec) => {
      if (CompilationConfig.navigableSections.includes(sec.type) && sec.type !== "hero") {
        anchors.push({
          sectionId: sec.id,
          label: CompilationConfig.sectionNavLabels[sec.type] || sec.title,
          anchorId: `#${sec.type}`
        });
      }
    });

    // 3. Main Navigation Items
    const mainNavItems: NavigationBlueprint["mainNavItems"] = anchors.map((a, idx) => ({
      label: a.label,
      target: a.anchorId,
      order: idx + 1,
      isExternal: false
    }));

    // Add extra custom links if defined in raw inputs
    if (rawInput.customNavLinks && Array.isArray(rawInput.customNavLinks)) {
      rawInput.customNavLinks.forEach((link: any, idx: number) => {
        if (link.label && link.url) {
          mainNavItems.push({
            label: link.label,
            target: link.url,
            order: mainNavItems.length + 1,
            isExternal: link.url.startsWith("http")
          });
        }
      });
    }

    // 4. Footer Navigation Items
    const footerNavItems: NavigationBlueprint["footerNavItems"] = [
      ...mainNavItems.map((n) => ({
        label: n.label,
        target: n.target,
        group: "Navigation"
      })),
      {
        label: "Privacy Policy",
        target: "/legal",
        group: "Legal"
      },
      {
        label: "Terms of Service",
        target: "/legal",
        group: "Legal"
      }
    ];

    return {
      routes,
      anchors,
      mainNavItems,
      footerNavItems
    };
  }
}
