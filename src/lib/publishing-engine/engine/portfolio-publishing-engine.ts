import {
  PublishingOptions,
  PublicationReport
} from "../types";
import { BuildValidator } from "../services/build-validator";
import { DomainManager } from "../domain/domain-manager";
import { DeploymentManagerService } from "../services/deployment-manager";
import { PublishingVersionManager } from "../versioning/version-manager";
import { SitemapGenerator } from "../seo-publication/sitemap-generator";
import { RobotsGenerator } from "../seo-publication/robots-generator";
import { PublicationReporter } from "../services/publication-reporter";
import { PublishingLogger } from "../logging/publishing-logger";
import { PublishingConfig } from "../config/publishing-config";

export class PortfolioPublishingEngine {
  public static async publishPortfolio(
    builderId: string,
    userId: string,
    planId: string,
    blueprintInput: any,
    options: PublishingOptions = {}
  ): Promise<PublicationReport> {
    const startTime = Date.now();
    const logger = new PublishingLogger(builderId);

    const platform = options.platform || PublishingConfig.defaultPlatform;
    const environment = options.environment || "production";
    logger.publicationStarted(builderId, platform);

    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      // 1. Validate Build Integrity
      BuildValidator.validateBlueprintBuild(blueprintInput);

      // 2. Resolve Domain Configuration
      const domainConfig = DomainManager.resolveDomainConfig(builderId, options.customDomain);

      // 3. Resolve Target Version Code
      const currentHistory = PublishingVersionManager.getReleaseHistory(builderId);
      const nextVersionCode = `v1.0.${currentHistory.length + 1}`;

      // 4. Deploy Portfolio Blueprint to Cloud Platform
      const deployment = await DeploymentManagerService.executeDeployment(
        platform,
        builderId,
        userId,
        planId,
        nextVersionCode,
        environment,
        blueprintInput,
        domainConfig
      );

      // 5. Create Release Version Record
      const release = PublishingVersionManager.createRelease(builderId, deployment, options.releaseNotes);

      // 6. Generate SEO Publication Assets
      const routes = blueprintInput.navigation?.routes || [{ path: "/" }];
      const _sitemapXml = SitemapGenerator.generateSitemapXML(routes, deployment.url);
      const _robotsTxt = RobotsGenerator.generateRobotsTxt(deployment.url, true);

      const sitemapUrl = `${deployment.url}/sitemap.xml`;
      const robotsTxtUrl = `${deployment.url}/robots.txt`;

      const durationMs = Date.now() - startTime;
      logger.deploymentCompleted(deployment.deploymentId, deployment.url, durationMs);

      // 7. Produce Publication Report
      return PublicationReporter.generateReport(
        builderId,
        userId,
        deployment,
        release,
        sitemapUrl,
        robotsTxtUrl,
        durationMs,
        warnings,
        errors
      );

    } catch (err: any) {
      const errorMsg = err.message || String(err);
      errors.push(errorMsg);
      logger.publicationFailed(builderId, err);

      const dummyDeployment: any = {
        deploymentId: `dep-err-${Date.now()}`,
        builderId,
        userId,
        planId,
        version: "v0.0.0",
        platform,
        environment,
        status: "failed",
        url: "",
        durationMs: Date.now() - startTime,
        deployedAt: new Date().toISOString()
      };

      const dummyRelease: any = {
        versionId: "rel-failed",
        builderId,
        versionCode: "v0.0.0",
        deploymentId: dummyDeployment.deploymentId,
        url: "",
        isCurrent: false,
        releaseNotes: "Failed deployment attempt",
        createdAt: new Date().toISOString()
      };

      return PublicationReporter.generateReport(
        builderId,
        userId,
        dummyDeployment,
        dummyRelease,
        "",
        "",
        Date.now() - startTime,
        warnings,
        errors
      );
    }
  }
}
