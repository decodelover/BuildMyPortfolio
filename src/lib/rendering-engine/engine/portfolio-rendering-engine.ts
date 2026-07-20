import { RenderReport, RenderContext } from "../types";
import { BlueprintParser } from "../parser/blueprint-parser";
import { RenderingValidators } from "../validators/rendering-validators";
import { RenderCache } from "../cache/render-cache";
import { PerformanceOptimizer } from "../optimizer/performance-optimizer";
import { RenderingLogger } from "../logging/rendering-logger";
import { RenderingError } from "../errors/rendering-errors";

export class PortfolioRenderingEngine {
  public static prepareRenderContext(blueprintInput: any): RenderReport {
    const startTime = Date.now();
    const blueprintId = blueprintInput?.blueprintId || blueprintInput?.manifestId || `bp-${Date.now()}`;
    const logger = new RenderingLogger(blueprintId);
    logger.renderStarted(blueprintId);

    const warnings: string[] = [];
    const errors: string[] = [];

    // Check cache
    const cachedContext = RenderCache.get(blueprintId);
    if (cachedContext) {
      const durationMs = Date.now() - startTime;
      logger.renderCompleted(blueprintId, durationMs, cachedContext.sections.length);
      return {
        renderId: cachedContext.renderId,
        success: true,
        context: cachedContext,
        metrics: PerformanceOptimizer.calculateMetrics(cachedContext, durationMs, 1),
        warnings,
        errors,
        renderedAt: new Date().toISOString()
      };
    }

    try {
      const parseStart = Date.now();
      const context = BlueprintParser.parse(blueprintInput);
      const parseDuration = Date.now() - parseStart;

      // Validate context
      const validation = RenderingValidators.validateRenderContext(context);
      if (!validation.isValid) {
        errors.push(...validation.errors);
        throw new RenderingError(`RenderContext validation failed: ${errors.join("; ")}`);
      }

      // Cache context
      RenderCache.set(blueprintId, context);

      const totalDurationMs = Date.now() - startTime;
      const metrics = PerformanceOptimizer.calculateMetrics(context, totalDurationMs, parseDuration);

      logger.renderCompleted(blueprintId, totalDurationMs, context.sections.length);

      return {
        renderId: context.renderId,
        success: true,
        context,
        metrics,
        warnings,
        errors,
        renderedAt: new Date().toISOString()
      };

    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      const errorMsg = err.message || String(err);
      errors.push(errorMsg);
      logger.renderFailed(blueprintId, err);

      return {
        renderId: `rnd-err-${Date.now()}`,
        success: false,
        context: null,
        metrics: {
          totalDurationMs: durationMs,
          blueprintParsingTimeMs: 0,
          sectionsCount: 0,
          assetsCount: 0,
          estimatedDOMNodes: 0,
          memoryEstimateMb: 0
        },
        warnings,
        errors,
        renderedAt: new Date().toISOString()
      };
    }
  }
}
