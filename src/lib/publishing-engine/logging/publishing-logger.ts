import { StructuredLogger } from "../../ai/orchestrator/logger";

export class PublishingLogger extends StructuredLogger {
  constructor(jobId?: string) {
    super(jobId);
  }

  public publicationStarted(builderId: string, platform: string): void {
    this.info(`Publication flow started for builder '${builderId}' on platform '${platform}'`);
  }

  public deploymentCompleted(deploymentId: string, url: string, durationMs: number): void {
    this.info(`Deployment '${deploymentId}' published successfully to '${url}' in ${durationMs}ms`);
  }

  public publicationFailed(builderId: string, error: Error): void {
    this.error(`Publication flow failed for builder '${builderId}': ${error.message}`, undefined, { stack: error.stack });
  }

  public domainVerified(domain: string): void {
    this.info(`Custom domain verified successfully: '${domain}'`);
  }
}
