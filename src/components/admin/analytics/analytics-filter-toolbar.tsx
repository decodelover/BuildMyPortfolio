"use client";

import React from "react";
import { Calendar, Download, RefreshCw, Filter, Sparkles, FileText, Table } from "lucide-react";
import { AnalyticsTimeframeType } from "@/types/admin-analytics";

interface AnalyticsFilterToolbarProps {
  timeframe: AnalyticsTimeframeType;
  onChangeTimeframe: (tf: AnalyticsTimeframeType) => void;
  onRefresh: () => void;
  onExport: (format: "csv" | "json") => void;
  isLoading: boolean;
}

export function AnalyticsFilterToolbar({
  timeframe,
  onChangeTimeframe,
  onRefresh,
  onExport,
  isLoading,
}: AnalyticsFilterToolbarProps) {
  return (
    <div className="space-y-4 bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border shadow-sm text-left">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
          {[
            { id: "today", label: "Today" },
            { id: "7d", label: "Last 7 Days" },
            { id: "30d", label: "Last 30 Days" },
            { id: "90d", label: "Last 90 Days" },
            { id: "1y", label: "This Year" },
          ].map((tf) => {
            const isActive = timeframe === tf.id;
            return (
              <button
                key={tf.id}
                onClick={() => onChangeTimeframe(tf.id as any)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-background text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {tf.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => onExport("csv")}
            className="flex items-center gap-1.5 px-3 py-1.5 font-bold bg-secondary hover:bg-secondary/80 border border-border rounded-xl"
          >
            <Download className="w-3.5 h-3.5 text-primary" /> Export CSV
          </button>
          <button
            onClick={() => onExport("json")}
            className="flex items-center gap-1.5 px-3 py-1.5 font-bold bg-secondary hover:bg-secondary/80 border border-border rounded-xl"
          >
            <Table className="w-3.5 h-3.5 text-indigo-600" /> Export JSON
          </button>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
