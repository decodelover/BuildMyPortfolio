import { BillingEvent, BillingEventType } from "../types";

export type BillingEventListener = (event: BillingEvent) => void;

export class BillingEventBus {
  private static listeners = new Map<BillingEventType, Set<BillingEventListener>>();

  public static on(eventType: BillingEventType, listener: BillingEventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);

    return () => {
      this.listeners.get(eventType)?.delete(listener);
    };
  }

  public static emit(userId: string, type: BillingEventType, payload: Record<string, any> = {}): BillingEvent {
    const event: BillingEvent = {
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      userId,
      type,
      payload,
      timestamp: new Date().toISOString(),
    };

    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      typeListeners.forEach((listener) => {
        try {
          listener(event);
        } catch (err) {
          console.error(`Error in billing event listener for '${type}':`, err);
        }
      });
    }

    return event;
  }
}
