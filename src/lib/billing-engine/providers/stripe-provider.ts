import { IPaymentProvider } from "./payment-provider";
import { CheckoutSession, PlanId, BillingInterval, PaymentProviderId, RefundRecord } from "../types";

export class StripePaymentProvider implements IPaymentProvider {
  public readonly providerId: PaymentProviderId = "stripe";

  public async createCheckoutSession(
    userId: string,
    customerEmail: string,
    planId: PlanId,
    interval: BillingInterval,
    amount: number,
    currency: string
  ): Promise<CheckoutSession> {
    const sessionId = `cs_stripe_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();

    return {
      sessionId,
      userId,
      planId,
      interval,
      provider: "stripe",
      checkoutUrl: `https://checkout.stripe.com/c/pay/${sessionId}`,
      clientSecret: `pi_stripe_${Date.now()}_secret`,
      expiresAt
    };
  }

  public async cancelSubscription(subscriptionProviderId: string): Promise<boolean> {
    return true;
  }

  public async processRefund(invoiceId: string, amount: number, reason: string): Promise<RefundRecord> {
    return {
      refundId: `re_stripe_${Date.now()}`,
      invoiceId,
      userId: "user-default",
      amount,
      currency: "USD",
      reason,
      status: "succeeded",
      processedAt: new Date().toISOString()
    };
  }

  public verifyWebhookSignature(rawBody: string, signature: string): boolean {
    return Boolean(signature && signature.startsWith("t="));
  }
}
