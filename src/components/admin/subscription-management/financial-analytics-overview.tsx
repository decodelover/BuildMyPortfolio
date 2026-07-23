"use client";

import React, { useEffect, useState } from "react";
import { FinancialMetrics } from "@/types/admin-billing";
import { DollarSign, TrendingUp, CreditCard, ShieldAlert, Sparkles, RefreshCw, BarChart2 } from "lucide-react";

export function FinancialAnalyticsOverview() {
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/financial-metrics");
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (isLoading || !metrics) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">
        Loading financial analytics data...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* MRR */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Monthly Recurring Revenue (MRR)
          </span>
          <p className="text-2xl font-black text-emerald-600">${metrics.mrr.toLocaleString()}.00</p>
          <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" /> +14.2% from last month
          </span>
        </div>

        {/* ARR */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Annual Run Rate (ARR)
          </span>
          <p className="text-2xl font-black text-primary">${metrics.arr.toLocaleString()}.00</p>
          <span className="text-[11px] text-muted-foreground font-semibold">
            Based on active subscriptions
          </span>
        </div>

        {/* Outstanding Payments */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Outstanding Payments
          </span>
          <p className="text-2xl font-black text-amber-500">${metrics.outstandingPayments.toFixed(2)}</p>
          <span className="text-[11px] text-muted-foreground font-semibold">Open unpaid invoices</span>
        </div>

        {/* Refund Totals */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Total Refunds Issued
          </span>
          <p className="text-2xl font-black text-rose-500">${metrics.refundTotals.toFixed(2)}</p>
          <span className="text-[11px] text-muted-foreground font-semibold">
            Churn rate: {metrics.churnRatePercentage}%
          </span>
        </div>
      </div>

      {/* Revenue Breakdown by Plan & Provider */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue by Plan */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> MRR Revenue Contribution by Plan Level
          </h4>

          <div className="space-y-3 text-xs">
            {Object.entries(metrics.revenueByPlan).map(([plan, amount]) => {
              const pct = metrics.mrr > 0 ? (amount / metrics.mrr) * 100 : 0;
              return (
                <div key={plan} className="space-y-1">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="font-bold">{plan} PLAN</span>
                    <span>${amount}/mo ({pct.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue by Payment Provider */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-500" /> MRR Revenue by Payment Provider
          </h4>

          <div className="space-y-3 text-xs">
            {Object.entries(metrics.revenueByProvider).map(([provider, amount]) => {
              const pct = metrics.mrr > 0 ? (amount / metrics.mrr) * 100 : 0;
              return (
                <div key={provider} className="space-y-1">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="font-bold uppercase">{provider}</span>
                    <span>${amount}/mo ({pct.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Monthly Growth Trend Table */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-sky-500" /> Monthly Subscription &amp; MRR Growth Trend
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b bg-muted/40 text-muted-foreground font-semibold">
              <tr>
                <th className="py-2.5 px-3">Month</th>
                <th className="py-2.5 px-3">Ending MRR</th>
                <th className="py-2.5 px-3">New Subscriptions</th>
                <th className="py-2.5 px-3">Churned Subscriptions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {metrics.monthlyGrowthTrend.map((m) => (
                <tr key={m.month} className="hover:bg-muted/20">
                  <td className="py-2.5 px-3 font-bold">{m.month}</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600">${m.mrr}/mo</td>
                  <td className="py-2.5 px-3 font-semibold text-primary">+{m.newSubscriptions}</td>
                  <td className="py-2.5 px-3 font-semibold text-rose-500">-{m.churned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
