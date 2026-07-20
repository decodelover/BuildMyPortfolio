import { AssetRef } from "../../ai/compilation-engine/types";

export class AssetRenderer {
  public static resolveAssetUrl(assets: AssetRef[], type: string, fallbackUrl: string = ""): string {
    const match = assets.find((a) => a.type === type);
    return match ? match.url : fallbackUrl;
  }
}
