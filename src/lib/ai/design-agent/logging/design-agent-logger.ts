import { StructuredLogger } from "../../orchestrator/logger";

export class DesignAgentLogger extends StructuredLogger {
  constructor(jobId?: string) {
    super(jobId);
  }

  public pipelineStarted(): void {
    this.info("Design Pipeline execution started.", "design");
  }

  public pipelineCompleted(metadata: Record<string, any>): void {
    this.info("Design Pipeline execution completed successfully.", "design", metadata);
  }

  public pipelineFailed(error: Error): void {
    this.error(`Design Pipeline execution failed: ${error.message}`, "design", { stack: error.stack });
  }

  public engineStarted(engineName: string): void {
    this.info(`Running layout decision logic: ${engineName}`, "design");
  }

  public engineCompleted(engineName: string, durationMs: number): void {
    this.info(`Completed layout decision logic: ${engineName}`, "design", { durationMs });
  }

  public validationWarning(message: string, issues: string[]): void {
    this.warn(`Design verification issues: ${message}`, "design", { issues });
  }
}
