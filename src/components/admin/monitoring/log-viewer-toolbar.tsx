"use client";

import React from "react";
import { Search, RefreshCw, X, Filter, Terminal } from "lucide-react";
import { LogQueryFilter } from "@/types/admin-monitoring";

interface LogViewerToolbarProps {
  query: LogQueryFilter;
  onChangeQuery: (newQuery: Partial<LogQueryFilter>) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
  totalResults: number;
  isLoading: boolean;
}

export function LogViewerToolbar({
  query,
  onChangeQuery,
  onResetFilters,
  onRefresh,
  totalResults,
  isLoading,
}: LogViewerToolbarProps) {
  const hasFilters = Boolean(
    query.search ||
      (query.severity && query.severity !== "ALL") ||
      (query.module && query.module !== "ALL")
  );

  return (
    <div className="space-y-4 bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border shadow-sm text-left">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Full-text log search by message, request ID, error code, or service..."
            value={query.search || ""}
            onChange={(e) => onChangeQuery({ search: e.target.value, page: 1 })}
            className="w-full pl-10 pr-9 py-2.5 text-xs bg-background/80 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono text-xs placeholder:text-muted-foreground/70"
          />
          {query.search && (
            <button
              onClick={() => onChangeQuery({ search: "", page: 1 })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-all"
            >
              <X className="w-3.5 h-3.5" /> Reset Filters
            </button>
          )}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-secondary hover:bg-secondary/80 border border-border rounded-xl transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} /> Stream Refresh
          </button>
          <div className="text-xs text-muted-foreground font-semibold px-2">
            Entries: <span className="text-foreground font-bold font-mono">{totalResults}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/60">
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
            Severity Level
          </label>
          <select
            value={query.severity || "ALL"}
            onChange={(e) => onChangeQuery({ severity: e.target.value, page: 1 })}
            className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none font-bold"
          >
            <option value="ALL">All Severities</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
            Service Module
          </label>
          <select
            value={query.module || "ALL"}
            onChange={(e) => onChangeQuery({ module: e.target.value, page: 1 })}
            className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none font-bold"
          >
            <option value="ALL">All Modules</option>
            <option value="AUTH">AUTH</option>
            <option value="BILLING">BILLING</option>
            <option value="AI_OPS">AI_OPS</option>
            <option value="PORTFOLIO_ENGINE">PORTFOLIO_ENGINE</option>
            <option value="DATABASE">DATABASE</option>
            <option value="STORAGE">STORAGE</option>
            <option value="SYSTEM">SYSTEM</option>
          </select>
        </div>
      </div>
    </div>
  );
}
