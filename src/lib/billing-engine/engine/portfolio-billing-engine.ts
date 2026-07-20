import {
  PlanId,
  BillingInterval,
  PaymentProviderId,
  UserSubscription,
  CheckoutSession,
  FeatureAccessResult,
  Invoice
} from "../types";
import { PaymentGatewayManager } from "../services/payment-gateway-manager";
import { SubscriptionManager } from "../subscription/subscription-manager";
import { FeatureGateManager } from "../feature-gating/feature-gate-manager";
import { UsageTracker } from "../usage/usage-tracker";
import { CouponEngine } from "../promotions/coupon-engine";
import { InvoiceManager } from "../invoicing/invoice-manager";
import { PlanManager } from "../plans/plan-manager";
import { BillingLogger } from "../logging/billing-logger";

export class PortfolioBillingEngine {
  public static async initializeCheckout(
    userId: string,
    customerEmail: string,
    planId: PlanId,
    interval: BillingInterval = "monthly",
    provider: PaymentProviderId = "stripe",
    promoCode?: string
  ): Promise<CheckoutSession> {
    const logger = new BillingLogger();
    logger.checkoutInitialized(userId, planId, provider);

    let discountAmount = 0;
    if (promoCode) {
      const planPrice = PlanManager.calculatePrice(planId, interval);
      const applied = CouponEngine.validateAndApplyCoupon(promoCode, planPrice, planId);
      discountAmount = applied.discountAmount;
    }

    return await PaymentGatewayManager.createCheckoutSession(
      userId,
      customerEmail,
      planId,
      interval,
      provider,
      discountAmount
    );
  }

  public static activateSubscription(
    userId: string,
    planId: PlanId,
    interval: BillingInterval,
    provider: PaymentProviderId,
    customerName: string,
    customerEmail: string
  ): { subscription: UserSubscription; invoice: Invoice } {
    const subscription = SubscriptionManager.updateSubscription(userId, planId, interval, provider, "active");
    const plan = PlanManager.getPlan(planId);

    const price = PlanManager.calculatePrice(planId, interval);

    const invoice = InvoiceManager.generateInvoice(
      userId,
      subscription.subscriptionId,
      customerName,
      customerEmail,
      [
        {
          id: `item-${planId}`,
          description: `${plan.name} Subscription (${interval})`,
          amount: price,
          quantity: 1
        }
      ]
    );

    return { subscription, invoice };
  }

  public static checkFeatureAccess(userId: string, featureKey: string): FeatureAccessResult {
    const sub = SubscriptionManager.getUserSubscription(userId);
    const usage = UsageTracker.getUsage(userId);

    let currentUsage = 0;
    if (featureKey === "ai_generations") currentUsage = usage.aiCreditsUsed;
    if (featureKey === "portfolio_count") currentUsage = usage.portfoliosCount;
    if (featureKey === "custom_domains") currentUsage = usage.customDomainsCount;
    if (featureKey === "publishing_count") currentUsage = usage.publishingsCount;

    return FeatureGateManager.canAccess(sub, featureKey, currentUsage);
  }
}
