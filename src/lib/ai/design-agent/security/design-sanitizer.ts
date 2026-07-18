import { DesignContext } from "../types";
import { DesignSecurityError } from "../errors/design-agent-errors";

const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export class DesignSanitizer {
  
  public static sanitize(context: DesignContext): DesignContext {
    // Prevent prototype pollution or malicious config inputs
    const copy = { ...context };
    
    // Validate string inputs to verify they don't contain common script tags
    const containsScriptTag = (str: string) => /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(str);
    
    if (
      containsScriptTag(copy.themePreference) ||
      containsScriptTag(copy.colorPalettePreference || "") ||
      containsScriptTag(copy.fontPreference || "") ||
      containsScriptTag(copy.borderRadiusPreference || "")
    ) {
      throw new DesignSecurityError("Malicious script tags detected inside design preferences.");
    }

    return copy;
  }

  public static validateColor(hex: string, fieldName: string): void {
    if (!HEX_COLOR_REGEX.test(hex)) {
      throw new DesignSecurityError(`Invalid color format detected on token ${fieldName}: ${hex}`);
    }
  }

  public static validateSpacingToken(token: string, fieldName: string): void {
    // Sanity limit: keep styling tokens small to avoid overflow injection attacks (e.g. padding: 9999px)
    if (token.length > 50 || /javascript:/gi.test(token)) {
      throw new DesignSecurityError(`Dangerous layout styling token on field ${fieldName}: ${token}`);
    }
  }
}
