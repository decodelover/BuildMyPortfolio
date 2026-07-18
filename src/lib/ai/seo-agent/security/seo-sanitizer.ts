import { SEOContext } from "../types";
import { SeoSecurityError } from "../errors/seo-agent-errors";

export class SeoSanitizer {
  
  public static sanitize(context: SEOContext): SEOContext {
    const copy = { ...context };

    // Prevent prompt injection or malicious scripts in custom settings
    const checkScript = (val?: string) => {
      if (val && /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(val)) {
        throw new SeoSecurityError("Malicious script tags detected inside SEO parameters.");
      }
    };

    checkScript(copy.seoPreference.metaTitle);
    checkScript(copy.seoPreference.metaDescription);
    checkScript(copy.seoPreference.metaKeywords);
    checkScript(copy.seoPreference.canonicalUrl);
    checkScript(copy.seoPreference.customSlug);

    return copy;
  }

  public static sanitizeUrl(url?: string): string {
    if (!url) return "";
    
    // Strict URL validation
    const trimmed = url.trim();
    if (/^(javascript|data|vbscript):/i.test(trimmed)) {
      throw new SeoSecurityError(`Dangerous protocol detected in URL: ${trimmed}`);
    }

    try {
      new URL(trimmed); // verify basic absolute shape if possible
    } catch {
      // If it's a relative path it will fail URL constructor, which is fine, but check for double slashes/host issues
      if (trimmed.startsWith("//") || trimmed.includes("<") || trimmed.includes(">")) {
        throw new SeoSecurityError(`Malformed relative path URL: ${trimmed}`);
      }
    }

    return trimmed;
  }

  public static escapeMetadataString(str?: string): string {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  }

  public static preventJsonLdInjection(obj: Record<string, any>): Record<string, any> {
    const serialized = JSON.stringify(obj);
    if (serialized.includes("<script") || serialized.includes("</script>")) {
      throw new SeoSecurityError("Malicious script tag detected in JSON-LD structured data payload.");
    }
    return obj;
  }
}
