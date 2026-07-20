import { CompilationContext, ResponsiveBlueprint } from "../types";
import { CompilationConfig } from "../config/compilation-config";

export class ResponsiveCompiler {
  public static compile(context: CompilationContext): ResponsiveBlueprint {
    const design = context.designBlueprint;
    const responsiveDesign = (design?.responsive || {}) as Record<string, any>;

    const breakpoints = CompilationConfig.defaultResponsive.breakpoints;
    const typographyScaling = CompilationConfig.defaultResponsive.typographyScaling;
    const sectionSpacingScaling = CompilationConfig.defaultResponsive.sectionSpacingScaling;

    const adaptiveLayouts = responsiveDesign.adaptiveLayouts && responsiveDesign.adaptiveLayouts.length > 0
      ? responsiveDesign.adaptiveLayouts.map((al: any) => ({
          breakpoint: al.breakpoint || "desktop",
          navigationBehavior: al.navigationBehavior || "standard-top-nav",
          gridBehavior: al.gridBehavior || "grid",
          sectionSpacingMultiplier: al.sectionSpacingMultiplier || 1.0
        }))
      : CompilationConfig.defaultResponsive.adaptiveLayouts;

    return {
      breakpoints,
      typographyScaling,
      sectionSpacingScaling,
      imageScalingStrategy: CompilationConfig.defaultResponsive.imageScalingStrategy,
      adaptiveLayouts
    };
  }
}
