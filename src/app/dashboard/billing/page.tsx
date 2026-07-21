"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useBillingEngineStore } from "@/store/useBillingEngineStore";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  CreditCard,
  CheckCircle2,
  Zap,
  ArrowUpRight,
  Download,
  ShieldCheck,
  Building2,
  Sparkles,
  Globe,
  SlidersHorizontal,
} from "lucide-react";
import { PaymentProviderId, PlanId } from "@/lib/billing-engine/types";
import { cn } from "@/lib/utils";

export default function BillingPage() {
  const { user } = useAuthStore();
  const { subscription, availablePlans, initializeCheckout, activateSubscription } = useBillingEngineStore();

  const [activeGateway, setGateway] = useState<PaymentProviderId>("stripe");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const mockInvoices = [
    { id: "INV-2026-001", date: "July 15, 2026", plan: "Professional Plan", amount: "$29.00", status: "Paid" },
    { id: "INV-2026-002", date: "June 15, 2026", plan: "Professional Plan", amount: "$29.00", status: "Paid" },
  ];

  const handleUpgrade = async (planId: PlanId) => {
    if (!user) return;
    setLoadingPlan(planId);
    try {
      const session = await initializeCheckout(user.uid, user.email, planId, "monthly", activeGateway);
      if (session) {
        activateSubscription(user.uid, planId, "monthly", activeGateway, user.fullName || "User", user.email);
        toast.success(`Plan updated to ${planId.toUpperCase()}! Checkout initialized via ${activeGateway.toUpperCase()}.`);
      } else {
        toast.success(`Checkout session created for ${planId.toUpperCase()}!`);
      }
    } catch (err) {
      toast.error("Failed to update subscription plan.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const activePlanId = (subscription?.planId || "professional").toUpperCase();

  return (
    <div className="space-y-8 text-left max-w-6xl">
      {/* Header */}
      <div className="border-b border-border/60 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          <CreditCard className="h-7 w-7 text-primary" /> Billing &amp; Subscriptions
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your enterprise subscription tier, gateway preferences, and itemized invoice history.
        </p>
      </div>

      {/* Active Membership Status Card */}
      <div className="rounded-3xl border border-border/60 bg-gradient-to-r from-card via-card/80 to-primary/10 p-6 sm:p-8 shadow-xl backdrop-blur-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-primary to-accent text-primary-foreground flex items-center justify-center font-bold text-xl shadow-lg shrink-0">
            <Sparkles className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Active Subscription</span>
            <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
              {activePlanId}
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Active Tier
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">Renews on August 15, 2026 via {activeGateway.toUpperCase()}</p>
          </div>
        </div>

        {/* Quotas Overview */}
        <div className="grid grid-cols-2 gap-6 border-t md:border-t-0 md:border-l border-border/60 pt-4 md:pt-0 md:pl-8 w-full md:w-auto">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">AI Credits Quota</span>
            <p className="text-sm font-extrabold text-foreground">850 / 2,500</p>
            <div className="h-1.5 w-28 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "34%" }} />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Custom Domains</span>
            <p className="text-sm font-extrabold text-foreground">1 / 5 Connected</p>
            <div className="h-1.5 w-28 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: "20%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Gateway Provider Selector */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-4 flex items-center justify-between gap-4 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <SlidersHorizontal className="h-4 w-4 text-primary" /> Select Preferred Payment Gateway:
        </div>
        <div className="flex items-center gap-2">
          {(["stripe", "paystack", "flutterwave"] as const).map((gw) => (
            <button
              key={gw}
              type="button"
              onClick={() => setGateway(gw)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer",
                activeGateway === gw
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/40 border border-border/50 text-muted-foreground hover:text-foreground"
              )}
            >
              {gw}
            </button>
          ))}
        </div>
      </div>

      {/* Available Plans Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-foreground">Available Membership Tiers</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availablePlans.slice(1, 4).map((p) => {
            const isCurrent = activePlanId.toLowerCase() === p.planId;
            const priceDisplay = `$${p.monthlyPriceUsd}`;
            return (
              <div
                key={p.planId}
                className={cn(
                  "rounded-3xl border p-6 shadow-sm backdrop-blur-2xl space-y-6 flex flex-col justify-between transition-all relative overflow-hidden",
                  p.isPopular
                    ? "border-primary/50 bg-gradient-to-b from-card to-primary/5 shadow-md"
                    : "border-border/60 bg-card/70"
                )}
              >
                {p.isPopular && (
                  <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-primary text-primary-foreground shadow-xs">
                    Most Popular
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-foreground">{p.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-foreground">{priceDisplay}</span>
                    <span className="text-xs text-muted-foreground font-semibold">/ month</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-muted-foreground font-medium border-t border-border/40 pt-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{p.limits.aiCreditsPerMonth.toLocaleString()} Monthly AI Credits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{p.limits.portfoliosCount === 999999 ? "Unlimited" : p.limits.portfoliosCount} Published Portfolios</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{p.limits.customDomainsCount > 0 ? "Custom Domain SSL Mapping" : "Subdomain Hosting"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{p.limits.removeWatermark ? "No BuildMyPortfolio Branding" : "Standard Branding"}</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  disabled={isCurrent || loadingPlan === p.planId}
                  onClick={() => handleUpgrade(p.planId)}
                  className={cn(
                    "w-full py-3 rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer",
                    isCurrent
                      ? "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                      : p.isPopular
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-95"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  )}
                >
                  {loadingPlan === p.planId ? "Processing..." : isCurrent ? "Active Plan" : `Upgrade to ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice Receipts Table */}
      <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-4">
        <h3 className="text-sm font-bold text-foreground">Billing Invoice History</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium">
            <thead>
              <tr className="border-b border-border/40 text-muted-foreground uppercase text-[10px] tracking-wider">
                <th className="pb-3">Invoice ID</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Plan</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {mockInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 font-bold text-foreground">{inv.id}</td>
                  <td className="py-3 text-muted-foreground">{inv.date}</td>
                  <td className="py-3 font-semibold text-foreground">{inv.plan}</td>
                  <td className="py-3 font-extrabold text-foreground">{inv.amount}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => toast.info(`Downloading PDF receipt for ${inv.id}...`)}
                      className="p-1.5 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Download Invoice PDF"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
