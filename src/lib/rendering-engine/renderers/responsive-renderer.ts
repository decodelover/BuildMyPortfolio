import { ResponsiveClassesConfig } from "../types";
import { LayoutResolver } from "../resolvers/layout-resolver";

export class ResponsiveRenderer {
  public static computeResponsiveClasses(styles?: Record<string, any>): ResponsiveClassesConfig {
    const cols = styles?.gridColumns?.desktop || 3;
    const variant = styles?.layoutVariant || "standard";

    return {
      containerWidthClass: LayoutResolver.resolveContainerWidth(variant),
      sectionPaddingClass: "py-16 lg:py-24",
      gridColumnsClass: LayoutResolver.resolveGridColumns(cols),
      gridGapClass: "gap-8"
    };
  }
}
