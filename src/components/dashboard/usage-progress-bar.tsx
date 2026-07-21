"use client";

import React from "react";
import { useBillingEngineStore } from "@/store/useBillingEngineStore";
import {
  Zap,
  Layers,
  FileText,
  Globe,
  HardDrive,
  AlertTriangle,
  Info,
  AlertCircle,
  Clock,
  Sparkles,
  Download,
  BarChart3,
  Cpu,
} from "lucide-react";

export function UsageProgressBar() {
  const { activePlan, usage, subscription } = useBillingEngineStore();

  if (!activePlan || !usage) return null;

  const metrics = [
    {
      key: "aiCreditsUsed",
      label: "AI Generation Credits",
      used: usage.aiCreditsUsed,
      limit: activePlan.limits.aiCreditsPerMonth,
      icon: Zap,
      unit: "credits",
    },
    {
      key: "portfoliosCount",
      label: "Active Portfolios",
      used: usage.portfoliosCount,
      limit: activePlan.limits.portfoliosCount,
      icon: Layers,
      unit: "sites",
    },
    {
      key: "resumesExported",
      label: "Resume Exports",
      used: usage.resumesExported,
      limit: activePlan.limits.resumeExportsPerMonth,
      icon: FileText,
      unit: "exports",
    },
    {
      key: "customDomainsCount",
      label: "Custom Domains",
      used: usage.customDomainsCount,
      limit: activePlan.limits.customDomainsCount,
      icon: Globe,
      unit: "domains",
    },
    {
      key: "storageMbUsed",
      label: "Media Storage",
      used: usage.storageMbUsed,
      limit: activePlan.limits.storageMb,
      icon: HardDrive,
      unit: "MB",
    },
    {
      key: "resumesGenerated",
      label: "Resume Generations",
      used: usage.resumesGenerated || 0,
      limit: 20,
      icon: Sparkles,
      unit: "resumes",
    },
    {
      key: "portfoliosExported",
      label: "Code Exports",
      used: usage.portfoliosExported || 0,
      limit: activePlan.planId === "FREE" ? 1 : 50,
      icon: Download,
      unit: "zips",
    },
    {
      key: "analyticsViewsCount",
      label: "Analytics Insights",
      used: usage.analyticsViewsCount || 0,
      limit: activePlan.planId === "FREE" ? 100 : 10000,
      icon: BarChart3,
      unit: "views",
    },
    {
      key: "apiRequestsCount",
      label: "API Execution Calls",
      used: usage.apiRequestsCount || 0,
      limit: activePlan.planId === "BUSINESS" ? 25000 : 500,
      icon: Cpu,
      unit: "calls",
    },
  ];

  // Collect threshold alerts across metrics
  const activeAlerts = metrics
    .map((item) => {
      const maxLimit = Math.max(1, item.limit);
      const percentage = Math.min(100, Math.round((item.used / maxLimit) * 100));
      return { ...item, percentage };
    })
    .filter((item) => item.percentage >= 50);

  const formattedPeriodEnd = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "End of month";

  return (
    <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-md p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            Enterprise Resource Quota Monitoring
          </h3>
          <p className="text-xs text-muted-foreground">
            Real-time trackable capacity metrics for your active <span className="font-bold text-foreground">{activePlan.name} Plan</span>.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-xl border border-border/60 shrink-0 self-start sm:self-auto">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span>Quota Reset: <strong className="text-foreground">{formattedPeriodEnd}</strong></span>
        </div>
      </div>

      {/* Multi-Threshold Warning Banners */}
      {activeAlerts.length > 0 && (
        <div className="space-y-2.5">
          {activeAlerts.map((alert) => {
            if (alert.percentage >= 100) {
              return (
                <div key={alert.key} className="flex items-center gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-500 font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span><strong>100% Exceeded ({alert.label}):</strong> You have reached your plan limit. Upgrade to maintain uninterrupted access.</span>
                </div>
              );
            } else if (alert.percentage >= 90) {
              return (
                <div key={alert.key} className="flex items-center gap-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-500 font-medium">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span><strong>90% Critical Capacity ({alert.label}):</strong> Approaching monthly quota limit.</span>
                </div>
              );
            } else if (alert.percentage >= 75) {
              return (
                <div key={alert.key} className="flex items-center gap-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-3 text-xs text-yellow-500 font-medium">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span><strong>75% High Usage Notice ({alert.label}):</strong> {alert.percentage}% of monthly limit consumed.</span>
                </div>
              );
            } else if (alert.percentage >= 50) {
              return (
                <div key={alert.key} className="flex items-center gap-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 p-3 text-xs text-blue-500 font-medium">
                  <Info className="h-4 w-4 shrink-0" />
                  <span><strong>50% Capacity Reached ({alert.label}):</strong> Half of your monthly quota has been utilized.</span>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((item) => {
          const maxLimit = Math.max(1, item.limit);
          const percentage = Math.min(100, Math.round((item.used / maxLimit) * 100));
          const Icon = item.icon;

          // SVG Circular Progress Ring Math
          const radius = 22;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (percentage / 100) * circumference;

          return (
            <div key={item.key} className="relative rounded-2xl border border-border/60 bg-muted/20 p-5 space-y-4 shadow-sm hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Circular SVG Ring */}
                  <div className="relative flex h-13 w-13 items-center justify-center shrink-0">
                    <svg className="h-13 w-13 -rotate-90 transform" viewBox="0 0 56 56">
                      <circle
                        cx="28"
                        cy="28"
                        r={radius}
                        className="stroke-secondary"
                        strokeWidth="4.5"
                        fill="transparent"
                      />
                      <circle
                        cx="28"
                        cy="28"
                        r={radius}
                        className={`transition-all duration-700 ${
                          percentage >= 100
                            ? "stroke-rose-500"
                            : percentage >= 80
                            ? "stroke-amber-500"
                            : percentage >= 50
                            ? "stroke-yellow-500"
                            : "stroke-primary"
                        }`}
                        strokeWidth="4.5"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <span className="absolute text-[10px] font-black text-foreground">{percentage}%</span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate max-w-[130px]">{item.label}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground block font-medium">
                      {item.used} of {item.limit >= 9999 ? "Unlimited" : `${item.limit} ${item.unit}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Line */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    percentage >= 100
                      ? "bg-rose-500"
                      : percentage >= 80
                      ? "bg-amber-500"
                      : percentage >= 50
                      ? "bg-yellow-500"
                      : "bg-primary"
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
