import { CompilationContext, AssetRef, AssetType } from "../types";
import { CompilationConfig } from "../config/compilation-config";
import { AssetCompilationError } from "../errors/compilation-errors";

export class AssetCompiler {
  private static dangerousProtocols = /^(javascript|data|vbscript|file):/i;

  public static compile(context: CompilationContext): AssetRef[] {
    const assets: AssetRef[] = [];
    const normalized = context.normalizedData;
    const rawInput = context.rawInput || {};
    const seenUrls = new Set<string>();

    const addAsset = (
      type: AssetType,
      url: string,
      alt: string,
      sourceSectionId?: string,
      formatPref: string = "webp"
    ) => {
      if (!url || typeof url !== "string") return;
      const cleanUrl = url.trim();
      if (!cleanUrl || seenUrls.has(cleanUrl)) return;

      if (this.dangerousProtocols.test(cleanUrl)) {
        throw new AssetCompilationError(`Dangerous asset URL scheme detected during compilation: ${cleanUrl}`);
      }

      seenUrls.add(cleanUrl);
      const assetId = `asset-${type}-${assets.length + 1}`;

      assets.push({
        assetId,
        type,
        url: cleanUrl,
        alt: alt || `${type} asset`,
        optimizationHints: {
          lazyLoad: type !== "logo",
          formatPreference: formatPref,
          maxSizeKb: type === "image" ? 500 : 2000
        },
        sourceSectionId,
        deduplicationKey: cleanUrl
      });
    };

    // 1. Profile Avatar
    if (normalized.personal?.avatarUrl) {
      addAsset("image", normalized.personal.avatarUrl, `${normalized.personal.fullName || "User"} Profile Photo`, "sec-hero", "webp");
    }

    // 2. Project Images
    if (normalized.projects && normalized.projects.length > 0) {
      normalized.projects.forEach((proj, idx) => {
        if (proj.imageUrl) {
          addAsset("image", proj.imageUrl, `${proj.title || "Project"} Screenshot`, "sec-projects", "webp");
        }
      });
    }

    // 3. Testimonial Avatars
    if (normalized.testimonials && normalized.testimonials.length > 0) {
      normalized.testimonials.forEach((t, idx) => {
        if (t.avatarUrl) {
          addAsset("image", t.avatarUrl, `${t.clientName || "Client"} Avatar`, "sec-testimonials", "webp");
        }
      });
    }

    // 4. Resume Document
    if (rawInput.resumeUrl) {
      addAsset("resume", rawInput.resumeUrl, "Professional Resume Document", "sec-resume", "pdf");
    }

    // 5. Logo / Brand image
    if (rawInput.logoUrl) {
      addAsset("logo", rawInput.logoUrl, "Brand Logo", "sec-navigation", "svg");
    }

    // Check maximum asset count limit
    if (assets.length > CompilationConfig.maxAssetsCount) {
      assets.splice(CompilationConfig.maxAssetsCount);
    }

    return assets;
  }
}
