import { CompilationContext, CompiledSEOBlueprint, ConflictResolution } from "../types";

export class SEOCompiler {
  public static compile(
    context: CompilationContext,
    resolutions: ConflictResolution[]
  ): CompiledSEOBlueprint {
    const seo = context.seoBlueprint;
    const normalized = context.normalizedData;
    const rawInput = context.rawInput || {};

    // Check conflict resolutions for SEO overrides
    const titleRes = resolutions.find((r) => r.field === "seo.metaTitle");
    const descRes = resolutions.find((r) => r.field === "seo.metaDescription");

    const metaTitle = titleRes
      ? String(titleRes.resolvedValue)
      : seo?.metadata?.metaTitle || `${normalized.personal?.fullName || "Professional"} - ${normalized.personal?.profession || "Portfolio"}`;

    const metaDescription = descRes
      ? String(descRes.resolvedValue)
      : seo?.metadata?.metaDescription || normalized.personal?.headline || "Official professional portfolio showcasing projects, experience, skills, and background.";

    const keywords = seo?.metadata?.focusKeywords && seo.metadata.focusKeywords.length > 0
      ? seo.metadata.focusKeywords
      : [
          normalized.personal?.profession || "Software Engineer",
          "Portfolio",
          "Developer",
          "Projects",
          "Skills"
        ];

    const canonicalUrl = seo?.metadata?.canonicalUrl || rawInput.canonicalUrl || "";

    const structuredData = seo?.structuredData || {
      "@context": "https://schema.org",
      "@type": "Person",
      name: normalized.personal?.fullName || "",
      jobTitle: normalized.personal?.profession || "",
      email: normalized.personal?.email || "",
      url: canonicalUrl
    };

    const socialSharing = {
      ogTitle: metaTitle,
      ogDescription: metaDescription,
      ogImage: normalized.personal?.avatarUrl || "",
      ogType: "profile",
      twitterCard: "summary_large_image"
    };

    return {
      metaTitle,
      metaDescription,
      keywords,
      canonicalUrl,
      structuredData,
      socialSharing,
      robots: {
        index: seo?.metadata?.robots?.index ?? true,
        follow: seo?.metadata?.robots?.follow ?? true
      },
      language: seo?.metadata?.language || "en",
      author: normalized.personal?.fullName || "Portfolio Owner"
    };
  }
}
