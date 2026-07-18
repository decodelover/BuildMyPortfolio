import { DesignContext, ProfessionCategory } from "../types";
import { DesignInputError } from "../errors/design-agent-errors";
import { DesignSanitizer } from "../security/design-sanitizer";
import { DesignAgentConfig } from "../config/design-agent-config";
import { DataNormalizer } from "../../content-agent/services/data-normalizer";

export interface InputProcessorParams {
  userId: string;
  builderId: string;
  planId: string;
  rawInput: Record<string, any>;
  contentBlocks?: any[];
}

export class DesignInputProcessor {
  
  public static process(params: InputProcessorParams): DesignContext {
    const { userId, builderId, planId, rawInput, contentBlocks = [] } = params;

    if (!rawInput) {
      throw new DesignInputError("Raw input data is missing or empty.");
    }

    const personal = rawInput.personalInfo || {};
    const preferences = rawInput.websitePreferences || {};
    
    // Normalize user's actual wizard inputs using standard Content Agent normalizer
    const normalizedData = DataNormalizer.normalize(rawInput);

    // Resolve profession category mappings
    const profession = personal.profession || "Expert";
    const professionCategory = DesignAgentConfig.getProfessionCategory(profession);

    const themePreference = preferences.theme || "modern";
    const colorPalettePreference = preferences.colorPalette || "";
    const fontPreference = preferences.fontFamily || "";
    const borderRadiusPreference = preferences.borderRadius || "";

    const context: DesignContext = {
      userId,
      builderId,
      planId,
      rawInput,
      normalizedData,
      contentBlocks,
      professionCategory,
      themePreference,
      colorPalettePreference,
      fontPreference,
      borderRadiusPreference
    };

    // Sanitize data using security layer checks
    return DesignSanitizer.sanitize(context);
  }
}
