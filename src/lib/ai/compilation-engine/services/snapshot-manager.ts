import { CompilationContext, BlueprintSnapshot } from "../types";
import { CompilationConfig } from "../config/compilation-config";
import { SnapshotError } from "../errors/compilation-errors";

export class SnapshotManager {
  private static snapshotStore = new Map<string, BlueprintSnapshot[]>();

  public static createSnapshot(
    context: CompilationContext,
    reason: string = "pre-compilation"
  ): BlueprintSnapshot {
    if (!context || !context.planId) {
      throw new SnapshotError("Cannot create snapshot without valid compilation context and planId.");
    }

    const snapshotId = `snap-${context.planId}-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const snapshot: BlueprintSnapshot = {
      snapshotId,
      timestamp,
      context: JSON.parse(JSON.stringify(context)), // Deep clone context state
      metadata: {
        reason,
        triggeredBy: "compilation-engine"
      }
    };

    const planSnapshots = this.snapshotStore.get(context.planId) || [];
    planSnapshots.push(snapshot);

    // Limit retention
    if (planSnapshots.length > CompilationConfig.maxSnapshotRetention) {
      planSnapshots.shift();
    }

    this.snapshotStore.set(context.planId, planSnapshots);

    return snapshot;
  }

  public static getSnapshots(planId: string): BlueprintSnapshot[] {
    return this.snapshotStore.get(planId) || [];
  }

  public static getLatestSnapshot(planId: string): BlueprintSnapshot | undefined {
    const snapshots = this.getSnapshots(planId);
    return snapshots[snapshots.length - 1];
  }

  public static restoreSnapshot(snapshotId: string): CompilationContext | undefined {
    for (const snapshots of Array.from(this.snapshotStore.values())) {
      const match = snapshots.find((s) => s.snapshotId === snapshotId);
      if (match) {
        return JSON.parse(JSON.stringify(match.context));
      }
    }
    return undefined;
  }

  public static clearSnapshots(planId: string): void {
    this.snapshotStore.delete(planId);
  }
}
