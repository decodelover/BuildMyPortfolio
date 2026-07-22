"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { auth } from "@/lib/firebase/auth";
import { useBillingEngineStore } from "@/store/useBillingEngineStore";
import { UsageProgressBar } from "@/components/dashboard/usage-progress-bar";
import { PaymentMethodCard } from "@/components/dashboard/payment-method-card";
import { BillingTimeline } from "@/components/dashboard/billing-timeline";
import { PromotionBanner } from "@/components/dashboard/promotion-banner";
import { CouponInput } from "@/components/dashboard/coupon-input";
import { ReferralDashboard } from "@/components/dashboard/referral-dashboard";
import { UpgradeModal } from "@/components/shared/upgrade-modal";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  CreditCard,
  CheckCircle2,
  ArrowUpRight,
  Download,
  Calendar,
  ShieldCheck,
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  Zap,
} from "lucide-react";
import { PlanId, BillingInterval } from "@/lib/billing-engine/types";

export default function BillingPage() {
  const { user } = useAuthStore();
  const {
    subscription,
    activePlan,
    invoices,
    availablePlans,
    loadUserBillingState,
    cancelSubscription,
  } = useBillingEngineStore();

  const searchParams = useSearchParams();
  const router = useRouter();

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingInterval>("monthly");

  // Search & Filter state for invoices
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (user?.uid) {
      loadUserBillingState(user.uid);
    }
  }, [user?.uid, loadUserBillingState]);

  // Handle Paystack payment redirect verification callback
  useEffect(() => {
    const reference = searchParams.get("reference") || searchParams.get("paystack_ref");
    const planId = searchParams.get("planId") || "PRO";
    const interval = searchParams.get("interval") || "monthly";

    if (reference && user) {
      const verifyPaystackPayment = async () => {
        try {
          toast.loading("Verifying Paystack transaction status...");
          const idToken = await auth.currentUser?.getIdToken();

          const response = await fetch("/api/billing/paystack/verify", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${idToken || ""}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ reference, planId, interval }),
          });

          const data = await response.json();
          toast.dismiss();

          if (data.status === "success") {
            toast.success("Payment verified! Subscription activated successfully.");
            loadUserBillingState(user.uid);
            router.replace("/dashboard/billing");
          } else {
            toast.error(data.error || "Payment verification failed.");
          }
        } catch (_err) {
          toast.dismiss();
          toast.error("Failed to complete Paystack payment verification.");
        }
      };

      verifyPaystackPayment();
    }
  }, [searchParams, user, loadUserBillingState, router]);

  const handleUpgrade = async (planId: PlanId) => {
    if (!user) return;
    setLoadingPlan(planId);
    try {
      if (planId === "FREE") {
        toast.info("Free plan is already active.");
        return;
      }

      const idToken = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/billing/paystack/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken || ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          interval: billingCycle,
          email: user.email,
        }),
      });

      const data = await response.json();
      if (data.session?.checkoutUrl) {
        toast.success("Redirecting to Paystack payment portal...");
        window.location.assign(data.session.checkoutUrl);
      }
    } catch (_err) {
      toast.error("Failed to initiate Paystack payment checkout.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleCancelSubscription = () => {
    if (!user) return;
    if (confirm("Are you sure you want to request cancellation for your active subscription? You will retain access until period end.")) {
      cancelSubscription(user.uid, false);
      toast.success("Subscription cancellation scheduled for period end.");
    }
  };

  const formattedPeriodEnd = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Lifetime Active";

  // Filtered invoices based on search query and status filter
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        inv.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inv.items[0]?.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  return (
    <div className="space-y-8 text-left max-w-6xl mx-auto">
      {/* Active Promotion Marketing Banner */}
      <PromotionBanner onUpgradeClick={() => setIsUpgradeModalOpen(true)} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            Billing &amp; Subscription Portal
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your plan level, payment provider, usage capacity, invoices, and transaction logs.
          </p>
        </div>

        <button
          onClick={() => setIsUpgradeModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-all self-start md:self-auto"
        >
          <Sparkles className="h-4 w-4" />
          Compare Subscription Plans
        </button>
      </div>

      {/* Hero Overview Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-3xl border border-border bg-gradient-to-r from-primary/10 via-card to-background p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm relative overflow-hidden"
      >
        <div className="flex gap-5 items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary border border-primary/30 shadow-sm shrink-0">
            <CreditCard className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Membership</span>
              <span className="rounded-full bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 text-[9px] font-extrabold uppercase border border-emerald-500/20">
                {subscription?.provider === "paystack" ? "Paystack Active" : subscription?.status || "active"}
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl sm:text-3xl font-black text-foreground">{activePlan?.name || "FREE"}</h2>
              <span className="text-sm font-bold text-primary">
                {activePlan?.monthlyPriceUsd === 0 ? "Free Plan" : `$${activePlan?.monthlyPriceUsd}/month`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground border-t lg:border-t-0 border-border pt-4 lg:pt-0">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary shrink-0" />
            <div>
              <span className="block font-semibold">Cycle Renewal Date</span>
              <span className="text-foreground font-bold">{formattedPeriodEnd}</span>
            </div>
          </div>

          {activePlan?.planId !== "FREE" && (
            <button
              onClick={handleCancelSubscription}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors underline underline-offset-4"
            >
              Cancel Subscription
            </button>
          )}
        </div>
      </motion.div>

      {/* Usage Quotas Section */}
      <UsageProgressBar />

      {/* Payment Method & Event Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PaymentMethodCard
          providerId={subscription?.provider || "paystack"}
          customerEmail={user?.email || undefined}
          onManageClick={() => setIsUpgradeModalOpen(true)}
        />
        <BillingTimeline
          invoices={invoices}
          currentPlanName={activePlan?.name}
          periodEnd={formattedPeriodEnd}
        />
      </div>

      {/* Referral Rewards Program Section */}
      <ReferralDashboard />

      {/* Subscription Plans & Cycle Switcher */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">Available Subscription Plans</h3>
            <p className="text-xs text-muted-foreground">Select the plan level that best aligns with your portfolio goals.</p>
          </div>

          {/* Monthly vs Yearly Billing Toggle */}
          <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-xl border border-border self-start sm:self-auto">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                billingCycle === "monthly" ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === "yearly" ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly Billing
              <span className="bg-primary/20 text-primary text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availablePlans.map((plan) => {
            const isCurrent = (subscription?.planId || "FREE").toUpperCase() === plan.planId;
            const price = billingCycle === "yearly" ? plan.yearlyPriceUsd : plan.monthlyPriceUsd;
            const priceDisplay = price === 0 ? "Free" : `$${price}`;

            return (
              <motion.div
                key={plan.planId}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`rounded-3xl border p-6 flex flex-col justify-between transition-all ${
                  plan.isPopular
                    ? "border-primary bg-primary/5 shadow-lg relative"
                    : "border-border bg-card/60"
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[9px] font-extrabold uppercase text-primary-foreground tracking-wider shadow">
                    Recommended Tier
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-foreground text-base">{plan.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-foreground">{priceDisplay}</span>
                    {price > 0 && <span className="text-xs text-muted-foreground font-medium">/ {billingCycle}</span>}
                  </div>

                  <ul className="space-y-2.5 pt-2 text-xs divide-y divide-border/40">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex gap-2 items-start pt-2 first:pt-0 text-foreground">
                        <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleUpgrade(plan.planId)}
                  disabled={isCurrent || loadingPlan !== null}
                  className={`w-full rounded-xl py-2.5 text-xs font-semibold shadow transition-all mt-6 flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? "bg-secondary text-muted-foreground cursor-default border border-border"
                      : plan.isPopular
                      ? "bg-primary text-primary-foreground hover:bg-primary/95"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {isCurrent ? (
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" /> Active Plan Tier
                    </span>
                  ) : loadingPlan === plan.planId ? (
                    <span className="flex items-center gap-1">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Connecting...
                    </span>
                  ) : (
                    <>
                      Pay via Paystack ({plan.name})
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Payment Invoice & Transaction History Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">Payment Invoice &amp; Receipt Records</h3>
            <p className="text-xs text-muted-foreground">Search and filter your complete payment transaction history.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl border border-border bg-card px-3 py-1.5 pl-9 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary w-44"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative flex items-center">
              <Filter className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-border bg-card px-3 py-1.5 pl-8 text-xs text-foreground focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="open">Pending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="p-4">Invoice Reference</th>
                <th className="p-4">Date</th>
                <th className="p-4">Plan Description</th>
                <th className="p-4">Status</th>
                <th className="p-4">Amount</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs text-muted-foreground divide-y divide-border/60">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-muted-foreground">
                    No matching payment invoice records found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.invoiceId} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-bold text-foreground">{inv.invoiceId}</td>
                    <td className="p-4">
                      {new Date(inv.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4">{inv.items[0]?.description || "Subscription"}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-emerald-500/10 text-emerald-500 px-2 py-0.5 text-[9px] font-bold uppercase border border-emerald-500/20">
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-foreground font-semibold">${inv.total}.00</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => toast.success(`Downloading PDF receipt for invoice ${inv.invoiceId}...`)}
                        className="inline-flex items-center gap-1.5 hover:text-primary transition-colors font-bold text-xs"
                      >
                        <Download className="h-3.5 w-3.5" />
                        PDF Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade Dialog */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
}
