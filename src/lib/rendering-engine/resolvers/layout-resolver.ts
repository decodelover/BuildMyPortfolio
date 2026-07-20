import { RenderingConfig } from "../config/rendering-config";

export class LayoutResolver {
  public static resolveGridColumns(colsCount: number = 3): string {
    return RenderingConfig.defaultGridColumns[colsCount] || RenderingConfig.defaultGridColumns[3];
  }

  public static resolveContainerWidth(variant: string = "standard"): string {
    if (variant === "full") return "w-full px-4 sm:px-6 lg:px-8";
    if (variant === "narrow") return "max-w-4xl mx-auto px-4 sm:px-6";
    return "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
  }
}
