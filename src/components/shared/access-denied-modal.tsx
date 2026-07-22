"use client";

import React from "react";
import { Lock, Sparkles, X, ShieldAlert, ArrowUpRight } from "lucide-react";
import { PlanId } from "@/lib/billing-engine/types";
import { useRouter } from "next/navigation";

interface AccessDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
  requiredPlan?: PlanId;
  reason?: string;
}

export function AccessDeniedModal({
  isOpen,
  onClose,
  featureName = "Premium Feature",
  requiredPlan = "PRO",
  reason = "This feature requires a PRO or BUSINESS tier subscription plan.",
}: AccessDeniedModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    onClose();
    router.push("/dashboard/billing");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6 text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-amber-500 tracking-wider">Access Restricted</span>
            <h3 className="text-lg font-bold text-foreground">{featureName}</h3>
          </div>
        </div>

        {/* Reason Box */}
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <ShieldAlert className="h-4 w-4 text-primary shrink-0" />
            <span>Tier Entitlement Required</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">{reason}</p>
        </div>

        {/* Benefits List */}
        <div className="space-y-2 text-xs">
          <span className="font-bold text-foreground block">Upgrade to {requiredPlan} Tier to unlock:</span>
          <ul className="space-y-1 text-muted-foreground list-disc list-inside">
            <li>Full access to {featureName}</li>
            <li>Higher AI generation quotas</li>
            <li>Custom domain connection &amp; white-label branding</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border bg-secondary/50 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary transition-all"
          >
            Dismiss
          </button>
          <button
            onClick={handleUpgrade}
            className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/95 transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Upgrade to {requiredPlan}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
