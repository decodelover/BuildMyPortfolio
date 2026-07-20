import {
  PublicationReport,
  DeploymentRecord,
  ReleaseVersion,
  SEOAssetsReport
} from "../types";
import { PublishingSecurity } from "../security/publishing-security";

export class PublicationReporter {
  public static generateReport(
    builderId: string,
    userId: string,
    deployment: DeploymentRecord,
    release: ReleaseVersion,
    sitemapUrl: string,
    robotsTxtUrl: string,
    durationMs: number,
    warnings: string[] = [],
    errors: string[] = []
  ): PublicationReport {
    const seoAssets: SEOAssetsReport = {
      sitemapGenerated: true,
      sitemapUrl,
      robotsTxtGenerated: true,
      robotsTxtUrl,
      canonicalUrl: deployment.url
    };

    const security = PublishingSecurity.computeSecurityReport();

    return {
      publicationId: `pub-${builderId}-${Date.now()}`,
      builderId,
      userId,
      deployment,
      version: release,
      seoAssets,
      security,
      durationMs,
      warnings,
      errors,
      publishedAt: new Date().toISOString()
    };
  }
}
