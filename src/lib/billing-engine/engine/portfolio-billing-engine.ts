import {
  PlanId,
  BillingInterval,
  PaymentProviderId,
  UserSubscription,
  FeatureAccessResult,
  Invoice,
  UserUsageRecord
} from "../types";
import { SubscriptionService } from "../services/subscription-service";
import { PermissionService } from "../services/permission-service";
import { UsageService } from "../services/usage-service";
import { PlanService } from "../services/plan-service";
import { InvoiceService } from "../services/invoice-service";
import { CustomerService } from "../services/customer-service";
import { BillingEventBus } from "../events/billing-event-bus";

export class PortfolioBillingEngine {
  public static getUserSubscription(userId: string): UserSubscription {
    return SubscriptionService.getUserSubscription(userId);
  }

  public static getUserUsage(userId: string): UserUsageRecord {
    return UsageService.getUsage(userId);
  }

  public static changePlan(
    userId: string,
    newPlanId: PlanId,
    interval: BillingInterval = "monthly"
  ): UserSubscription {
    const previousSub = SubscriptionService.getUserSubscription(userId);
    const updatedSub = SubscriptionService.updateSubscription(userId, {
      planId: newPlanId,
      interval,
      status: newPlanId === "FREE" ? "free" : "active",
    });

    BillingEventBus.emit(userId, "PlanChanged", {
      previousPlanId: previousSub.planId,
      newPlanId,
      interval,
    });

    return updatedSub;
  }

  public static activateSubscription(
    userId: string,
    planId: PlanId,
    interval: BillingInterval,
    provider: PaymentProviderId,
    customerName: string,
    customerEmail: string
  ): { subscription: UserSubscription; invoice: Invoice } {
    CustomerService.getOrCreateCustomer(userId, customerEmail, customerName);

    const subscription = SubscriptionService.updateSubscription(userId, {
      planId,
      interval,
      provider,
      status: "active",
    });

    const plan = PlanService.getPlan(planId);
    const price = interval === "yearly" ? plan.yearlyPriceUsd : plan.monthlyPriceUsd;

    const invoice = InvoiceService.createInvoice({
      userId,
      subscriptionId: subscription.subscriptionId,
      customerName,
      customerEmail,
      items: [
        {
          id: `item-${planId}`,
          description: `${plan.name} Subscription (${interval})`,
          amount: price,
          quantity: 1,
        },
      ],
    });

    BillingEventBus.emit(userId, "SubscriptionCreated", {
      subscriptionId: subscription.subscriptionId,
      planId,
      interval,
      provider,
    });

    BillingEventBus.emit(userId, "InvoiceGenerated", {
      invoiceId: invoice.invoiceId,
      total: invoice.total,
    });

    return { subscription, invoice };
  }

  public static cancelSubscription(userId: string, immediately: boolean = false): UserSubscription {
    const canceled = SubscriptionService.cancelSubscription(userId, immediately);
    BillingEventBus.emit(userId, "SubscriptionCancelled", {
      subscriptionId: canceled.subscriptionId,
      immediately,
    });
    return canceled;
  }

  public static checkFeatureAccess(userId: string, featureKey: string): FeatureAccessResult {
    const sub = SubscriptionService.getUserSubscription(userId);
    const usage = UsageService.getUsage(userId);

    switch (featureKey) {
      case "generate_portfolio":
      case "portfolio_count":
        return PermissionService.canGeneratePortfolio(sub, usage);
      case "publish_portfolio":
      case "publishing_count":
        return PermissionService.canPublishPortfolio(sub, usage);
      case "use_ai":
      case "ai_generations":
        return PermissionService.canUseAI(sub, usage);
      case "export_resume":
        return PermissionService.canExportResume(sub, usage);
      case "premium_templates":
      case "premium_themes":
        return PermissionService.canUsePremiumTemplates(sub);
      case "connect_domain":
      case "custom_domains":
        return PermissionService.canConnectDomain(sub, usage);
      case "analytics":
        return PermissionService.canAccessAnalytics(sub);
      case "custom_branding":
        return PermissionService.canUseCustomBranding(sub);
      case "team_features":
        return PermissionService.canUseTeamFeatures(sub);
      default:
        return { allowed: true };
    }
  }

  public static recordUsage(
    userId: string,
    metric: keyof Omit<UserUsageRecord, "userId" | "periodStart" | "periodEnd">,
    amount: number = 1
  ): UserUsageRecord {
    return UsageService.recordUsage(userId, metric, amount);
  }
}
