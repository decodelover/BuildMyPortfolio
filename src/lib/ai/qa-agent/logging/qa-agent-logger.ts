import { StructuredLogger } from "../../orchestrator/logger";

export class QaAgentLogger extends StructuredLogger {
  constructor(jobId?: string) {
    super(jobId);
  }

  public pipelineStarted(): void {
    this.info("QA Pipeline validation started.", "qa");
  }

  public pipelineCompleted(metadata: Record<string, any>): void {
    this.info("QA Pipeline validation completed successfully.", "qa", metadata);
  }

  public pipelineFailed(error: Error): void {
    this.error(`QA Pipeline validation failed: ${error.message}`, "qa", { stack: error.stack });
  }

  public engineStarted(engineName: string): void {
    this.info(`Starting QA validation engine: ${engineName}`, "qa");
  }

  public engineCompleted(engineName: string, durationMs: number): void {
    this.info(`Completed QA validation engine: ${engineName}`, "qa", { durationMs });
  }

  public validationWarning(message: string, issues: string[]): void {
    this.warn(`QA validation warning: ${message}`, "qa", { issues });
  }

  public checkPassed(checkName: string): void {
    this.info(`QA Check passed: ${checkName}`, "qa");
  }

  public checkFailed(checkName: string, issues: string[]): void {
    this.warn(`QA Check failed: ${checkName}`, "qa", { issues });
  }
}
