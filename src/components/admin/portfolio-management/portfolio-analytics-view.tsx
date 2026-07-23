"use client";

import React from "react";
import { Eye, Users, MousePointer, Download, TrendingUp, BarChart2 } from "lucide-react";

export function PortfolioAnalyticsView() {
  return (
    <div className="space-y-6 text-left">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Total Portfolio Views</span>
          <p className="text-2xl font-black text-primary">65,220</p>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% this month
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Unique Visitors</span>
          <p className="text-2xl font-black text-emerald-600">42,310</p>
          <span className="text-[11px] text-muted-foreground font-semibold">Across published portfolios</span>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">CTA Clicks</span>
          <p className="text-2xl font-black text-indigo-600">16,305</p>
          <span className="text-[11px] text-muted-foreground font-semibold">Outbound project links</span>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Resume Downloads</span>
          <p className="text-2xl font-black text-amber-500">2,005</p>
          <span className="text-[11px] text-muted-foreground font-semibold">Recruiter resume fetches</span>
        </div>
      </div>

      {/* Traffic Distribution */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 text-xs">
        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-primary" /> Global Platform Traffic Sources
        </h4>

        <div className="space-y-3">
          {[
            { source: "Google Organic Search", count: 32400, pct: 49.6 },
            { source: "LinkedIn & Social Referrals", count: 21100, pct: 32.3 },
            { source: "Direct Subdomain Visits", count: 8200, pct: 12.5 },
            { source: "GitHub & Developer Forums", count: 3520, pct: 5.6 },
          ].map((item) => (
            <div key={item.source} className="space-y-1">
              <div className="flex items-center justify-between font-semibold">
                <span>{item.source}</span>
                <span>{item.count.toLocaleString()} ({item.pct}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
