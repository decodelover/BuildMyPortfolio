"use client";

import React from "react";
import { ExecutiveKpiMetrics } from "@/types/admin-analytics";
import {
  Users,
  DollarSign,
  TrendingUp,
  CreditCard,
  Sparkles,
  FolderCheck,
  Activity,
  CheckCircle2,
  Zap,
} from "lucide-react";

interface ExecutiveKpiGridProps {
  metrics: ExecutiveKpiMetrics | null;
}

export function ExecutiveKpiGrid({ metrics }: ExecutiveKpiGridProps) {
  if (!metrics) return null;

  return (
    <div className="space-y-6 text-left">
      {/* Top 4 Primary Core Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MAU / Active Users */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Monthly Active Users
            </span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-black text-foreground">{metrics.monthlyActiveUsers.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +{metrics.comparisonPercentages.dauGrowth}% vs last mo
          </span>
        </div>

        {/* MRR */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Monthly Recurring Revenue
            </span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600">${metrics.mrrUSD.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +{metrics.comparisonPercentages.mrrGrowth}% YoY
          </span>
        </div>

        {/* Annual Run Rate */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              ARR Run Rate
            </span>
            <CreditCard className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-indigo-600">${(metrics.arrUSD / 1000000).toFixed(2)}M</p>
          <span className="text-[11px] text-muted-foreground font-semibold">
            {metrics.activeSubscribers} Active Paid Plans
          </span>
        </div>

        {/* AI Requests */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              AI Requests Today
            </span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-foreground">{metrics.aiRequestsToday.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +{metrics.comparisonPercentages.aiRequestsGrowth}% Today
          </span>
        </div>
      </div>

      {/* Secondary Operational Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-background space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Daily Active Users</span>
          <p className="text-lg font-bold text-foreground">{metrics.dailyActiveUsers.toLocaleString()}</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-background space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Churn Rate</span>
          <p className="text-lg font-bold text-emerald-600">{metrics.churnRatePercentage}%</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-background space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Trial Conversion Rate</span>
          <p className="text-lg font-bold text-primary">{metrics.trialConversionRatePercentage}%</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-background space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">System Status</span>
          <p className="text-lg font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> {metrics.systemHealthStatus}
          </p>
        </div>
      </div>
    </div>
  );
}
