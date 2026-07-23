"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, Users, Folder, Sparkles, CreditCard, Activity, ShieldCheck } from "lucide-react";
import { ExecutiveKpiMetrics, AnalyticsTimeframeType } from "@/types/admin-analytics";
import { AnalyticsFilterToolbar } from "./analytics-filter-toolbar";
import { ExecutiveKpiGrid } from "./executive-kpi-grid";
import { UserGrowthAnalyticsView } from "./user-growth-analytics-view";
import { PortfolioBiView } from "./portfolio-bi-view";
import { AiOpsAnalyticsView } from "./ai-ops-analytics-view";
import { BillingBiView } from "./billing-bi-view";
import { SystemPerformanceView } from "./system-performance-view";
import { RealtimeTickerFeed } from "./realtime-ticker-feed";

export function AdminAnalyticsConsole() {
  const [activeTab, setActiveTab] = useState<"executive" | "users" | "portfolios" | "ai" | "billing" | "system">("executive");
  const [timeframe, setTimeframe] = useState<AnalyticsTimeframeType>("30d");
  const [kpis, setKpis] = useState<ExecutiveKpiMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchKpis = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics/overview?timeframe=${timeframe}`);
      if (res.ok) {
        const data = await res.json();
        setKpis(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKpis();
  }, [timeframe]);

  const handleExport = (format: "csv" | "json") => {
    const jsonStr = JSON.stringify(kpis || {}, null, 2);
    const blob = new Blob([jsonStr], { type: format === "csv" ? "text/csv" : "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `buildmyportfolio-analytics-${timeframe}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-left relative pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Enterprise Analytics &amp; Business Intelligence Center
          </h2>
          <p className="text-xs text-muted-foreground">
            360° platform observability, executive metrics, user growth, financial MRR/ARR, portfolio analytics, AI telemetry, and system health.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            BI Engine Online
          </div>
        </div>
      </div>

      {/* Global Filter Toolbar */}
      <AnalyticsFilterToolbar
        timeframe={timeframe}
        onChangeTimeframe={setTimeframe}
        onRefresh={fetchKpis}
        onExport={handleExport}
        isLoading={isLoading}
      />

      {/* Main Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto text-xs font-bold">
        {[
          { id: "executive", label: "Executive Dashboard", icon: BarChart3 },
          { id: "users", label: "User Growth & Retention", icon: Users },
          { id: "portfolios", label: "Portfolio BI", icon: Folder },
          { id: "ai", label: "AI Ops Analytics", icon: Sparkles },
          { id: "billing", label: "Billing & Revenue", icon: CreditCard },
          { id: "system", label: "System Observability", icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === "executive" && (
        <div className="space-y-6">
          <ExecutiveKpiGrid metrics={kpis} />
          <RealtimeTickerFeed />
        </div>
      )}

      {activeTab === "users" && <UserGrowthAnalyticsView timeframe={timeframe} />}
      {activeTab === "portfolios" && <PortfolioBiView timeframe={timeframe} />}
      {activeTab === "ai" && <AiOpsAnalyticsView timeframe={timeframe} />}
      {activeTab === "billing" && <BillingBiView timeframe={timeframe} />}
      {activeTab === "system" && <SystemPerformanceView />}
    </div>
  );
}
