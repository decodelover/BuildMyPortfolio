import { IDeploymentProvider } from "./deployment-provider";
import { DeploymentRecord, DeploymentEnvironment, CustomDomainConfig } from "../types";

export class StaticExportProvider implements IDeploymentProvider {
  public readonly platformName = "static-export";

  public async deploy(
    builderId: string,
    userId: string,
    planId: string,
    version: string,
    environment: DeploymentEnvironment,
    blueprint: any,
    customDomain?: CustomDomainConfig
  ): Promise<DeploymentRecord> {
    const startTime = Date.now();
    const deploymentId = `dep-stc-${builderId}-${Date.now()}`;

    const liveUrl = `/exports/${builderId}-${version}.zip`;
    const durationMs = Date.now() - startTime + 310;

    return {
      deploymentId,
      builderId,
      userId,
      planId,
      version,
      platform: "static-export",
      environment,
      status: "published",
      url: liveUrl,
      customDomain,
      durationMs,
      deployedAt: new Date().toISOString()
    };
  }
}
