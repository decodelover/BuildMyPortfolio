import { StructuredLogger } from "../../ai/orchestrator/logger";

export class BillingLogger extends StructuredLogger {
  constructor(jobId?: string) {
    super(jobId);
  }

  public checkoutInitialized(userId: string, planId: string, provider: string): void {
    this.info(`Checkout session initialized for user '${userId}', plan '${planId}' via provider '${provider}'`);
  }

  public subscriptionUpdated(userId: string, subscriptionId: string, status: string): void {
    this.info(`Subscription '${subscriptionId}' for user '${userId}' updated to status '${status}'`);
  }

  public featureGated(userId: string, featureKey: string): void {
    this.warn(`Feature access denied for user '${userId}' on feature '${featureKey}'`);
  }

  public webhookReceived(provider: string, eventType: string): void {
    this.info(`Webhook event '${eventType}' received from provider '${provider}'`);
  }
}
