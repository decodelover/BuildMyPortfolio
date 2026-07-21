"use client";

import React from "react";
import { useBillingEngineStore } from "@/store/useBillingEngineStore";
import { Zap, Layers, FileText, Globe, HardDrive } from "lucide-react";

export function UsageProgressBar() {
  const { activePlan, usage } = useBillingEngineStore();

  if (!activePlan || !usage) return null;

  const metrics = [
    {
      label: "AI Generation Credits",
      used: usage.aiCreditsUsed,
      limit: activePlan.limits.aiCreditsPerMonth,
      icon: Zap,
      unit: "credits",
    },
    {
      label: "Active Portfolios",
      used: usage.portfoliosCount,
      limit: activePlan.limits.portfoliosCount,
      icon: Layers,
      unit: "sites",
    },
    {
      label: "Monthly Resume Exports",
      used: usage.resumesExported,
      limit: activePlan.limits.resumeExportsPerMonth,
      icon: FileText,
      unit: "exports",
    },
    {
      label: "Custom Domains",
      used: usage.customDomainsCount,
      limit: activePlan.limits.customDomainsCount,
      icon: Globe,
      unit: "domains",
    },
    {
      label: "Media Storage",
      used: usage.storageMbUsed,
      limit: activePlan.limits.storageMb,
      icon: HardDrive,
      unit: "MB",
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md p-6 space-y-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground">Usage Quota Overview</h3>
          <p className="text-xs text-muted-foreground">Monitored limits for your current {activePlan.name} membership.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((item) => {
          const percentage = Math.min(100, Math.round((item.used / Math.max(1, item.limit)) * 100));
          const Icon = item.icon;

          return (
            <div key={item.label} className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-4">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <Icon className="h-4 w-4 text-primary" />
                  <span>{item.label}</span>
                </div>
                <span className="font-bold text-muted-foreground text-[11px]">
                  {item.used} / {item.limit >= 999 ? "∞" : item.limit} {item.unit}
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    percentage > 85 ? "bg-destructive" : percentage > 60 ? "bg-amber-500" : "bg-primary"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
