import { DeploymentRecord, DeploymentEnvironment, CustomDomainConfig } from "../types";

export interface IDeploymentProvider {
  readonly platformName: string;

  deploy(
    builderId: string,
    userId: string,
    planId: string,
    version: string,
    environment: DeploymentEnvironment,
    blueprint: any,
    customDomain?: CustomDomainConfig
  ): Promise<DeploymentRecord>;
}
