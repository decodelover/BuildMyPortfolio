import { SubscriptionPlanType, SubscriptionStatusType } from "./admin-user";

export type PaymentProviderType = "stripe" | "paystack" | "paypal" | "manual";

export type TransactionStatusType = "paid" | "failed" | "pending" | "refunded" | "chargeback";

export type InvoiceStatusType = "draft" | "open" | "paid" | "uncollectible" | "void";

export type CouponDiscountType = "percentage" | "fixed_amount";

export interface PaymentMethodInfo {
  type: "card" | "bank_transfer" | "paypal" | "apple_pay";
  brand?: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface AppliedCouponInfo {
  couponId: string;
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  appliedAt: string;
}

export interface SubscriptionBillingEvent {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  performedByAdmin?: string;
  amount?: number;
}

export interface AdminSubscription {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  plan: SubscriptionPlanType;
  status: SubscriptionStatusType;
  billingCycle: "monthly" | "annual";
  mrrContribution: number;
  amount: number;
  currency: string;
  startDate: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  canceledAt?: string;
  endedAt?: string;
  trialStart?: string;
  trialEnd?: string;
  paymentProvider: PaymentProviderType;
  providerSubscriptionId?: string;
  paymentMethod: PaymentMethodInfo;
  appliedCoupons: AppliedCouponInfo[];
  referralCode?: string;
  compAccessGrantedBy?: string;
  compAccessReason?: string;
  usageSummary: {
    portfolioCount: number;
    publishedCount: number;
    resumeCount: number;
    storageUsageMB: number;
    aiCreditsUsed: number;
    customDomainActive: boolean;
  };
  eventsTimeline: SubscriptionBillingEvent[];
}

export interface AdminPaymentTransaction {
  id: string;
  subscriptionId?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  status: TransactionStatusType;
  paymentProvider: PaymentProviderType;
  providerTransactionId: string;
  description: string;
  failureReason?: string;
  refundedAmount?: number;
  timestamp: string;
  receiptUrl?: string;
}

export interface AdminInvoiceLineItem {
  id: string;
  description: string;
  amount: number;
  quantity: number;
}

export interface AdminInvoice {
  id: string;
  invoiceNumber: string;
  subscriptionId?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  amountDue: number;
  amountPaid: number;
  currency: string;
  status: InvoiceStatusType;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
  lineItems: AdminInvoiceLineItem[];
  pdfUrl?: string;
  creditNotes?: Array<{ id: string; amount: number; reason: string; issuedAt: string }>;
}

export interface AdminCoupon {
  id: string;
  code: string;
  discountType: CouponDiscountType;
  discountValue: number; // e.g. 20 for 20% or 15 for $15 off
  duration: "once" | "repeating" | "forever";
  durationInMonths?: number;
  redemptionsCount: number;
  maxRedemptions?: number;
  validUntil?: string;
  isActive: boolean;
  createdAt: string;
}

export interface FinancialMetrics {
  mrr: number;
  arr: number;
  netRevenue: number;
  outstandingPayments: number;
  refundTotals: number;
  activeSubscriptionsCount: number;
  trialingCount: number;
  canceledCount: number;
  churnRatePercentage: number;
  revenueByPlan: Record<SubscriptionPlanType, number>;
  revenueByProvider: Record<PaymentProviderType, number>;
  monthlyGrowthTrend: Array<{ month: string; mrr: number; newSubscriptions: number; churned: number }>;
}

export interface SubscriptionDirectoryQuery {
  search?: string;
  status?: string;
  plan?: string;
  paymentProvider?: string;
  billingCycle?: string;
  renewalRange?: "all" | "7d" | "30d" | "overdue";
  sortBy?: "customerName" | "mrrContribution" | "currentPeriodEnd" | "startDate" | "plan";
  sortOrder?: "asc" | "desc";
  page: number;
  limit: number;
}

export interface SubscriptionDirectoryResult {
  subscriptions: AdminSubscription[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: {
    totalMRR: number;
    activeCount: number;
    pastDueCount: number;
    canceledCount: number;
    trialingCount: number;
  };
}

export interface InvoiceDirectoryQuery {
  search?: string;
  status?: string;
  page: number;
  limit: number;
}

export interface InvoiceDirectoryResult {
  invoices: AdminInvoice[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
