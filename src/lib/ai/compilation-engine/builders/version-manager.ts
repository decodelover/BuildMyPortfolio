import { BlueprintVersion, BlueprintSnapshot, PortfolioBlueprint } from "../types";

export class VersionManager {
  private static versionHistory: BlueprintVersion[] = [];

  public static createVersion(
    blueprint: PortfolioBlueprint,
    snapshot: BlueprintSnapshot,
    changeLog: string = "Initial compilation build"
  ): BlueprintVersion {
    const revision = this.versionHistory.length + 1;
    const versionId = `ver-${blueprint.version}-r${revision}`;

    const versionEntry: BlueprintVersion = {
      versionId,
      revision,
      changeLog,
      timestamp: new Date().toISOString(),
      blueprintSnapshot: snapshot,
      diffSummary: {
        sectionsAdded: blueprint.sections.length,
        sectionsRemoved: 0,
        sectionsModified: 0,
        themeChanged: true,
        assetsChanged: blueprint.assets.length
      },
      isRollbackTarget: true
    };

    this.versionHistory.push(versionEntry);
    return versionEntry;
  }

  public static getHistory(): BlueprintVersion[] {
    return [...this.versionHistory];
  }

  public static getLatestVersion(): BlueprintVersion | undefined {
    return this.versionHistory[this.versionHistory.length - 1];
  }

  public static clearHistory(): void {
    this.versionHistory = [];
  }
}
