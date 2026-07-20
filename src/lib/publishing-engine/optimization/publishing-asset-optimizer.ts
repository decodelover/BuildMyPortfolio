import { PublishingConfig } from "../config/publishing-config";

export class PublishingAssetOptimizer {
  public static getCacheHeaders(isStaticAsset: boolean): Record<string, string> {
    return {
      "Cache-Control": isStaticAsset
        ? PublishingConfig.defaultCacheHeaders.staticAssets
        : PublishingConfig.defaultCacheHeaders.htmlPages
    };
  }
}
