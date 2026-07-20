import { PaymentProviderId } from "../types";
import { PaymentGatewayManager } from "../services/payment-gateway-manager";
import { BillingLogger } from "../logging/billing-logger";

export class WebhookManager {
  public static handleWebhook(
    providerId: PaymentProviderId,
    signature: string,
    rawPayload: string,
    parsedEvent: any
  ): { handled: boolean; eventType: string } {
    const logger = new BillingLogger();
    const provider = PaymentGatewayManager.getProvider(providerId);

    const isValid = provider.verifyWebhookSignature(rawPayload, signature);
    if (!isValid) {
      throw new Error(`Invalid webhook signature for provider '${providerId}'.`);
    }

    const eventType = parsedEvent.type || parsedEvent.event || "unknown_event";
    logger.webhookReceived(providerId, eventType);

    // Event routing
    switch (eventType) {
      case "payment_intent.succeeded":
      case "charge.success":
        logger.info(`Handled successful payment event: ${eventType}`);
        break;
      case "invoice.payment_failed":
      case "charge.failed":
        logger.warn(`Handled failed payment event: ${eventType}`);
        break;
      case "customer.subscription.deleted":
        logger.info(`Handled subscription deletion event: ${eventType}`);
        break;
    }

    return { handled: true, eventType };
  }
}
