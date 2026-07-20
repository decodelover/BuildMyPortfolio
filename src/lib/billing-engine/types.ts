export type PaymentProviderId = "stripe" | "paystack" | "flutterwave";

export type PlanId = "free" | "starter" | "professional" | "business" | "enterprise";

export type BillingInterval = "monthly" | "yearly";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "paused"
  | "expired";

export interface PlanLimits {
  portfoliosCount: number;
  aiCreditsPerMonth: number;
  storageMb: number;
  customDomainsCount: number;
  publishingCountPerMonth: number;
  teamMembersCount: number;
  apiAccess: boolean;
  premiumThemes: boolean;
  removeWatermark: boolean;
}

export interface SubscriptionPlan {
  planId: PlanId;
  name: string;
  description: string;
  monthlyPriceUsd: number;
  yearlyPriceUsd: number;
  currency: string;
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
  trialStart?: string;
  trialEnd?: string;
  customerProviderId: string;
  subscriptionProviderId: string;
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
  periodStart: string;
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
  amount: number; // percentage (e.g. 20) or fixed amount in USD (e.g. 10)
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
