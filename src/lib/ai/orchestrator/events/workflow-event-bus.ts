import { WorkflowEvent, WorkflowEventListener, WorkflowEventType } from "../types";

export class WorkflowEventBus {
  private static instance: WorkflowEventBus | null = null;
  private listeners = new Map<WorkflowEventType | "*", Set<WorkflowEventListener>>();

  private constructor() {}

  public static getInstance(): WorkflowEventBus {
    if (!WorkflowEventBus.instance) {
      WorkflowEventBus.instance = new WorkflowEventBus();
    }
    return WorkflowEventBus.instance;
  }

  public subscribe(eventType: WorkflowEventType | "*", listener: WorkflowEventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.get(eventType)?.delete(listener);
    };
  }

  public emit(event: WorkflowEvent): void {
    // Notify specific type listeners
    const specific = this.listeners.get(event.type);
    if (specific) {
      specific.forEach((listener) => {
        try {
          listener(event);
        } catch (err) {
          console.error(`WorkflowEventBus listener error for event '${event.type}':`, err);
        }
      });
    }

    // Notify wildcard listeners
    const wildcard = this.listeners.get("*");
    if (wildcard) {
      wildcard.forEach((listener) => {
        try {
          listener(event);
        } catch (err) {
          console.error("WorkflowEventBus wildcard listener error:", err);
        }
      });
    }
  }

  public clear(): void {
    this.listeners.clear();
  }
}
