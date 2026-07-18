import { SEOContext } from "../types";
import { SeoInputError } from "../errors/seo-agent-errors";
import { SeoSanitizer } from "../security/seo-sanitizer";
import { DataNormalizer } from "../../content-agent/services/data-normalizer";

export interface InputProcessorParams {
  userId: string;
  builderId: string;
  planId: string;
  rawInput: Record<string, any>;
  contentBlocks?: any[];
  designBlueprint?: any;
}

export class SeoInputProcessor {
  
  public static process(params: InputProcessorParams): SEOContext {
    const { userId, builderId, planId, rawInput, contentBlocks = [], designBlueprint } = params;

    if (!rawInput) {
      throw new SeoInputError("Input data for portfolio builder is missing.");
    }

    const personal = rawInput.personalInfo || {};
    const seoInfo = rawInput.seoInfo || {};
    const preferences = rawInput.websitePreferences || {};

    // Standard normalization parsing
    const normalizedData = DataNormalizer.normalize(rawInput);

    const seoPreference = {
      metaTitle: seoInfo.metaTitle || personal.fullName || undefined,
      metaDescription: seoInfo.metaDescription || undefined,
      metaKeywords: seoInfo.metaKeywords || undefined,
      canonicalUrl: preferences.domainUrl || undefined,
      customSlug: preferences.slug || undefined
    };

    const context: SEOContext = {
      userId,
      builderId,
      planId,
      rawInput,
      normalizedData,
      contentBlocks,
      designBlueprint,
      seoPreference
    };

    // Apply security sanitizer filters
    return SeoSanitizer.sanitize(context);
  }
}
