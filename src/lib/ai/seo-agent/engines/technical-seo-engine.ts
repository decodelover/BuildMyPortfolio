import { TechnicalSeoRules, SEOContext } from "../types";

export class TechnicalSeoEngine {
  
  public static resolve(context: SEOContext): TechnicalSeoRules {
    const sitemapStructure = {
      priority: 0.9,
      changefreq: "weekly" as const,
      lastmod: new Date().toISOString().split("T")[0]
    };

    const robotsRules = {
      disallowPaths: ["/api/*", "/admin/*", "/_next/*"],
      allowPaths: ["/"]
    };

    const lazyLoadingStrategy = {
      images: "lazy" as const,
      scripts: "defer" as const
    };

    // Recommended assets and domains to preload/prefetch
    const preloadAssets = [
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
      "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap"
    ];

    const prefetchDomains = [
      "https://fonts.gstatic.com",
      "https://firebasestorage.googleapis.com",
      "https://cdnjs.cloudflare.com"
    ];

    return {
      sitemapStructure,
      robotsRules,
      lazyLoadingStrategy,
      assetOptimization: {
        fontDisplayRule: "swap",
        preloadAssets,
        prefetchDomains
      }
    };
  }
}
