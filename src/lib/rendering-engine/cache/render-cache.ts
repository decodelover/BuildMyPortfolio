import { RenderContext } from "../types";

export class RenderCache {
  private static cache = new Map<string, { context: RenderContext; timestamp: number }>();
  private static readonly ttlMs = 300000; // 5 minutes TTL

  public static set(blueprintId: string, context: RenderContext): void {
    this.cache.set(blueprintId, {
      context: JSON.parse(JSON.stringify(context)),
      timestamp: Date.now()
    });
  }

  public static get(blueprintId: string): RenderContext | undefined {
    const cached = this.cache.get(blueprintId);
    if (!cached) return undefined;

    if (Date.now() - cached.timestamp > this.ttlMs) {
      this.cache.delete(blueprintId);
      return undefined;
    }

    return JSON.parse(JSON.stringify(cached.context));
  }

  public static clear(): void {
    this.cache.clear();
  }
}
