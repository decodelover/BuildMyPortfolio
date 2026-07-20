import { CompilationContext, BlueprintSnapshot } from "../types";

export class SnapshotManager {
  private static snapshots = new Map<string, BlueprintSnapshot>();

  public static createSnapshot(context: CompilationContext): BlueprintSnapshot {
    const snapshotId = `snap-${Date.now()}`;
    const snapshot: BlueprintSnapshot = {
      snapshotId,
      timestamp: new Date().toISOString(),
      context: JSON.parse(JSON.stringify(context)),
      metadata: {
        reason: "Pre-compilation snapshot",
        triggeredBy: "compilation-pipeline"
      }
    };

    this.snapshots.set(snapshotId, snapshot);
    return snapshot;
  }

  public static getSnapshot(snapshotId: string): BlueprintSnapshot | undefined {
    return this.snapshots.get(snapshotId);
  }

  public static clearSnapshots(): void {
    this.snapshots.clear();
  }
}
