import { PageMetadata, SEOContext } from "../types";
import { SeoSanitizer } from "../security/seo-sanitizer";
import { SeoAgentConfig } from "../config/seo-agent-config";

export class MetadataEngine {
  
  public static resolve(context: SEOContext): PageMetadata {
    const personal = context.normalizedData.personal;
    const business = context.rawInput.businessIdentity || {};
    const seoPref = context.seoPreference;

    // 1. Compile Title
    const rawTitle = seoPref.metaTitle || 
      (business.websiteTitle ? business.websiteTitle : `${personal.fullName} - ${personal.profession} Portfolio`);
    
    // Clean and limit Title
    let metaTitle = SeoSanitizer.escapeMetadataString(rawTitle.trim());
    if (metaTitle.length > SeoAgentConfig.maxTitleLength) {
      metaTitle = metaTitle.substring(0, SeoAgentConfig.maxTitleLength - 3) + "...";
    }

    // 2. Compile Description
    const rawDesc = seoPref.metaDescription || 
      (personal.headline ? `${personal.headline}. Explore my projects, skills, and background.` : 
       `Explore the professional web developer portfolio of ${personal.fullName}. Specializing in ${personal.profession}.`);
    
    let metaDescription = SeoSanitizer.escapeMetadataString(rawDesc.trim());
    if (metaDescription.length > SeoAgentConfig.maxDescriptionLength) {
      metaDescription = metaDescription.substring(0, SeoAgentConfig.maxDescriptionLength - 3) + "...";
    }

    // 3. Compile Keywords
    const defaultKeywords = [
      personal.fullName,
      personal.profession,
      "developer portfolio",
      "portfolio site",
      "case studies"
    ];
    
    if (personal.fullName) {
      defaultKeywords.push(`${personal.fullName} projects`);
    }

    let customKeywordsList: string[] = [];
    if (seoPref.metaKeywords) {
      customKeywordsList = seoPref.metaKeywords.split(",").map((k) => k.trim().toLowerCase());
    }

    const merged = Array.from(new Set([...customKeywordsList, ...defaultKeywords.map(k => k.toLowerCase())]))
      .filter((k) => k.length > 0)
      .slice(0, SeoAgentConfig.maxKeywordsCount);

    const focusKeywords = merged.slice(0, 2);
    const secondaryKeywords = merged.slice(2);

    // 4. Slugs & Canonical URLs
    const portfolioSlug = seoPref.customSlug || 
      personal.fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const domain = seoPref.canonicalUrl || "https://buildmyportfolio.ai";
    const canonicalUrl = SeoSanitizer.sanitizeUrl(`${domain}/${portfolioSlug}`);

    // 5. Geographical Coordinates
    let geo: PageMetadata["geo"] = undefined;
    if (personal.location) {
      geo = {
        placename: SeoSanitizer.escapeMetadataString(personal.location),
        region: "US" // default country fallback
      };
    }

    return {
      metaTitle,
      metaDescription,
      focusKeywords,
      secondaryKeywords,
      canonicalUrl,
      portfolioSlug,
      robots: SeoAgentConfig.defaultRobotsPolicy,
      viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
      author: SeoSanitizer.escapeMetadataString(personal.fullName),
      publisher: "BuildMyPortfolio",
      language: "en",
      geo
    };
  }
}
