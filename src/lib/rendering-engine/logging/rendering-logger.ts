import { StructuredLogger } from "../../ai/orchestrator/logger";

export class RenderingLogger extends StructuredLogger {
  constructor(jobId?: string) {
    super(jobId);
  }

  public renderStarted(blueprintId: string): void {
    this.info(`Portfolio rendering started for blueprint: '${blueprintId}'`);
  }

  public renderCompleted(blueprintId: string, durationMs: number, sectionsCount: number): void {
    this.info(`Portfolio rendering completed for '${blueprintId}' in ${durationMs}ms (${sectionsCount} sections rendered)`);
  }

  public renderFailed(blueprintId: string, error: Error): void {
    this.error(`Portfolio rendering failed for '${blueprintId}': ${error.message}`, undefined, { stack: error.stack });
  }

  public sectionRendered(sectionId: string, type: string, durationMs: number): void {
    this.debug(`Section rendered: '${sectionId}' [${type}] in ${durationMs}ms`);
  }
}
