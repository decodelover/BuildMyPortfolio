import { StructuredLogger } from "../../orchestrator/logger";

export class SEOAgentLogger extends StructuredLogger {
  constructor(jobId?: string) {
    super(jobId);
  }

  public pipelineStarted(): void {
    this.info("SEO Pipeline execution started.", "seo");
  }

  public pipelineCompleted(metadata: Record<string, any>): void {
    this.info("SEO Pipeline execution completed successfully.", "seo", metadata);
  }

  public pipelineFailed(error: Error): void {
    this.error(`SEO Pipeline execution failed: ${error.message}`, "seo", { stack: error.stack });
  }

  public engineCompleted(engineName: string, durationMs: number): void {
    this.info(`Completed SEO logic engine: ${engineName}`, "seo", { durationMs });
  }

  public validationWarning(message: string, issues: string[]): void {
    this.warn(`SEO verification warning: ${message}`, "seo", { issues });
  }
}
