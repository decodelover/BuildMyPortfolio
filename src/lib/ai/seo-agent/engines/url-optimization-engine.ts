import { UrlRules, SEOContext, PageMetadata } from "../types";
import { SeoSanitizer } from "../security/seo-sanitizer";

export class UrlOptimizationEngine {
  
  public static resolve(context: SEOContext, metadata: PageMetadata): UrlRules {
    const projects = context.normalizedData.projects || [];
    const domain = context.seoPreference.canonicalUrl || "https://buildmyportfolio.ai";
    const baseSlug = metadata.portfolioSlug;

    // Anchor sections list
    const sectionAnchors = [
      { sectionId: "hero", anchorId: "#hero" },
      { sectionId: "about", anchorId: "#about" },
      { sectionId: "projects", anchorId: "#projects" },
      { sectionId: "experience", anchorId: "#experience" },
      { sectionId: "skills", anchorId: "#skills" },
      { sectionId: "services", anchorId: "#services" },
      { sectionId: "testimonials", anchorId: "#testimonials" },
      { sectionId: "contact", anchorId: "#contact" }
    ];

    // Clean project paths slugs
    const projectPaths = projects.map((p) => {
      const pSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return {
        projectId: p.id,
        path: SeoSanitizer.sanitizeUrl(`/portfolio/${baseSlug}/project/${pSlug}`)
      };
    });

    // Custom blog routing teasers
    const blogPaths = [
      {
        postId: "career-journey",
        path: SeoSanitizer.sanitizeUrl(`/portfolio/${baseSlug}/blog/my-career-journey`)
      }
    ];

    // standard redirect strategies (e.g. from raw names back to clean canonical slug)
    const redirects = [
      {
        from: `/u/${context.userId}`,
        to: `/portfolio/${baseSlug}`,
        statusCode: 301 as const
      }
    ];

    return {
      portfolioSlug: baseSlug,
      canonicalPath: SeoSanitizer.sanitizeUrl(`${domain}/portfolio/${baseSlug}`),
      sectionAnchors,
      projectPaths,
      blogPaths,
      redirects,
      multilingual: {
        enabled: false,
        locales: ["en"],
        defaultLocale: "en"
      }
    };
  }
}
