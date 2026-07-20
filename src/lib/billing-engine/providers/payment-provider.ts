import { CheckoutSession, PlanId, BillingInterval, PaymentProviderId, RefundRecord } from "../types";

export interface IPaymentProvider {
  readonly providerId: PaymentProviderId;

  createCheckoutSession(
    userId: string,
    customerEmail: string,
    planId: PlanId,
    interval: BillingInterval,
    amount: number,
    currency: string
  ): Promise<CheckoutSession>;

  cancelSubscription(subscriptionProviderId: string): Promise<boolean>;

  processRefund(invoiceId: string, amount: number, reason: string): Promise<RefundRecord>;

  verifyWebhookSignature(rawBody: string, signature: string): boolean;
}
