import { IDeploymentProvider } from "../providers/deployment-provider";
import { VercelDeploymentProvider } from "../providers/vercel-provider";
import { FirebaseHostingProvider } from "../providers/firebase-hosting-provider";
import { StaticExportProvider } from "../providers/static-export-provider";
import { DeploymentPlatform, DeploymentRecord, DeploymentEnvironment, CustomDomainConfig } from "../types";
import { DeploymentError } from "../errors/publishing-errors";

export class DeploymentManagerService {
  private static providers = new Map<DeploymentPlatform, IDeploymentProvider>([
    ["vercel", new VercelDeploymentProvider()],
    ["firebase-hosting", new FirebaseHostingProvider()],
    ["static-export", new StaticExportProvider()]
  ]);

  public static async executeDeployment(
    platform: DeploymentPlatform = "vercel",
    builderId: string,
    userId: string,
    planId: string,
    version: string,
    environment: DeploymentEnvironment,
    blueprint: any,
    customDomain?: CustomDomainConfig
  ): Promise<DeploymentRecord> {
    const provider = this.providers.get(platform);

    if (!provider) {
      throw new DeploymentError(platform, `Unsupported deployment platform '${platform}'.`);
    }

    return await provider.deploy(builderId, userId, planId, version, environment, blueprint, customDomain);
  }
}
