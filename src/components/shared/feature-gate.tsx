"use client";

import React, { ReactNode } from "react";
import { useBillingEngineStore } from "@/store/useBillingEngineStore";
import { Lock, Sparkles, ArrowRight } from "lucide-react";
import { FeatureAccessResult } from "@/lib/billing-engine/types";

interface FeatureGateProps {
  feature:
    | "generate_portfolio"
    | "publish_portfolio"
    | "use_ai"
    | "advanced_ai"
    | "export_resume"
    | "premium_templates"
    | "connect_domain"
    | "analytics"
    | "seo"
    | "remove_branding"
    | "version_history"
    | "team_workspace"
    | "manage_clients";
  children: ReactNode;
  fallback?: ReactNode;
  onUpgradeClick?: () => void;
  showInlineUpgradeCard?: boolean;
}

export function FeatureGate({
  feature,
  children,
  fallback,
  onUpgradeClick,
  showInlineUpgradeCard = true,
}: FeatureGateProps) {
  const store = useBillingEngineStore();

  let checkResult: FeatureAccessResult = { allowed: true };

  switch (feature) {
    case "generate_portfolio":
      checkResult = store.canGeneratePortfolio();
      break;
    case "publish_portfolio":
      checkResult = store.canPublishPortfolio();
      break;
    case "use_ai":
      checkResult = store.canUseAI();
      break;
    case "advanced_ai":
      checkResult = store.canUseAdvancedAI();
      break;
    case "export_resume":
      checkResult = store.canExportResume();
      break;
    case "premium_templates":
      checkResult = store.canUsePremiumTemplates();
      break;
    case "connect_domain":
      checkResult = store.canConnectDomain();
      break;
    case "analytics":
      checkResult = store.canUseAnalytics();
      break;
    case "seo":
      checkResult = store.canUseSEO();
      break;
    case "remove_branding":
      checkResult = store.canRemoveBranding();
      break;
    case "version_history":
      checkResult = store.canUseVersionHistory();
      break;
    case "team_workspace":
      checkResult = store.canUseTeamWorkspace();
      break;
    case "manage_clients":
      checkResult = store.canManageClients();
      break;
    default:
      checkResult = { allowed: true };
  }

  if (checkResult.allowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showInlineUpgradeCard) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-background p-6 shadow-sm flex flex-col items-center text-center space-y-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
        <Lock className="h-6 w-6" />
      </div>

      <div className="space-y-1 max-w-md">
        <h4 className="text-base font-bold text-foreground flex items-center justify-center gap-1.5">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          Pro Feature Locked
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {checkResult.reason || "Upgrade your subscription to unlock access to this premium feature."}
        </p>
      </div>

      {onUpgradeClick && (
        <button
          onClick={onUpgradeClick}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all"
        >
          Upgrade Membership
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
