import { create } from "zustand";
import {
  UserSubscription,
  PlanId,
  BillingInterval,
  PaymentProviderId,
  CheckoutSession,
  Invoice,
  UserUsageRecord,
  SubscriptionPlan,
  FeatureAccessResult
} from "@/lib/billing-engine/types";
import { PortfolioBillingEngine } from "@/lib/billing-engine/engine/portfolio-billing-engine";
import { SubscriptionService } from "@/lib/billing-engine/services/subscription-service";
import { PlanDefinitions } from "@/lib/billing-engine/plans/plan-definitions";
import { InvoiceService } from "@/lib/billing-engine/services/invoice-service";
import { UsageService } from "@/lib/billing-engine/services/usage-service";
import { PermissionService } from "@/lib/billing-engine/services/permission-service";

export interface BillingEngineStoreState {
  subscription: UserSubscription | null;
  activePlan: SubscriptionPlan | null;
  usage: UserUsageRecord | null;
  invoices: Invoice[];
  availablePlans: SubscriptionPlan[];
  activeCheckoutSession: CheckoutSession | null;
  loading: boolean;
  error: string | null;

  // Actions
  loadUserBillingState: (userId: string) => void;
  changePlan: (userId: string, newPlanId: PlanId, interval?: BillingInterval) => void;
  activateSubscription: (
    userId: string,
    planId: PlanId,
    interval: BillingInterval,
    provider: PaymentProviderId,
    customerName: string,
    customerEmail: string
  ) => void;
  cancelSubscription: (userId: string, immediately?: boolean) => void;
  recordUsageMetric: (userId: string, metric: keyof Omit<UserUsageRecord, "userId" | "periodStart" | "periodEnd">, amount?: number) => void;

  // Permission Checkers
  checkFeature: (userId: string, featureKey: string) => boolean;
  canAccessDashboard: () => FeatureAccessResult;
  canGeneratePortfolio: () => FeatureAccessResult;
  canPublishPortfolio: () => FeatureAccessResult;
  canCreatePortfolio: () => FeatureAccessResult;
  canDeletePortfolio: () => FeatureAccessResult;
  canExportResume: () => FeatureAccessResult;
  canGenerateResume: () => FeatureAccessResult;
  canUsePremiumTemplates: () => FeatureAccessResult;
  canUseAI: (requestedCredits?: number) => FeatureAccessResult;
  canUseAdvancedAI: () => FeatureAccessResult;
  canUseSEO: () => FeatureAccessResult;
  canUseAnalytics: () => FeatureAccessResult;
  canConnectDomain: () => FeatureAccessResult;
  canRemoveBranding: () => FeatureAccessResult;
  canUseCustomBranding: () => FeatureAccessResult;
  canUseVersionHistory: () => FeatureAccessResult;
  canAccessMarketplace: () => FeatureAccessResult;
  canUseTeamWorkspace: () => FeatureAccessResult;
  canManageClients: () => FeatureAccessResult;

  resetBillingStore: () => void;
}

export const useBillingEngineStore = create<BillingEngineStoreState>((set, get) => ({
  subscription: null,
  activePlan: null,
  usage: null,
  invoices: [],
  availablePlans: PlanDefinitions.getAllPlans(),
  activeCheckoutSession: null,
  loading: false,
  error: null,

  loadUserBillingState: (userId) => {
    set({ loading: true });
    const sub = SubscriptionService.getUserSubscription(userId);
    const plan = PlanDefinitions.getPlan(sub.planId);
    const usage = UsageService.getUsage(userId);
    const invoices = InvoiceService.getUserInvoices(userId);

    set({
      subscription: sub,
      activePlan: plan,
      usage,
      invoices,
      loading: false,
    });
  },

  changePlan: (userId, newPlanId, interval = "monthly") => {
    const updatedSub = PortfolioBillingEngine.changePlan(userId, newPlanId, interval);
    const plan = PlanDefinitions.getPlan(newPlanId);
    set({
      subscription: updatedSub,
      activePlan: plan,
    });
  },

  activateSubscription: (userId, planId, interval, provider, customerName, customerEmail) => {
    const { subscription, invoice } = PortfolioBillingEngine.activateSubscription(
      userId,
      planId,
      interval,
      provider,
      customerName,
      customerEmail
    );
    const plan = PlanDefinitions.getPlan(planId);
    set((state) => ({
      subscription,
      activePlan: plan,
      invoices: [invoice, ...state.invoices],
    }));
  },

  cancelSubscription: (userId, immediately = false) => {
    const updated = PortfolioBillingEngine.cancelSubscription(userId, immediately);
    const plan = PlanDefinitions.getPlan(updated.planId);
    set({ subscription: updated, activePlan: plan });
  },

  recordUsageMetric: (userId, metric, amount = 1) => {
    const updatedUsage = PortfolioBillingEngine.recordUsage(userId, metric, amount);
    set({ usage: updatedUsage });
  },

  // Permission Checkers using reactive store state
  checkFeature: (userId, featureKey) => {
    const result = PortfolioBillingEngine.checkFeatureAccess(userId, featureKey);
    return result.allowed;
  },

  canAccessDashboard: () => {
    const { subscription } = get();
    return PermissionService.canAccessDashboard(subscription);
  },

  canGeneratePortfolio: () => {
    const { subscription, usage } = get();
    return PermissionService.canGeneratePortfolio(subscription, usage);
  },

  canPublishPortfolio: () => {
    const { subscription, usage } = get();
    return PermissionService.canPublishPortfolio(subscription, usage);
  },

  canCreatePortfolio: () => {
    const { subscription, usage } = get();
    return PermissionService.canCreatePortfolio(subscription, usage);
  },

  canDeletePortfolio: () => {
    const { subscription } = get();
    return PermissionService.canDeletePortfolio(subscription);
  },

  canExportResume: () => {
    const { subscription, usage } = get();
    return PermissionService.canExportResume(subscription, usage);
  },

  canGenerateResume: () => {
    const { subscription, usage } = get();
    return PermissionService.canGenerateResume(subscription, usage);
  },

  canUsePremiumTemplates: () => {
    const { subscription } = get();
    return PermissionService.canUsePremiumTemplates(subscription);
  },

  canUseAI: (requestedCredits = 1) => {
    const { subscription, usage } = get();
    return PermissionService.canUseAI(subscription, usage, requestedCredits);
  },

  canUseAdvancedAI: () => {
    const { subscription } = get();
    return PermissionService.canUseAdvancedAI(subscription);
  },

  canUseSEO: () => {
    const { subscription } = get();
    return PermissionService.canUseSEO(subscription);
  },

  canUseAnalytics: () => {
    const { subscription } = get();
    return PermissionService.canUseAnalytics(subscription);
  },

  canConnectDomain: () => {
    const { subscription, usage } = get();
    return PermissionService.canConnectDomain(subscription, usage);
  },

  canRemoveBranding: () => {
    const { subscription } = get();
    return PermissionService.canRemoveBranding(subscription);
  },

  canUseCustomBranding: () => {
    const { subscription } = get();
    return PermissionService.canUseCustomBranding(subscription);
  },

  canUseVersionHistory: () => {
    const { subscription } = get();
    return PermissionService.canUseVersionHistory(subscription);
  },

  canAccessMarketplace: () => {
    const { subscription } = get();
    return PermissionService.canAccessMarketplace(subscription);
  },

  canUseTeamWorkspace: () => {
    const { subscription } = get();
    return PermissionService.canUseTeamWorkspace(subscription);
  },

  canManageClients: () => {
    const { subscription } = get();
    return PermissionService.canManageClients(subscription);
  },

  resetBillingStore: () => {
    set({
      subscription: null,
      activePlan: null,
      usage: null,
      invoices: [],
      activeCheckoutSession: null,
      loading: false,
      error: null,
    });
  },
}));
