import { PortfolioBlueprint } from "../types";
import { CompilationSecurityError } from "../errors/compilation-errors";

export class CompilationSanitizer {
  private static readonly dangerousProtocols = /^(javascript|data|vbscript|file):/i;

  public static sanitize(blueprint: PortfolioBlueprint): PortfolioBlueprint {
    const copy = JSON.parse(JSON.stringify(blueprint)) as PortfolioBlueprint;
    let scriptInjections = 0;
    let urlViolations = 0;

    // 1. Sanitize asset URLs
    copy.assets.forEach((asset) => {
      if (this.dangerousProtocols.test(asset.url.trim())) {
        urlViolations++;
        throw new CompilationSecurityError(`Unsafe asset URL scheme detected: ${asset.url}`);
      }
    });

    // 2. Sanitize navigation paths
    copy.navigation.routes.forEach((route) => {
      const path = route.path.trim();
      if (this.dangerousProtocols.test(path) || path.includes("<") || path.includes(">")) {
        urlViolations++;
        throw new CompilationSecurityError(`Unsafe route path configuration: ${path}`);
      }
    });

    // 3. Scan sections content for any XSS patterns
    copy.sections.forEach((section) => {
      const inspectText = (val: any, path: string) => {
        if (typeof val === "string") {
          if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(val)) {
            scriptInjections++;
            throw new CompilationSecurityError(`Malicious script tag injection detected in compiled section '${section.id}': ${path}`);
          }
          if (/\bon\w+\s*=/i.test(val)) {
            scriptInjections++;
            throw new CompilationSecurityError(`Active event handler injection detected in compiled section '${section.id}': ${path}`);
          }
        } else if (val && typeof val === "object") {
          for (const key of Object.keys(val)) {
            inspectText(val[key], `${path}.${key}`);
          }
        }
      };

      inspectText(section.content, "content");
    });

    // 4. Set security metadata
    copy.security = {
      sanitized: true,
      scriptInjectionCount: scriptInjections,
      urlViolationsCount: urlViolations,
      metadataIntegrityHash: this.generateIntegrityHash(copy),
      allowedProtocols: ["https:", "http:", "mailto:", "tel:"],
      contentSecurityHints: [
        "default-src 'self'",
        "img-src 'self' https: data:",
        "font-src 'self' https://fonts.gstatic.com"
      ]
    };

    return copy;
  }

  private static generateIntegrityHash(blueprint: PortfolioBlueprint): string {
    const raw = `${blueprint.blueprintId}:${blueprint.version}:${blueprint.userId}:${blueprint.sections.length}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `hash-${Math.abs(hash).toString(16)}`;
  }
}
