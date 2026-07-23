import { AdminRbacEngine } from "./admin-rbac-engine";
import { AdminUserService } from "./admin-user-service";
import {
  AdminSubscription,
  AdminPaymentTransaction,
  AdminInvoice,
  AdminCoupon,
  FinancialMetrics,
  SubscriptionDirectoryQuery,
  SubscriptionDirectoryResult,
  InvoiceDirectoryQuery,
  InvoiceDirectoryResult,
} from "@/types/admin-billing";
import { SubscriptionPlanType, SubscriptionStatusType } from "@/types/admin-user";

// Seed Datasets for Administrative Billing
const MOCK_SUBSCRIPTIONS_SEED: AdminSubscription[] = [
  {
    id: "sub_1001",
    customerId: "usr_101",
    customerName: "Alex Morgan",
    customerEmail: "alex.morgan@example.com",
    plan: "PRO",
    status: "active",
    billingCycle: "monthly",
    mrrContribution: 29,
    amount: 29,
    currency: "USD",
    startDate: "2026-01-15T08:30:00Z",
    currentPeriodStart: "2026-07-15T08:30:00Z",
    currentPeriodEnd: "2026-08-15T08:30:00Z",
    paymentProvider: "stripe",
    providerSubscriptionId: "sub_str_891230",
    paymentMethod: { type: "card", brand: "Visa", last4: "4242", expiryMonth: 12, expiryYear: 2028 },
    appliedCoupons: [{ couponId: "c_summer", code: "SUMMER20", discountType: "percentage", discountValue: 20, appliedAt: "2026-01-15" }],
    usageSummary: { portfolioCount: 4, publishedCount: 3, resumeCount: 2, storageUsageMB: 450, aiCreditsUsed: 1850, customDomainActive: true },
    eventsTimeline: [
      { id: "evt_1", action: "SUBSCRIPTION_RENEWED", description: "Monthly recurring payment of $29.00 processed via Stripe", timestamp: "2026-07-15T08:30:00Z", amount: 29 },
    ],
  },
  {
    id: "sub_1002",
    customerId: "usr_102",
    customerName: "Sarah Chen",
    customerEmail: "sarah.c@techsolutions.io",
    plan: "BUSINESS",
    status: "active",
    billingCycle: "annual",
    mrrContribution: 99,
    amount: 1188,
    currency: "USD",
    startDate: "2025-11-20T10:12:00Z",
    currentPeriodStart: "2025-11-20T10:12:00Z",
    currentPeriodEnd: "2026-11-20T10:12:00Z",
    paymentProvider: "paystack",
    providerSubscriptionId: "sub_pst_44812",
    paymentMethod: { type: "card", brand: "Mastercard", last4: "8812", expiryMonth: 9, expiryYear: 2027 },
    appliedCoupons: [],
    usageSummary: { portfolioCount: 12, publishedCount: 10, resumeCount: 6, storageUsageMB: 3200, aiCreditsUsed: 9400, customDomainActive: true },
    eventsTimeline: [
      { id: "evt_2", action: "SUBSCRIPTION_CREATED", description: "Annual Business plan subscription created ($1,188/yr)", timestamp: "2025-11-20T10:12:00Z", amount: 1188 },
    ],
  },
  {
    id: "sub_1003",
    customerId: "usr_104",
    customerName: "Elena Rostova",
    customerEmail: "elena.rostova@designstudio.de",
    plan: "PRO",
    status: "past_due",
    billingCycle: "monthly",
    mrrContribution: 29,
    amount: 29,
    currency: "USD",
    startDate: "2026-05-14T15:22:00Z",
    currentPeriodStart: "2026-06-14T15:22:00Z",
    currentPeriodEnd: "2026-07-14T15:22:00Z",
    paymentProvider: "stripe",
    providerSubscriptionId: "sub_str_909112",
    paymentMethod: { type: "card", brand: "Visa", last4: "1102", expiryMonth: 4, expiryYear: 2026 },
    appliedCoupons: [],
    usageSummary: { portfolioCount: 3, publishedCount: 0, resumeCount: 2, storageUsageMB: 680, aiCreditsUsed: 0, customDomainActive: false },
    eventsTimeline: [
      { id: "evt_3", action: "PAYMENT_FAILED", description: "Card charge attempt of $29.00 failed (Card expired)", timestamp: "2026-07-14T15:22:00Z", amount: 29 },
    ],
  },
  {
    id: "sub_1004",
    customerId: "usr_105",
    customerName: "Marcus Vance",
    customerEmail: "marcus.vance@globalcorp.com",
    plan: "ENTERPRISE",
    status: "active",
    billingCycle: "annual",
    mrrContribution: 499,
    amount: 5988,
    currency: "USD",
    startDate: "2025-08-10T11:00:00Z",
    currentPeriodStart: "2025-08-10T11:00:00Z",
    currentPeriodEnd: "2026-08-10T11:00:00Z",
    paymentProvider: "manual",
    paymentMethod: { type: "bank_transfer", brand: "Wire Transfer" },
    appliedCoupons: [],
    usageSummary: { portfolioCount: 25, publishedCount: 22, resumeCount: 15, storageUsageMB: 15400, aiCreditsUsed: 50000, customDomainActive: true },
    eventsTimeline: [
      { id: "evt_4", action: "MANUAL_INVOICE_PAID", description: "Enterprise wire transfer invoice #INV-999 marked paid", timestamp: "2026-07-01T10:00:00Z", amount: 5988 },
    ],
  },
  {
    id: "sub_1005",
    customerId: "usr_108",
    customerName: "Amara Okezie",
    customerEmail: "amara.okezie@fintech.ng",
    plan: "PRO",
    status: "active",
    billingCycle: "monthly",
    mrrContribution: 29,
    amount: 29,
    currency: "USD",
    startDate: "2026-04-05T12:00:00Z",
    currentPeriodStart: "2026-07-05T12:00:00Z",
    currentPeriodEnd: "2026-08-05T12:00:00Z",
    paymentProvider: "paystack",
    paymentMethod: { type: "card", brand: "Mastercard", last4: "5512" },
    appliedCoupons: [],
    usageSummary: { portfolioCount: 5, publishedCount: 4, resumeCount: 3, storageUsageMB: 780, aiCreditsUsed: 3100, customDomainActive: true },
    eventsTimeline: [
      { id: "evt_5", action: "SUBSCRIPTION_RENEWED", description: "Monthly Paystack recurring subscription processed", timestamp: "2026-07-05T12:00:00Z", amount: 29 },
    ],
  },
];

const MOCK_PAYMENTS_SEED: AdminPaymentTransaction[] = [
  {
    id: "tx_901",
    subscriptionId: "sub_1001",
    customerId: "usr_101",
    customerName: "Alex Morgan",
    customerEmail: "alex.morgan@example.com",
    amount: 29.0,
    currency: "USD",
    status: "paid",
    paymentProvider: "stripe",
    providerTransactionId: "ch_3M19x82eZvKYLO2C0Q12",
    description: "Pro Monthly Subscription",
    timestamp: "2026-07-15T08:30:00Z",
    receiptUrl: "#",
  },
  {
    id: "tx_902",
    subscriptionId: "sub_1002",
    customerId: "usr_102",
    customerName: "Sarah Chen",
    customerEmail: "sarah.c@techsolutions.io",
    amount: 99.0,
    currency: "USD",
    status: "paid",
    paymentProvider: "paystack",
    providerTransactionId: "pst_tx_99812",
    description: "Business Plan Subscription",
    timestamp: "2026-07-05T10:00:00Z",
    receiptUrl: "#",
  },
  {
    id: "tx_903",
    subscriptionId: "sub_1003",
    customerId: "usr_104",
    customerName: "Elena Rostova",
    customerEmail: "elena.rostova@designstudio.de",
    amount: 29.0,
    currency: "USD",
    status: "failed",
    paymentProvider: "stripe",
    providerTransactionId: "ch_3M8912eZvKYLO2C99",
    description: "Pro Monthly Renewal Attempt",
    failureReason: "Card expired (do_not_honor)",
    timestamp: "2026-07-14T15:22:00Z",
  },
];

const MOCK_INVOICES_SEED: AdminInvoice[] = [
  {
    id: "inv_2001",
    invoiceNumber: "INV-2026-001",
    subscriptionId: "sub_1001",
    customerId: "usr_101",
    customerName: "Alex Morgan",
    customerEmail: "alex.morgan@example.com",
    amountDue: 29.0,
    amountPaid: 29.0,
    currency: "USD",
    status: "paid",
    dueDate: "2026-07-15",
    paidAt: "2026-07-15T08:30:00Z",
    createdAt: "2026-07-15T08:00:00Z",
    lineItems: [{ id: "li_1", description: "Pro Monthly Subscription", amount: 29.0, quantity: 1 }],
  },
  {
    id: "inv_2002",
    invoiceNumber: "INV-2026-002",
    subscriptionId: "sub_1004",
    customerId: "usr_105",
    customerName: "Marcus Vance",
    customerEmail: "marcus.vance@globalcorp.com",
    amountDue: 5988.0,
    amountPaid: 5988.0,
    currency: "USD",
    status: "paid",
    dueDate: "2026-08-10",
    paidAt: "2026-07-01T10:00:00Z",
    createdAt: "2026-06-25T09:00:00Z",
    lineItems: [{ id: "li_2", description: "Enterprise Platform License (Annual)", amount: 5988.0, quantity: 1 }],
  },
  {
    id: "inv_2003",
    invoiceNumber: "INV-2026-003",
    subscriptionId: "sub_1003",
    customerId: "usr_104",
    customerName: "Elena Rostova",
    customerEmail: "elena.rostova@designstudio.de",
    amountDue: 29.0,
    amountPaid: 0.0,
    currency: "USD",
    status: "open",
    dueDate: "2026-07-14",
    createdAt: "2026-07-14T00:00:00Z",
    lineItems: [{ id: "li_3", description: "Pro Monthly Subscription (Overdue)", amount: 29.0, quantity: 1 }],
  },
];

const MOCK_COUPONS_SEED: AdminCoupon[] = [
  {
    id: "c_summer20",
    code: "SUMMER20",
    discountType: "percentage",
    discountValue: 20,
    duration: "forever",
    redemptionsCount: 45,
    maxRedemptions: 100,
    validUntil: "2026-09-01",
    isActive: true,
    createdAt: "2026-05-01",
  },
  {
    id: "c_launch50",
    code: "LAUNCH50",
    discountType: "percentage",
    discountValue: 50,
    duration: "once",
    redemptionsCount: 200,
    maxRedemptions: 200,
    validUntil: "2026-06-01",
    isActive: false,
    createdAt: "2026-01-01",
  },
  {
    id: "c_vip100",
    code: "VIPCREDIT15",
    discountType: "fixed_amount",
    discountValue: 15,
    duration: "once",
    redemptionsCount: 12,
    validUntil: "2026-12-31",
    isActive: true,
    createdAt: "2026-03-15",
  },
];

export class AdminBillingService {
  private static subscriptionsStore: AdminSubscription[] = [...MOCK_SUBSCRIPTIONS_SEED];
  private static paymentsStore: AdminPaymentTransaction[] = [...MOCK_PAYMENTS_SEED];
  private static invoicesStore: AdminInvoice[] = [...MOCK_INVOICES_SEED];
  private static couponsStore: AdminCoupon[] = [...MOCK_COUPONS_SEED];

  // Helper log audit event
  private static logFinancialAudit(
    adminRole: string,
    adminId: string,
    action: string,
    details: string,
    targetUserId?: string,
    targetUserEmail?: string,
    previousValue?: any,
    newValue?: any,
    ipAddress: string = "127.0.0.1"
  ) {
    return AdminUserService.logAudit(
      adminRole,
      adminId,
      `BILLING_${action}`,
      details,
      targetUserId,
      targetUserEmail,
      previousValue,
      newValue,
      ipAddress
    );
  }

  // Get Subscriptions Directory
  public static async getSubscriptions(query: SubscriptionDirectoryQuery): Promise<SubscriptionDirectoryResult> {
    let filtered = [...this.subscriptionsStore];

    if (query.search && query.search.trim()) {
      const q = query.search.toLowerCase().trim();
      filtered = filtered.filter(
        (s) =>
          s.customerName.toLowerCase().includes(q) ||
          s.customerEmail.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.customerId.toLowerCase().includes(q) ||
          (s.providerSubscriptionId && s.providerSubscriptionId.toLowerCase().includes(q))
      );
    }

    if (query.status && query.status !== "ALL") {
      filtered = filtered.filter((s) => s.status.toLowerCase() === query.status?.toLowerCase());
    }

    if (query.plan && query.plan !== "ALL") {
      filtered = filtered.filter((s) => s.plan.toUpperCase() === query.plan?.toUpperCase());
    }

    if (query.paymentProvider && query.paymentProvider !== "ALL") {
      filtered = filtered.filter((s) => s.paymentProvider.toLowerCase() === query.paymentProvider?.toLowerCase());
    }

    if (query.billingCycle && query.billingCycle !== "ALL") {
      filtered = filtered.filter((s) => s.billingCycle.toLowerCase() === query.billingCycle?.toLowerCase());
    }

    // Sort
    const sortBy = query.sortBy || "currentPeriodEnd";
    const sortOrder = query.sortOrder || "asc";
    filtered.sort((a, b) => {
      let valA: any = a[sortBy as keyof AdminSubscription] ?? "";
      let valB: any = b[sortBy as keyof AdminSubscription] ?? "";
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const total = filtered.length;
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, query.limit || 10);
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    const stats = {
      totalMRR: this.subscriptionsStore
        .filter((s) => s.status === "active")
        .reduce((sum, s) => sum + s.mrrContribution, 0),
      activeCount: this.subscriptionsStore.filter((s) => s.status === "active").length,
      pastDueCount: this.subscriptionsStore.filter((s) => s.status === "past_due").length,
      canceledCount: this.subscriptionsStore.filter((s) => s.status === "canceled").length,
      trialingCount: this.subscriptionsStore.filter((s) => s.status === "trialing").length,
    };

    return { subscriptions: paginated, total, page, limit, totalPages, stats };
  }

  // Get Single Subscription by ID
  public static async getSubscriptionById(subscriptionId: string): Promise<AdminSubscription | null> {
    const sub = this.subscriptionsStore.find((s) => s.id === subscriptionId);
    return sub ? { ...sub } : null;
  }

  // Upgrade Plan
  public static async upgradeSubscription(
    adminRole: string,
    adminId: string,
    subscriptionId: string,
    newPlan: SubscriptionPlanType,
    ipAddress?: string
  ) {
    if (!AdminRbacEngine.canManageSubscriptions(adminRole)) {
      throw new Error("Forbidden: Insufficient permissions to change subscriptions.");
    }

    const sub = this.subscriptionsStore.find((s) => s.id === subscriptionId);
    if (!sub) throw new Error("Subscription not found.");

    const prevPlan = sub.plan;
    sub.plan = newPlan;
    sub.mrrContribution = newPlan === "PRO" ? 29 : newPlan === "BUSINESS" ? 99 : 499;

    sub.eventsTimeline.unshift({
      id: `evt_${Date.now()}`,
      action: "UPGRADE_PLAN",
      description: `Upgraded subscription from ${prevPlan} to ${newPlan}`,
      timestamp: new Date().toISOString(),
      performedByAdmin: adminId,
    });

    this.logFinancialAudit(
      adminRole,
      adminId,
      "UPGRADE_PLAN",
      `Upgraded subscription to ${newPlan}`,
      sub.customerId,
      sub.customerEmail,
      prevPlan,
      newPlan,
      ipAddress
    );

    return { success: true, subscription: { ...sub } };
  }

  // Downgrade Plan
  public static async downgradeSubscription(
    adminRole: string,
    adminId: string,
    subscriptionId: string,
    newPlan: SubscriptionPlanType,
    ipAddress?: string
  ) {
    if (!AdminRbacEngine.canManageSubscriptions(adminRole)) {
      throw new Error("Forbidden: Insufficient permissions.");
    }

    const sub = this.subscriptionsStore.find((s) => s.id === subscriptionId);
    if (!sub) throw new Error("Subscription not found.");

    const prevPlan = sub.plan;
    sub.plan = newPlan;
    sub.mrrContribution = newPlan === "FREE" ? 0 : newPlan === "PRO" ? 29 : 99;

    sub.eventsTimeline.unshift({
      id: `evt_${Date.now()}`,
      action: "DOWNGRADE_PLAN",
      description: `Downgraded subscription from ${prevPlan} to ${newPlan}`,
      timestamp: new Date().toISOString(),
      performedByAdmin: adminId,
    });

    this.logFinancialAudit(
      adminRole,
      adminId,
      "DOWNGRADE_PLAN",
      `Downgraded subscription to ${newPlan}`,
      sub.customerId,
      sub.customerEmail,
      prevPlan,
      newPlan,
      ipAddress
    );

    return { success: true, subscription: { ...sub } };
  }

  // Pause Subscription
  public static async pauseSubscription(
    adminRole: string,
    adminId: string,
    subscriptionId: string,
    durationMonths: number = 1,
    ipAddress?: string
  ) {
    if (!AdminRbacEngine.canManageSubscriptions(adminRole)) throw new Error("Forbidden.");

    const sub = this.subscriptionsStore.find((s) => s.id === subscriptionId);
    if (!sub) throw new Error("Subscription not found.");

    const prevStatus = sub.status;
    sub.status = "canceled";

    sub.eventsTimeline.unshift({
      id: `evt_${Date.now()}`,
      action: "PAUSE_SUBSCRIPTION",
      description: `Paused subscription for ${durationMonths} months`,
      timestamp: new Date().toISOString(),
      performedByAdmin: adminId,
    });

    this.logFinancialAudit(
      adminRole,
      adminId,
      "PAUSE_SUBSCRIPTION",
      `Paused subscription for ${durationMonths} month(s)`,
      sub.customerId,
      sub.customerEmail,
      prevStatus,
      "paused",
      ipAddress
    );

    return { success: true, subscription: { ...sub } };
  }

  // Cancel Subscription
  public static async cancelSubscription(
    adminRole: string,
    adminId: string,
    subscriptionId: string,
    reason: string,
    ipAddress?: string
  ) {
    if (!AdminRbacEngine.canManageSubscriptions(adminRole)) throw new Error("Forbidden.");

    const sub = this.subscriptionsStore.find((s) => s.id === subscriptionId);
    if (!sub) throw new Error("Subscription not found.");

    const prevStatus = sub.status;
    sub.status = "canceled";
    sub.canceledAt = new Date().toISOString();

    sub.eventsTimeline.unshift({
      id: `evt_${Date.now()}`,
      action: "CANCEL_SUBSCRIPTION",
      description: `Canceled subscription. Reason: ${reason}`,
      timestamp: new Date().toISOString(),
      performedByAdmin: adminId,
    });

    this.logFinancialAudit(
      adminRole,
      adminId,
      "CANCEL_SUBSCRIPTION",
      `Canceled subscription. Reason: ${reason}`,
      sub.customerId,
      sub.customerEmail,
      prevStatus,
      "canceled",
      ipAddress
    );

    return { success: true, subscription: { ...sub } };
  }

  // Grant Complimentary Access
  public static async grantCompAccess(
    adminRole: string,
    adminId: string,
    subscriptionId: string,
    targetPlan: SubscriptionPlanType,
    reason: string,
    ipAddress?: string
  ) {
    if (!AdminRbacEngine.canManageSubscriptions(adminRole)) throw new Error("Forbidden.");

    const sub = this.subscriptionsStore.find((s) => s.id === subscriptionId);
    if (!sub) throw new Error("Subscription not found.");

    sub.plan = targetPlan;
    sub.status = "active";
    sub.compAccessGrantedBy = adminId;
    sub.compAccessReason = reason;

    sub.eventsTimeline.unshift({
      id: `evt_${Date.now()}`,
      action: "GRANT_COMP_ACCESS",
      description: `Granted complimentary ${targetPlan} plan access. Reason: ${reason}`,
      timestamp: new Date().toISOString(),
      performedByAdmin: adminId,
    });

    this.logFinancialAudit(
      adminRole,
      adminId,
      "GRANT_COMP_ACCESS",
      `Granted complimentary ${targetPlan} access. Reason: ${reason}`,
      sub.customerId,
      sub.customerEmail,
      sub.plan,
      targetPlan,
      ipAddress
    );

    return { success: true, subscription: { ...sub } };
  }

  // Issue Refund
  public static async issueRefund(
    adminRole: string,
    adminId: string,
    subscriptionId: string,
    amount: number,
    reason: string,
    ipAddress?: string
  ) {
    if (!AdminRbacEngine.canManageSubscriptions(adminRole)) throw new Error("Forbidden.");

    const sub = this.subscriptionsStore.find((s) => s.id === subscriptionId);
    if (!sub) throw new Error("Subscription not found.");

    const refundTx: AdminPaymentTransaction = {
      id: `ref_${Date.now()}`,
      subscriptionId,
      customerId: sub.customerId,
      customerName: sub.customerName,
      customerEmail: sub.customerEmail,
      amount,
      currency: sub.currency,
      status: "refunded",
      paymentProvider: sub.paymentProvider,
      providerTransactionId: `rf_${Math.random().toString(36).substring(2, 9)}`,
      description: `Refund for subscription ${subscriptionId}. Reason: ${reason}`,
      refundedAmount: amount,
      timestamp: new Date().toISOString(),
    };

    this.paymentsStore.unshift(refundTx);

    sub.eventsTimeline.unshift({
      id: `evt_${Date.now()}`,
      action: "ISSUE_REFUND",
      description: `Issued refund of $${amount.toFixed(2)}. Reason: ${reason}`,
      timestamp: new Date().toISOString(),
      performedByAdmin: adminId,
      amount,
    });

    this.logFinancialAudit(
      adminRole,
      adminId,
      "ISSUE_REFUND",
      `Issued refund of $${amount.toFixed(2)}. Reason: ${reason}`,
      sub.customerId,
      sub.customerEmail,
      null,
      { refundAmount: amount, reason },
      ipAddress
    );

    return { success: true, refundTransaction: refundTx };
  }

  // Invoices & Payments Query
  public static async getInvoices(query: InvoiceDirectoryQuery): Promise<InvoiceDirectoryResult> {
    let filtered = [...this.invoicesStore];
    if (query.search && query.search.trim()) {
      const q = query.search.toLowerCase().trim();
      filtered = filtered.filter(
        (i) =>
          i.customerName.toLowerCase().includes(q) ||
          i.customerEmail.toLowerCase().includes(q) ||
          i.invoiceNumber.toLowerCase().includes(q)
      );
    }
    if (query.status && query.status !== "ALL") {
      filtered = filtered.filter((i) => i.status.toLowerCase() === query.status?.toLowerCase());
    }

    const total = filtered.length;
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, query.limit || 10);
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return { invoices: paginated, total, page, limit, totalPages };
  }

  public static async markInvoicePaid(adminRole: string, adminId: string, invoiceId: string, ipAddress?: string) {
    if (!AdminRbacEngine.canManageSubscriptions(adminRole)) throw new Error("Forbidden.");

    const inv = this.invoicesStore.find((i) => i.id === invoiceId);
    if (!inv) throw new Error("Invoice not found.");

    inv.status = "paid";
    inv.amountPaid = inv.amountDue;
    inv.paidAt = new Date().toISOString();

    this.logFinancialAudit(
      adminRole,
      adminId,
      "MARK_INVOICE_PAID",
      `Manually marked invoice ${inv.invoiceNumber} as paid ($${inv.amountDue})`,
      inv.customerId,
      inv.customerEmail,
      "open",
      "paid",
      ipAddress
    );

    return { success: true, invoice: { ...inv } };
  }

  public static async getPayments(): Promise<AdminPaymentTransaction[]> {
    return [...this.paymentsStore];
  }

  public static async getCoupons(): Promise<AdminCoupon[]> {
    return [...this.couponsStore];
  }

  public static async createCoupon(adminRole: string, adminId: string, couponData: Partial<AdminCoupon>, ipAddress?: string) {
    if (!AdminRbacEngine.canManageSubscriptions(adminRole)) throw new Error("Forbidden.");

    const newCoupon: AdminCoupon = {
      id: `c_${Date.now()}`,
      code: (couponData.code || "PROMO").toUpperCase().trim(),
      discountType: couponData.discountType || "percentage",
      discountValue: couponData.discountValue || 10,
      duration: couponData.duration || "once",
      redemptionsCount: 0,
      maxRedemptions: couponData.maxRedemptions || 100,
      validUntil: couponData.validUntil || undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    this.couponsStore.unshift(newCoupon);

    this.logFinancialAudit(
      adminRole,
      adminId,
      "CREATE_COUPON",
      `Created promo coupon code ${newCoupon.code}`,
      undefined,
      undefined,
      null,
      newCoupon,
      ipAddress
    );

    return { success: true, coupon: newCoupon };
  }

  // Financial Metrics Analytics
  public static async getFinancialMetrics(): Promise<FinancialMetrics> {
    const activeSubs = this.subscriptionsStore.filter((s) => s.status === "active");
    const totalMRR = activeSubs.reduce((sum, s) => sum + s.mrrContribution, 0);
    const totalARR = totalMRR * 12;

    const netRev = this.paymentsStore
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0);

    const refunds = this.paymentsStore
      .filter((p) => p.status === "refunded")
      .reduce((sum, p) => sum + (p.refundedAmount || p.amount), 0);

    const outstanding = this.invoicesStore
      .filter((i) => i.status === "open")
      .reduce((sum, i) => sum + (i.amountDue - i.amountPaid), 0);

    const revPlan: Record<SubscriptionPlanType, number> = { FREE: 0, PRO: 0, BUSINESS: 0, ENTERPRISE: 0 };
    activeSubs.forEach((s) => {
      revPlan[s.plan] = (revPlan[s.plan] || 0) + s.mrrContribution;
    });

    const revProvider: Record<string, number> = { stripe: 0, paystack: 0, paypal: 0, manual: 0 };
    activeSubs.forEach((s) => {
      revProvider[s.paymentProvider] = (revProvider[s.paymentProvider] || 0) + s.mrrContribution;
    });

    return {
      mrr: totalMRR,
      arr: totalARR,
      netRevenue: netRev,
      outstandingPayments: outstanding,
      refundTotals: refunds,
      activeSubscriptionsCount: activeSubs.length,
      trialingCount: this.subscriptionsStore.filter((s) => s.status === "trialing").length,
      canceledCount: this.subscriptionsStore.filter((s) => s.status === "canceled").length,
      churnRatePercentage: 2.4,
      revenueByPlan: revPlan,
      revenueByProvider: revProvider as any,
      monthlyGrowthTrend: [
        { month: "Feb 2026", mrr: 450, newSubscriptions: 12, churned: 1 },
        { month: "Mar 2026", mrr: 520, newSubscriptions: 18, churned: 2 },
        { month: "Apr 2026", mrr: 610, newSubscriptions: 22, churned: 1 },
        { month: "May 2026", mrr: 680, newSubscriptions: 15, churned: 3 },
        { month: "Jun 2026", mrr: 750, newSubscriptions: 25, churned: 2 },
        { month: "Jul 2026", mrr: totalMRR, newSubscriptions: 30, churned: 2 },
      ],
    };
  }
}
