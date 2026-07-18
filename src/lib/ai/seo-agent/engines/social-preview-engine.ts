import { SocialMetadata, SEOContext, PageMetadata } from "../types";
import { SeoSanitizer } from "../security/seo-sanitizer";

export class SocialPreviewEngine {
  
  public static resolve(context: SEOContext, metadata: PageMetadata): SocialMetadata {
    const personal = context.normalizedData.personal;
    const domain = context.seoPreference.canonicalUrl || "https://buildmyportfolio.ai";
    const customImage = personal.avatarUrl || `${domain}/images/og-default.png`;

    const title = SeoSanitizer.escapeMetadataString(metadata.metaTitle);
    const description = SeoSanitizer.escapeMetadataString(metadata.metaDescription);
    const url = SeoSanitizer.sanitizeUrl(metadata.canonicalUrl);
    const image = SeoSanitizer.sanitizeUrl(customImage);

    return {
      openGraph: {
        title,
        description,
        url,
        type: "profile",
        siteName: `${personal.fullName} Portfolio`,
        image,
        imageWidth: 1200,
        imageHeight: 630,
        imageAlt: `${personal.fullName} professional resume showcase`,
        locale: "en_US"
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        image,
        creator: `@${personal.fullName.replace(/\s+/g, "").toLowerCase()}`,
        site: "@BuildMyPortfolio"
      },
      linkedin: {
        title,
        description,
        image
      },
      discord: {
        title,
        description,
        image,
        colorHex: "#6366f1"
      },
      whatsapp: {
        title,
        description,
        image
      },
      telegram: {
        title,
        description,
        image
      }
    };
  }
}
