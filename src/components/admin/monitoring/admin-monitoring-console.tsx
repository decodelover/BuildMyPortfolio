"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Activity, Terminal, Bug, Bell, ShieldCheck } from "lucide-react";
import { LogQueryFilter, LogQueryResult } from "@/types/admin-monitoring";
import { HealthStatusGrid } from "./health-status-grid";
import { LogViewerToolbar } from "./log-viewer-toolbar";
import { ApplicationLogTable } from "./application-log-table";
import { ErrorTrackerView } from "./error-tracker-view";
import { AlertRulesManager } from "./alert-rules-manager";

export function AdminMonitoringConsole() {
  const [activeTab, setActiveTab] = useState<"health" | "logs" | "errors" | "alerts">("health");

  const [query, setQuery] = useState<LogQueryFilter>({
    search: "",
    severity: "ALL",
    module: "ALL",
    page: 1,
    limit: 10,
  });

  const [logResult, setLogResult] = useState<LogQueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.search) params.set("search", query.search);
      if (query.severity && query.severity !== "ALL") params.set("severity", query.severity);
      if (query.module && query.module !== "ALL") params.set("module", query.module);
      params.set("page", query.page.toString());
      params.set("limit", query.limit.toString());

      const res = await fetch(`/api/admin/monitoring/logs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (activeTab === "logs") {
      fetchLogs();
    }
  }, [activeTab, fetchLogs]);

  return (
    <div className="space-y-6 text-left relative pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-500" />
            Enterprise System Monitoring &amp; Logs Platform
          </h2>
          <p className="text-xs text-muted-foreground">
            360° SRE observability dashboard, 14-service health grid, application log streaming, error tracking, and automated alert rules.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            14/14 Services Operational
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto text-xs font-bold">
        {[
          { id: "health", label: "Health Uptime Grid", icon: Activity },
          { id: "logs", label: "Application Logs", icon: Terminal },
          { id: "errors", label: "Error Tracker", icon: Bug },
          { id: "alerts", label: "Alert & Incident Rules", icon: Bell },
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

      {/* TAB PANELS */}
      {activeTab === "health" && <HealthStatusGrid />}

      {activeTab === "logs" && (
        <div className="space-y-6">
          <LogViewerToolbar
            query={query}
            onChangeQuery={(newQ) => setQuery({ ...query, ...newQ })}
            onResetFilters={() =>
              setQuery({
                search: "",
                severity: "ALL",
                module: "ALL",
                page: 1,
                limit: 10,
              })
            }
            onRefresh={fetchLogs}
            totalResults={logResult?.total || 0}
            isLoading={isLoading}
          />

          <ApplicationLogTable
            result={logResult}
            query={query}
            onChangeQuery={(newQ) => setQuery({ ...query, ...newQ })}
            isLoading={isLoading}
          />
        </div>
      )}

      {activeTab === "errors" && <ErrorTrackerView />}
      {activeTab === "alerts" && <AlertRulesManager />}
    </div>
  );
}
