import { RenderContext, RenderPerformanceMetrics } from "../types";

export class PerformanceOptimizer {
  public static calculateMetrics(
    context: RenderContext,
    totalDurationMs: number,
    parsingTimeMs: number
  ): RenderPerformanceMetrics {
    const sectionsCount = context.sections.length;
    const assetsCount = context.assets.length;
    const estimatedDOMNodes = sectionsCount * 35 + assetsCount * 4 + 150;
    const memoryEstimateMb = Math.round((JSON.stringify(context).length / (1024 * 1024)) * 100) / 100;

    return {
      totalDurationMs,
      blueprintParsingTimeMs: parsingTimeMs,
      sectionsCount,
      assetsCount,
      estimatedDOMNodes,
      memoryEstimateMb
    };
  }
}
