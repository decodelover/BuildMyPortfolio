import { CompiledSEOBlueprint } from "../../ai/compilation-engine/types";

export class MetadataRenderer {
  public static generateNextMetadata(seo: CompiledSEOBlueprint): Record<string, any> {
    return {
      title: seo.metaTitle || "Professional Portfolio",
      description: seo.metaDescription || "Official portfolio website.",
      keywords: seo.keywords || [],
      authors: [{ name: seo.author }],
      openGraph: {
        title: seo.socialSharing?.ogTitle || seo.metaTitle,
        description: seo.socialSharing?.ogDescription || seo.metaDescription,
        images: seo.socialSharing?.ogImage ? [{ url: seo.socialSharing.ogImage }] : []
      },
      twitter: {
        card: "summary_large_image",
        title: seo.metaTitle,
        description: seo.metaDescription
      },
      robots: {
        index: seo.robots?.index ?? true,
        follow: seo.robots?.follow ?? true
      }
    };
  }
}
