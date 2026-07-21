"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { auth } from "@/lib/firebase/auth";
import { useBillingEngineStore } from "@/store/useBillingEngineStore";
import { UsageProgressBar } from "@/components/dashboard/usage-progress-bar";
import { UpgradeModal } from "@/components/shared/upgrade-modal";
import { toast } from "sonner";
import { CreditCard, CheckCircle2, ArrowUpRight, Download, Calendar, ShieldCheck, Sparkles } from "lucide-react";
import { PlanId } from "@/lib/billing-engine/types";

export default function BillingPage() {
  const { user } = useAuthStore();
  const {
    subscription,
    activePlan,
    invoices,
    availablePlans,
    loadUserBillingState,
  } = useBillingEngineStore();

  const searchParams = useSearchParams();
  const router = useRouter();

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

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
        } catch (err) {
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
          interval: "monthly",
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

  const formattedPeriodEnd = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Lifetime Active";

  return (
    <div className="space-y-8 text-left max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight">Billing &amp; Subscription</h1>
          <p className="text-sm text-muted-foreground">
            Manage your Paystack subscription membership, usage limits, and payment receipts.
          </p>
        </div>

        <button
          onClick={() => setIsUpgradeModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all self-start md:self-auto"
        >
          <Sparkles className="h-4 w-4" />
          Compare Subscription Plans
        </button>
      </div>

      {/* Current Plan Card */}
      <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="flex gap-4 items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground">Current Membership Level</span>
            <div className="flex items-center gap-2 mt-0.5">
              <h2 className="text-xl font-black text-foreground">{activePlan?.name || "FREE"}</h2>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-extrabold text-primary uppercase border border-primary/20">
                {subscription?.provider === "paystack" ? "Paystack Active" : subscription?.status || "active"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-muted-foreground border-t md:border-t-0 border-border pt-4 md:pt-0">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary shrink-0" />
            <div>
              <span className="block font-semibold">Billing Cycle Renewal</span>
              <span className="text-foreground font-bold">{formattedPeriodEnd}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Progress Bar Section */}
      <UsageProgressBar />

      {/* Subscription Plans Comparison */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-foreground">Available Subscription Plans</h3>
          <p className="text-xs text-muted-foreground">
            Select the plan tier that best matches your portfolio and client management workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availablePlans.map((plan) => {
            const isCurrent = (subscription?.planId || "FREE").toUpperCase() === plan.planId;
            const priceDisplay = plan.monthlyPriceUsd === 0 ? "Free" : `$${plan.monthlyPriceUsd}`;

            return (
              <div
                key={plan.planId}
                className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                  plan.isPopular
                    ? "border-primary bg-primary/5 shadow-md relative"
                    : "border-border bg-card/60"
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[9px] font-extrabold uppercase text-primary-foreground tracking-wider shadow">
                    Recommended
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-foreground text-base">{plan.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-foreground">{priceDisplay}</span>
                    {plan.monthlyPriceUsd > 0 && <span className="text-xs text-muted-foreground font-medium">/ month</span>}
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
                      <ShieldCheck className="h-3.5 w-3.5" /> Current Active Tier
                    </span>
                  ) : loadingPlan === plan.planId ? (
                    "Connecting..."
                  ) : (
                    <>
                      Pay via Paystack ({plan.name})
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Invoice History */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Payment Invoice History</h3>

        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="p-4">Invoice ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Plan Description</th>
                <th className="p-4">Amount</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs text-muted-foreground divide-y divide-border/60">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    No billing invoices generated yet. Free tier account.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
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
                    <td className="p-4 text-foreground font-semibold">${inv.total}.00</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => toast.success(`Downloading PDF receipt for invoice ${inv.invoiceId}...`)}
                        className="inline-flex items-center gap-1.5 hover:text-primary transition-colors font-bold"
                      >
                        <Download className="h-3.5 w-3.5" />
                        PDF
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
