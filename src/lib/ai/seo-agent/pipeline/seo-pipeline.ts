import { SEOBlueprint, SeoPipelineStatus } from "../types";
import { SeoInputProcessor } from "../services/seo-input-processor";
import { MetadataEngine } from "../engines/metadata-engine";
import { StructuredDataEngine } from "../engines/structured-data-engine";
import { SocialPreviewEngine } from "../engines/social-preview-engine";
import { UrlOptimizationEngine } from "../engines/url-optimization-engine";
import { ContentSeoAnalyzer } from "../engines/content-seo-analyzer";
import { TechnicalSeoEngine } from "../engines/technical-seo-engine";
import { AccessibilitySeoEngine } from "../engines/accessibility-seo-engine";
import { ScoringEngine } from "../engines/scoring-engine";
import { SeoValidators } from "../validators/seo-validators";
import { SEOAgentLogger } from "../logging/seo-agent-logger";
import { SeoPipelineError } from "../errors/seo-agent-errors";

export interface SeoPipelineCallbacks {
  onStatusChange?: (status: SeoPipelineStatus) => void;
  onProgress?: (progress: number) => void;
}

export class SeoPipeline {
  private logger = new SEOAgentLogger();

  public async run(
    userId: string,
    builderId: string,
    planId: string,
    rawInput: Record<string, any>,
    contentBlocks: any[] = [],
    designBlueprint?: any,
    callbacks?: SeoPipelineCallbacks
  ): Promise<SEOBlueprint> {
    const totalStartTime = Date.now();
    this.logger.pipelineStarted();
    callbacks?.onStatusChange?.("processing_input");
    callbacks?.onProgress?.(10);

    try {
      // 1. Normalize Inputs
      const context = SeoInputProcessor.process({
        userId,
        builderId,
        planId,
        rawInput,
        contentBlocks,
        designBlueprint
      });
      this.logger.info(`Context normalized successfully. User: ${userId}`);

      // 2. Generate Page Metadata
      callbacks?.onStatusChange?.("compiling_metadata");
      callbacks?.onProgress?.(25);
      const metaStartTime = Date.now();
      const metadata = MetadataEngine.resolve(context);
      this.logger.engineCompleted("MetadataEngine", Date.now() - metaStartTime);

      // 3. Generate Structured Data
      callbacks?.onStatusChange?.("compiling_schemas");
      callbacks?.onProgress?.(40);
      const schemaStartTime = Date.now();
      const structuredData = StructuredDataEngine.resolve(context);
      this.logger.engineCompleted("StructuredDataEngine", Date.now() - schemaStartTime);

      // 4. Generate Social Preview Meta Tags
      callbacks?.onStatusChange?.("compiling_social");
      callbacks?.onProgress?.(55);
      const socialStartTime = Date.now();
      const social = SocialPreviewEngine.resolve(context, metadata);
      this.logger.engineCompleted("SocialPreviewEngine", Date.now() - socialStartTime);

      // 5. Generate URL Optimization Rules
      callbacks?.onStatusChange?.("compiling_urls");
      callbacks?.onProgress?.(65);
      const urlRules = UrlOptimizationEngine.resolve(context, metadata);

      // 6. Analyze Content SEO
      callbacks?.onStatusChange?.("analyzing_content");
      callbacks?.onProgress?.(75);
      const contentAnalysis = ContentSeoAnalyzer.resolve(context, metadata);

      // 7. Resolve Technical Rules
      callbacks?.onStatusChange?.("compiling_technical");
      callbacks?.onProgress?.(85);
      const technicalRules = TechnicalSeoEngine.resolve(context);

      // 8. Resolve Accessibility Rules
      callbacks?.onStatusChange?.("compiling_accessibility");
      callbacks?.onProgress?.(90);
      const accessibility = AccessibilitySeoEngine.resolve(context);

      // 9. Scoring Compilation
      callbacks?.onStatusChange?.("scoring");
      const scores = ScoringEngine.calculate(context, metadata, contentAnalysis, accessibility);

      // 10. Assemble and Validate Blueprint
      const blueprintId = `bp-seo-${Date.now()}`;
      const blueprint: SEOBlueprint = {
        blueprintId,
        userId,
        builderId,
        planId,
        metadata,
        structuredData,
        social,
        urlRules,
        contentAnalysis,
        technicalRules,
        accessibility,
        scores,
        version: "1.0.0",
        timestamp: new Date().toISOString()
      };

      const validation = SeoValidators.validateBlueprint(blueprint);
      if (!validation.isValid) {
        this.logger.validationWarning("SEO blueprint validation failed", validation.errors);
        throw new SeoPipelineError(`SEO validation failed: ${validation.errors.join(", ")}`);
      }

      callbacks?.onStatusChange?.("completed");
      callbacks?.onProgress?.(100);

      const totalDuration = Date.now() - totalStartTime;
      this.logger.pipelineCompleted({ blueprintId, totalDurationMs: totalDuration });

      return blueprint;
    } catch (err: any) {
      callbacks?.onStatusChange?.("failed");
      this.logger.pipelineFailed(err);
      throw err;
    }
  }
}
