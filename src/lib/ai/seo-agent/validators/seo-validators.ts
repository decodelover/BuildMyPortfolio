import { SEOBlueprint } from "../types";

export class SeoValidators {
  
  public static validateBlueprint(blueprint: SEOBlueprint): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 1. Verify basic page metadata is populated
    if (!blueprint.metadata) {
      errors.push("Page metadata structure is missing.");
    } else {
      if (!blueprint.metadata.metaTitle) {
        errors.push("Meta title tag is required.");
      }
      if (!blueprint.metadata.metaDescription) {
        errors.push("Meta description tag is required.");
      }
    }

    // 2. Validate structured data presence
    if (!blueprint.structuredData) {
      errors.push("JSON-LD structured data payload is missing.");
    } else {
      if (!blueprint.structuredData.person) {
        errors.push("Person structured schema is missing.");
      }
      if (!blueprint.structuredData.profilePage) {
        errors.push("ProfilePage structured schema is missing.");
      }
    }

    // 3. Check social previews
    if (!blueprint.social || !blueprint.social.openGraph) {
      errors.push("OpenGraph social meta sharing block is missing.");
    }

    // 4. Check url routing rules
    if (!blueprint.urlRules || !blueprint.urlRules.portfolioSlug) {
      errors.push("Portfolio URL slug details are missing.");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
