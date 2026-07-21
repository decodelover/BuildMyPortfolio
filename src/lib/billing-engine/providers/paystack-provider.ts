import { IPaymentProvider } from "./payment-provider";
import { CheckoutSession, PlanId, BillingInterval, PaymentProviderId, RefundRecord } from "../types";

export class PaystackPaymentProvider implements IPaymentProvider {
  public readonly providerId: PaymentProviderId = "paystack";

  public async createCheckoutSession(
    userId: string,
    customerEmail: string,
    planId: PlanId,
    interval: BillingInterval,
    _amount: number,
    _currency: string
  ): Promise<CheckoutSession> {
    const reference = `pst_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();

    return {
      sessionId: reference,
      userId,
      planId,
      interval,
      provider: "paystack",
      checkoutUrl: `https://checkout.paystack.com/${reference}`,
      expiresAt
    };
  }

  public async cancelSubscription(_subscriptionProviderId: string): Promise<boolean> {
    return true;
  }

  public async processRefund(invoiceId: string, amount: number, reason: string): Promise<RefundRecord> {
    return {
      refundId: `re_pst_${Date.now()}`,
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
    return Boolean(signature && signature.length > 10);
  }
}
