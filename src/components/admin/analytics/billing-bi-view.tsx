"use client";

import React, { useEffect, useState } from "react";
import { BillingAnalyticsData, AnalyticsTimeframeType } from "@/types/admin-analytics";
import { CreditCard, DollarSign, TrendingUp, RefreshCcw, Award } from "lucide-react";

interface BillingBiViewProps {
  timeframe: AnalyticsTimeframeType;
}

export function BillingBiView({ timeframe }: BillingBiViewProps) {
  const [data, setData] = useState<BillingAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/analytics/billing?timeframe=${timeframe}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [timeframe]);

  if (isLoading || !data) {
    return <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">Loading Billing Intelligence...</div>;
  }

  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Monthly Recurring Revenue</span>
          <p className="text-2xl font-black text-emerald-600">${data.mrrUSD.toLocaleString()}</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Annual Run Rate</span>
          <p className="text-2xl font-black text-indigo-600">${(data.arrUSD / 1000000).toFixed(2)}M</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Payment Success Rate</span>
          <p className="text-2xl font-black text-emerald-600">{data.paymentSuccessRatePercentage}%</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Refund Rate</span>
          <p className="text-2xl font-black text-foreground">{data.refundRatePercentage}%</p>
        </div>
      </div>

      {/* Plan Distribution */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 text-xs">
        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary" /> Active Plan Tier Mix
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {data.planDistribution.map((plan) => (
            <div key={plan.planType} className="p-4 rounded-xl border border-border bg-background space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">{plan.planType}</span>
              <p className="text-xl font-black text-foreground">{plan.count.toLocaleString()}</p>
              <span className="text-[11px] font-semibold text-primary">{plan.percentage}% of userbase</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
