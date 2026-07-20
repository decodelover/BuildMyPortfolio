import { create } from "zustand";
import {
  UserSubscription,
  PlanId,
  BillingInterval,
  PaymentProviderId,
  CheckoutSession,
  Invoice,
  UserUsageRecord,
  SubscriptionPlan
} from "@/lib/billing-engine/types";
import { PortfolioBillingEngine } from "@/lib/billing-engine/engine/portfolio-billing-engine";
import { SubscriptionManager } from "@/lib/billing-engine/subscription/subscription-manager";
import { PlanManager } from "@/lib/billing-engine/plans/plan-manager";
import { InvoiceManager } from "@/lib/billing-engine/invoicing/invoice-manager";
import { UsageTracker } from "@/lib/billing-engine/usage/usage-tracker";
import { CancellationManager } from "@/lib/billing-engine/subscription/cancellation-manager";

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
  initializeCheckout: (
    userId: string,
    customerEmail: string,
    planId: PlanId,
    interval?: BillingInterval,
    provider?: PaymentProviderId,
    promoCode?: string
  ) => Promise<CheckoutSession | null>;

  activateSubscription: (
    userId: string,
    planId: PlanId,
    interval: BillingInterval,
    provider: PaymentProviderId,
    customerName: string,
    customerEmail: string
  ) => void;

  cancelSubscription: (userId: string, immediately?: boolean) => void;
  checkFeature: (userId: string, featureKey: string) => boolean;
  resetBillingStore: () => void;
}

export const useBillingEngineStore = create<BillingEngineStoreState>((set, get) => ({
  subscription: null,
  activePlan: null,
  usage: null,
  invoices: [],
  availablePlans: PlanManager.getAllPlans(),
  activeCheckoutSession: null,
  loading: false,
  error: null,

  loadUserBillingState: (userId) => {
    set({ loading: true });
    const sub = SubscriptionManager.getUserSubscription(userId);
    const plan = PlanManager.getPlan(sub.planId);
    const usage = UsageTracker.getUsage(userId);
    const invoices = InvoiceManager.getUserInvoices(userId);

    set({
      subscription: sub,
      activePlan: plan,
      usage,
      invoices,
      loading: false
    });
  },

  initializeCheckout: async (userId, customerEmail, planId, interval = "monthly", provider = "stripe", promoCode) => {
    set({ loading: true, error: null });
    try {
      const session = await PortfolioBillingEngine.initializeCheckout(
        userId,
        customerEmail,
        planId,
        interval,
        provider,
        promoCode
      );
      set({ activeCheckoutSession: session, loading: false });
      return session;
    } catch (err: any) {
      set({ error: err.message || "Failed to initialize checkout session.", loading: false });
      return null;
    }
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
    const plan = PlanManager.getPlan(planId);
    set((state) => ({
      subscription,
      activePlan: plan,
      invoices: [invoice, ...state.invoices]
    }));
  },

  cancelSubscription: (userId, immediately = false) => {
    const updated = CancellationManager.cancelSubscription(userId, immediately);
    const plan = PlanManager.getPlan(updated.planId);
    set({ subscription: updated, activePlan: plan });
  },

  checkFeature: (userId, featureKey) => {
    const result = PortfolioBillingEngine.checkFeatureAccess(userId, featureKey);
    return result.allowed;
  },

  resetBillingStore: () => {
    set({
      subscription: null,
      activePlan: null,
      usage: null,
      invoices: [],
      activeCheckoutSession: null,
      loading: false,
      error: null
    });
  }
}));
