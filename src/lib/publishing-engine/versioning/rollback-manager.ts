import { ReleaseVersion } from "../types";
import { PublishingVersionManager } from "./version-manager";
import { RollbackError } from "../errors/publishing-errors";

export class RollbackManager {
  public static rollbackToVersion(builderId: string, targetVersionId: string): ReleaseVersion {
    const history = PublishingVersionManager.getReleaseHistory(builderId);
    const target = history.find((r) => r.versionId === targetVersionId);

    if (!target) {
      throw new RollbackError(targetVersionId, `Release version '${targetVersionId}' not found in release history.`);
    }

    history.forEach((r) => {
      r.isCurrent = r.versionId === targetVersionId;
    });

    return target;
  }
}
