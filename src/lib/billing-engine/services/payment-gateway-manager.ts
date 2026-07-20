import { IPaymentProvider } from "../providers/payment-provider";
import { StripePaymentProvider } from "../providers/stripe-provider";
import { PaystackPaymentProvider } from "../providers/paystack-provider";
import { FlutterwavePaymentProvider } from "../providers/flutterwave-provider";
import { PaymentProviderId, CheckoutSession, PlanId, BillingInterval } from "../types";
import { PaymentProcessingError } from "../errors/billing-errors";
import { PlanManager } from "../plans/plan-manager";

export class PaymentGatewayManager {
  private static providers = new Map<PaymentProviderId, IPaymentProvider>([
    ["stripe", new StripePaymentProvider()],
    ["paystack", new PaystackPaymentProvider()],
    ["flutterwave", new FlutterwavePaymentProvider()]
  ]);

  public static getProvider(providerId: PaymentProviderId): IPaymentProvider {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new PaymentProcessingError(providerId, `Payment provider '${providerId}' is not registered.`);
    }
    return provider;
  }

  public static async createCheckoutSession(
    userId: string,
    customerEmail: string,
    planId: PlanId,
    interval: BillingInterval = "monthly",
    providerId: PaymentProviderId = "stripe",
    discountAmount: number = 0
  ): Promise<CheckoutSession> {
    const provider = this.getProvider(providerId);
    const rawPrice = PlanManager.calculatePrice(planId, interval);
    const finalAmount = Math.max(0, rawPrice - discountAmount);

    return await provider.createCheckoutSession(
      userId,
      customerEmail,
      planId,
      interval,
      finalAmount,
      "USD"
    );
  }
}
