import { PortfolioBlueprint, BlueprintVersion, BlueprintSnapshot } from "../types";
import { CompilationConfig } from "../config/compilation-config";
import { VersionError } from "../errors/compilation-errors";

export class VersionManager {
  private static versionRegistry = new Map<string, BlueprintVersion[]>();

  public static createVersion(
    blueprint: PortfolioBlueprint,
    snapshot: BlueprintSnapshot,
    previousBlueprint?: PortfolioBlueprint | null
  ): BlueprintVersion {
    if (!blueprint || !blueprint.blueprintId) {
      throw new VersionError("Cannot create version for invalid portfolio blueprint.");
    }

    const planId = blueprint.planId;
    const history = this.versionRegistry.get(planId) || [];
    const revision = history.length + 1;
    const versionId = `ver-${blueprint.planId}-r${revision}`;

    // Compute Diff Summary
    const diffSummary = {
      sectionsAdded: previousBlueprint
        ? blueprint.sections.filter((s) => !previousBlueprint.sections.some((ps) => ps.id === s.id)).length
        : blueprint.sections.length,
      sectionsRemoved: previousBlueprint
        ? previousBlueprint.sections.filter((ps) => !blueprint.sections.some((s) => s.id === ps.id)).length
        : 0,
      sectionsModified: previousBlueprint
        ? blueprint.sections.filter((s) => {
            const ps = previousBlueprint.sections.find((x) => x.id === s.id);
            return ps && JSON.stringify(ps.content) !== JSON.stringify(s.content);
          }).length
        : 0,
      themeChanged: previousBlueprint ? previousBlueprint.theme.themeId !== blueprint.theme.themeId : false,
      assetsChanged: previousBlueprint ? Math.abs(blueprint.assets.length - previousBlueprint.assets.length) : blueprint.assets.length
    };

    const changeLog = previousBlueprint
      ? `Revision ${revision}: ${diffSummary.sectionsModified} sections updated, ${diffSummary.sectionsAdded} added, ${diffSummary.sectionsRemoved} removed.`
      : `Revision 1: Initial compiled portfolio blueprint.`;

    const versionRecord: BlueprintVersion = {
      versionId,
      revision,
      changeLog,
      timestamp: new Date().toISOString(),
      blueprintSnapshot: snapshot,
      diffSummary,
      isRollbackTarget: true
    };

    history.push(versionRecord);

    // Maintain max depth limit
    if (history.length > CompilationConfig.maxVersionHistoryDepth) {
      history.shift();
    }

    this.versionRegistry.set(planId, history);

    return versionRecord;
  }

  public static getHistory(planId: string): BlueprintVersion[] {
    return this.versionRegistry.get(planId) || [];
  }

  public static getLatestVersion(planId: string): BlueprintVersion | undefined {
    const history = this.getHistory(planId);
    return history[history.length - 1];
  }

  public static clearHistory(planId: string): void {
    this.versionRegistry.delete(planId);
  }
}
