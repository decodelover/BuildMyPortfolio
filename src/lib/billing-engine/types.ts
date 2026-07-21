export type PaymentProviderId = "stripe" | "paystack" | "flutterwave" | "none";

export type PlanId =
  | "FREE"
  | "PRO"
  | "BUSINESS"
  | "free"
  | "starter"
  | "professional"
  | "business"
  | "enterprise";

export type BillingInterval = "monthly" | "yearly";

export type SubscriptionStatus =
  | "free"
  | "trial"
  | "active"
  | "past_due"
  | "grace_period"
  | "cancelled"
  | "expired"
  | "suspended"
  | "pending"
  | "failed"
  | "trialing"
  | "canceled"
  | "unpaid"
  | "paused";

export interface PlanLimits {
  portfoliosCount: number;
  aiCreditsPerMonth: number;
  storageMb: number;
  customDomainsCount: number;
  publishingCountPerMonth: number;
  resumeExportsPerMonth: number;
  teamMembersCount: number;
  apiAccess: boolean;
  premiumThemes: boolean;
  removeWatermark: boolean;
  customBranding: boolean;
  analyticsAccess: "basic" | "advanced" | "enterprise";
  prioritySupport: "community" | "email" | "dedicated_24_7";
}

export interface SubscriptionPlan {
  planId: PlanId;
  name: string;
  description: string;
  monthlyPriceUsd: number;
  yearlyPriceUsd: number;
  currency: string;
  features: string[];
  limits: PlanLimits;
  isPopular?: boolean;
}

export interface UserSubscription {
  subscriptionId: string;
  userId: string;
  planId: PlanId;
  provider: PaymentProviderId;
  status: SubscriptionStatus;
  interval: BillingInterval;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  gracePeriodEnd?: string;
  trialStart?: string;
  trialEnd?: string;
  customerProviderId?: string;
  subscriptionProviderId?: string;
}

export interface FeatureAccessResult {
  allowed: boolean;
  reason?: string;
  currentUsage?: number;
  limit?: number;
}

export interface UserUsageRecord {
  userId: string;
  aiCreditsUsed: number;
  portfoliosCount: number;
  storageMbUsed: number;
  customDomainsCount: number;
  publishingsCount: number;
  resumesExported: number;
  templatesUsedCount: number;
  analyticsViewsCount: number;
  apiRequestsCount: number;
  periodStart: string;
  periodEnd: string;
}

export interface CustomerRecord {
  customerId: string;
  userId: string;
  email: string;
  name: string;
  billingAddress?: {
    line1?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  providerIds?: Partial<Record<PaymentProviderId, string>>;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  paymentId: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: "succeeded" | "failed" | "pending" | "refunded";
  provider: PaymentProviderId;
  providerTransactionId?: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
  quantity: number;
}

export interface Invoice {
  invoiceId: string;
  userId: string;
  subscriptionId: string;
  customerName: string;
  customerEmail: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  status: "paid" | "open" | "void" | "uncollectible";
  pdfUrl?: string;
  createdAt: string;
  dueDate: string;
  paidAt?: string;
}

export interface CheckoutSession {
  sessionId: string;
  userId: string;
  planId: PlanId;
  interval: BillingInterval;
  provider: PaymentProviderId;
  checkoutUrl: string;
  clientSecret?: string;
  expiresAt: string;
}

export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  amount: number;
  validUntil: string;
  maxRedemptions?: number;
  redemptionsCount: number;
  applicablePlans?: PlanId[];
}

export interface RefundRecord {
  refundId: string;
  invoiceId: string;
  userId: string;
  amount: number;
  currency: string;
  reason: string;
  status: "succeeded" | "failed" | "pending";
  processedAt: string;
}

export type BillingEventType =
  | "SubscriptionCreated"
  | "SubscriptionRenewed"
  | "SubscriptionCancelled"
  | "PlanChanged"
  | "UsageReset"
  | "InvoiceGenerated"
  | "PaymentRecorded"
  | "TrialStarted"
  | "TrialEnded"
  | "FeatureUnlocked"
  | "FeatureLocked";

export interface BillingEvent {
  eventId: string;
  userId: string;
  type: BillingEventType;
  payload: Record<string, any>;
  timestamp: string;
}
