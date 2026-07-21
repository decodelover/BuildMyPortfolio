"use client";

import React from "react";
import { useBillingEngineStore } from "@/store/useBillingEngineStore";
import { Zap, Layers, FileText, Globe, HardDrive, AlertTriangle } from "lucide-react";

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
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h3 className="text-base font-bold text-foreground">Usage Quotas &amp; Capacity Indicators</h3>
          <p className="text-xs text-muted-foreground">
            Monitored metrics for your active <span className="font-bold text-foreground">{activePlan.name} Plan</span>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((item) => {
          const maxLimit = Math.max(1, item.limit);
          const percentage = Math.min(100, Math.round((item.used / maxLimit) * 100));
          const isWarning = percentage >= 80;
          const Icon = item.icon;

          // SVG Circular Progress Math
          const radius = 24;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (percentage / 100) * circumference;

          return (
            <div key={item.label} className="relative rounded-xl border border-border/60 bg-muted/20 p-5 space-y-4 shadow-sm hover:border-primary/40 transition-colors">
              {isWarning && (
                <span className="absolute top-3 right-3 flex items-center gap-1 text-[9px] font-extrabold uppercase bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <AlertTriangle className="h-3 w-3" />
                  Capacity Near Limit
                </span>
              )}

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* SVG Circular Ring */}
                  <div className="relative flex h-14 w-14 items-center justify-center shrink-0">
                    <svg className="h-14 w-14 -rotate-90 transform" viewBox="0 0 60 60">
                      <circle
                        cx="30"
                        cy="30"
                        r={radius}
                        className="stroke-secondary"
                        strokeWidth="5"
                        fill="transparent"
                      />
                      <circle
                        cx="30"
                        cy="30"
                        r={radius}
                        className={`transition-all duration-700 ${
                          percentage > 85 ? "stroke-rose-500" : percentage > 60 ? "stroke-amber-500" : "stroke-primary"
                        }`}
                        strokeWidth="5"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <span className="absolute text-[11px] font-black text-foreground">{percentage}%</span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground block font-medium">
                      {item.used} of {item.limit >= 999 ? "Unlimited" : `${item.limit} ${item.unit}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Linear Bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    percentage > 85 ? "bg-rose-500" : percentage > 60 ? "bg-amber-500" : "bg-primary"
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
