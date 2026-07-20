import { ReleaseVersion, DeploymentRecord } from "../types";

export class PublishingVersionManager {
  private static releaseHistory = new Map<string, ReleaseVersion[]>();

  public static createRelease(
    builderId: string,
    deployment: DeploymentRecord,
    notes: string = "Automated production deployment release"
  ): ReleaseVersion {
    const existing = this.releaseHistory.get(builderId) || [];

    // Increment minor version v1.0.X
    const vNum = existing.length + 1;
    const versionCode = `v1.0.${vNum}`;

    // Deactivate previous active releases
    existing.forEach((r) => (r.isCurrent = false));

    const newRelease: ReleaseVersion = {
      versionId: `rel-${builderId}-${vNum}-${Date.now()}`,
      builderId,
      versionCode,
      deploymentId: deployment.deploymentId,
      url: deployment.url,
      isCurrent: true,
      releaseNotes: notes,
      createdAt: new Date().toISOString()
    };

    existing.unshift(newRelease);
    this.releaseHistory.set(builderId, existing);

    return newRelease;
  }

  public static getReleaseHistory(builderId: string): ReleaseVersion[] {
    return this.releaseHistory.get(builderId) || [];
  }

  public static getCurrentRelease(builderId: string): ReleaseVersion | undefined {
    const history = this.getReleaseHistory(builderId);
    return history.find((r) => r.isCurrent);
  }
}
