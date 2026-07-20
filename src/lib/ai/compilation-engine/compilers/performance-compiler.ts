import { CompilationContext, PerformanceBlueprint, AssetRef, BlueprintNode } from "../types";
import { CompilationConfig } from "../config/compilation-config";

export class PerformanceCompiler {
  public static compile(
    context: CompilationContext,
    sections: BlueprintNode[],
    assets: AssetRef[]
  ): PerformanceBlueprint {
    const seoTech = context.seoBlueprint?.technicalRules;

    const lazyLoadEnabled = seoTech?.lazyLoadingStrategy?.images ? seoTech.lazyLoadingStrategy.images === "lazy" : CompilationConfig.defaultPerformance.lazyLoadEnabled;

    const fontDisplayRule = seoTech?.assetOptimization?.fontDisplayRule || CompilationConfig.defaultPerformance.fontDisplayRule;

    const preloadAssets = seoTech?.assetOptimization?.preloadAssets || assets.slice(0, 2).map((a) => a.url);

    const prefetchDomains = seoTech?.assetOptimization?.prefetchDomains || CompilationConfig.defaultPerformance.prefetchDomains;

    // Estimate bundle size based on section count and asset count
    const estimatedBundleSizeKb = sections.length * 15 + assets.length * 5 + 120;

    return {
      lazyLoadEnabled,
      fontDisplayRule,
      codeSplittingEnabled: CompilationConfig.defaultPerformance.codeSplittingEnabled,
      preloadAssets,
      prefetchDomains,
      sectionCount: sections.length,
      assetCount: assets.length,
      estimatedBundleSizeKb,
      imageOptimizationEnabled: CompilationConfig.defaultPerformance.imageOptimizationEnabled,
      scriptLoadingStrategy: CompilationConfig.defaultPerformance.scriptLoadingStrategy
    };
  }
}
