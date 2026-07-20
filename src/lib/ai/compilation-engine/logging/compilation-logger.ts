import { StructuredLogger } from "../../orchestrator/logger";

export class CompilationLogger extends StructuredLogger {
  constructor(jobId?: string) {
    super(jobId);
  }

  public pipelineStarted(): void {
    this.info("Portfolio Compilation pipeline started.", "compiler");
  }

  public pipelineCompleted(metadata: Record<string, any>): void {
    this.info("Portfolio Compilation pipeline completed successfully.", "compiler", metadata);
  }

  public pipelineFailed(error: Error): void {
    this.error(`Portfolio Compilation pipeline failed: ${error.message}`, "compiler", { stack: error.stack });
  }

  public stageStarted(stageName: string): void {
    this.info(`Starting compilation stage: ${stageName}`, "compiler");
  }

  public stageCompleted(stageName: string, durationMs: number): void {
    this.info(`Completed compilation stage: ${stageName}`, "compiler", { durationMs });
  }

  public dependencyResolved(source: string, target: string, message: string): void {
    this.info(`Dependency resolved successfully: '${source}' -> '${target}'. Details: ${message}`, "compiler");
  }

  public conflictResolved(field: string, resolution: string): void {
    this.warn(`Conflict resolved for field '${field}'. Strategy: ${resolution}`, "compiler");
  }

  public assetCompiled(assetId: string, type: string): void {
    this.info(`Asset compiled successfully: '${assetId}' (Type: ${type})`, "compiler");
  }

  public sectionCompiled(sectionId: string, type: string, durationMs: number): void {
    this.info(`Section compiled: '${sectionId}' [${type}] in ${durationMs}ms`, "compiler");
  }

  public snapshotCreated(snapshotId: string): void {
    this.info(`Pre-compilation snapshot created: '${snapshotId}'`, "compiler");
  }

  public versionCreated(versionId: string, revision: number): void {
    this.info(`Blueprint version created: '${versionId}' (Revision: ${revision})`, "compiler");
  }

  public performanceMetric(stageName: string, durationMs: number, memoryEstimateMb: number): void {
    this.info(`Performance Metric [${stageName}]: Duration=${durationMs}ms, MemoryEst=${memoryEstimateMb.toFixed(2)}MB`, "compiler");
  }

  public blueprintCompleted(blueprintId: string, metrics: Record<string, any>): void {
    this.info(`Blueprint compilation finalized: '${blueprintId}'`, "compiler", metrics);
  }
}
