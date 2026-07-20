import {
  CompilationContext,
  CompilationResult,
  CompilationPipelineStatus,
  CompilationStageMetric,
  CompilationProgressCallback
} from "../types";
import { CompilationInputProcessor, CompilationInputProcessorParams } from "../services/compilation-input-processor";
import { DependencyResolver } from "../resolvers/dependency-resolver";
import { ConflictResolver } from "../resolvers/conflict-resolver";
import { SnapshotManager } from "../services/snapshot-manager";
import { BlueprintBuilder } from "../services/blueprint-builder";
import { CompilationSanitizer } from "../security/compilation-sanitizer";
import { CompilationValidators } from "../validators/compilation-validators";
import { VersionManager } from "../services/version-manager";
import { CompilationLogger } from "../logging/compilation-logger";
import { CompilationPipelineError } from "../errors/compilation-errors";

export class CompilationPipeline {
  public static async execute(
    params: CompilationInputProcessorParams,
    onProgress?: CompilationProgressCallback
  ): Promise<CompilationResult> {
    const logger = new CompilationLogger(params.builderId);
    logger.pipelineStarted();

    const stageMetrics: CompilationStageMetric[] = [];
    const warnings: string[] = [];
    let currentStatus: CompilationPipelineStatus = "idle";

    const reportProgress = (status: CompilationPipelineStatus, progress: number, stageName: string, message: string) => {
      currentStatus = status;
      if (onProgress) {
        onProgress({ status, progress, stageName, message });
      }
    };

    const recordStage = async <T>(stageName: string, status: CompilationPipelineStatus, progress: number, fn: () => T | Promise<T>): Promise<T> => {
      reportProgress(status, progress, stageName, `Executing ${stageName}...`);
      logger.stageStarted(stageName);
      const startMs = Date.now();
      const startedAt = new Date().toISOString();

      try {
        const result = await fn();
        const durationMs = Date.now() - startMs;
        const completedAt = new Date().toISOString();
        stageMetrics.push({ stageName, durationMs, startedAt, completedAt });
        logger.stageCompleted(stageName, durationMs);
        return result;
      } catch (err: any) {
        logger.pipelineFailed(err);
        throw new CompilationPipelineError(`Compilation failed during stage '${stageName}': ${err.message}`, { stageName, cause: err });
      }
    };

    try {
      // 1. Process Input
      const context: CompilationContext = await recordStage("Input Processing", "processing_input", 5, () => {
        return CompilationInputProcessor.process(params);
      });

      // 2. Resolve Dependencies
      const depResult = await recordStage("Dependency Resolution", "resolving_dependencies", 15, () => {
        const res = DependencyResolver.resolve(context);
        if (res.warnings) warnings.push(...res.warnings);
        return res;
      });

      // 3. Resolve Conflicts
      const conflictResult = await recordStage("Conflict Resolution", "resolving_conflicts", 25, () => {
        const res = ConflictResolver.resolve(context);
        if (res.warnings) warnings.push(...res.warnings);
        res.resolutions.forEach((r) => logger.conflictResolved(r.field, r.resolutionStrategy));
        return res;
      });

      // 4. Create Pre-Compilation Snapshot
      const snapshot = await recordStage("Snapshot Creation", "creating_snapshot", 35, () => {
        const snap = SnapshotManager.createSnapshot(context, "pre-compilation");
        logger.snapshotCreated(snap.snapshotId);
        return snap;
      });

      // 5-15. Build Unified Portfolio Blueprint (includes Theme, Component, Asset, Section, Nav, SEO, Acc, Anim, Resp, Perf compilers)
      const rawBlueprint = await recordStage("Blueprint Assembly", "building_blueprint", 65, () => {
        return BlueprintBuilder.build({
          context,
          resolutions: conflictResult.resolutions,
          stageMetrics,
          warnings,
          totalErrorsResolved: depResult.issues.length,
          dependenciesCount: depResult.issues.length
        });
      });

      // 16. Security Sanitization Pass
      const sanitizedBlueprint = await recordStage("Security Sanitization", "sanitizing", 80, () => {
        const clean = CompilationSanitizer.sanitize(rawBlueprint);
        clean.security.sanitized = true;
        return clean;
      });

      // 17. Blueprint Integrity Validation
      await recordStage("Blueprint Validation", "validating_blueprint", 90, () => {
        const val = CompilationValidators.validateBlueprint(sanitizedBlueprint);
        if (!val.isValid) {
          throw new CompilationPipelineError(`Final blueprint validation failed: ${val.errors.join("; ")}`);
        }
        return val;
      });

      // 18. Versioning
      const versionRecord = await recordStage("Versioning & Snapshot", "versioning", 98, () => {
        const ver = VersionManager.createVersion(sanitizedBlueprint, snapshot);
        logger.versionCreated(ver.versionId, ver.revision);
        return ver;
      });

      reportProgress("completed", 100, "Pipeline Completed", "Portfolio compilation completed successfully.");
      logger.pipelineCompleted({ blueprintId: sanitizedBlueprint.blueprintId, version: versionRecord.versionId });

      return {
        success: true,
        blueprint: sanitizedBlueprint,
        version: versionRecord,
        errors: [],
        warnings,
        metrics: sanitizedBlueprint.compilationMetrics
      };

    } catch (err: any) {
      reportProgress("failed", 100, "Pipeline Failed", err.message || "Compilation pipeline error.");
      return {
        success: false,
        blueprint: null,
        version: null,
        errors: [err.message || String(err)],
        warnings,
        metrics: {
          totalDurationMs: stageMetrics.reduce((s, m) => s + m.durationMs, 0),
          stageTimings: stageMetrics,
          totalErrorsResolved: 0,
          totalWarnings: warnings.length,
          warningsList: warnings,
          dependenciesResolved: 0,
          conflictsResolved: 0,
          sectionsCompiled: 0,
          assetsCompiled: 0,
          estimatedMemoryMb: 0
        }
      };
    }
  }
}
