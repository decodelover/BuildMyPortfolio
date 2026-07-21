"use client";

import React, { useState } from "react";
import { useBillingEngineStore } from "@/store/useBillingEngineStore";
import { useAuthStore } from "@/store/useAuthStore";
import { CheckCircle2, Sparkles, X, ArrowUpRight, ShieldCheck } from "lucide-react";
import { PlanId } from "@/lib/billing-engine/types";
import { toast } from "sonner";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function UpgradeModal({
  isOpen,
  onClose,
  title = "Upgrade Your Subscription Plan",
  description = "Unlock higher limits, premium templates, custom domains, and AI generation features.",
}: UpgradeModalProps) {
  const { availablePlans, changePlan } = useBillingEngineStore();
  const { user } = useAuthStore();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPlan = async (planId: PlanId) => {
    if (!user) return;
    setLoadingPlan(planId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      changePlan(user.uid, planId, "monthly");
      toast.success(`Plan updated to ${planId}! Your features have been unlocked.`);
      onClose();
    } catch (_err) {
      toast.error("Failed to update plan tier.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Monetization Tier Matrix</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {availablePlans.map((plan) => {
            const isCurrent = user?.currentPlan === plan.planId;
            const priceDisplay = plan.monthlyPriceUsd === 0 ? "Free" : `$${plan.monthlyPriceUsd}`;

            return (
              <div
                key={plan.planId}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                  plan.isPopular
                    ? "border-primary bg-primary/5 shadow-md relative"
                    : "border-border bg-card/60"
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[9px] font-extrabold uppercase text-primary-foreground tracking-wider shadow">
                    Most Popular
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-foreground">{plan.name}</h3>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-foreground">{priceDisplay}</span>
                    {plan.monthlyPriceUsd > 0 && <span className="text-xs text-muted-foreground font-medium">/ month</span>}
                  </div>

                  <ul className="space-y-2 text-xs pt-2 divide-y divide-border/40">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex gap-2 items-start pt-2 first:pt-0 text-foreground">
                        <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectPlan(plan.planId)}
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
                      <ShieldCheck className="h-3.5 w-3.5" /> Current Plan
                    </span>
                  ) : loadingPlan === plan.planId ? (
                    "Updating..."
                  ) : (
                    <>
                      Select {plan.name}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
