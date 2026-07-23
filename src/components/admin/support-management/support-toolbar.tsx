"use client";

import React from "react";
import { Search, RefreshCw, X, Filter, HelpCircle, MessageSquare } from "lucide-react";
import { TicketDirectoryQuery } from "@/types/admin-support";

interface SupportToolbarProps {
  query: TicketDirectoryQuery;
  onChangeQuery: (newQuery: Partial<TicketDirectoryQuery>) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
  totalResults: number;
  isLoading: boolean;
}

export function SupportToolbar({
  query,
  onChangeQuery,
  onResetFilters,
  onRefresh,
  totalResults,
  isLoading,
}: SupportToolbarProps) {
  const hasFilters = Boolean(
    query.search ||
      (query.status && query.status !== "ALL") ||
      (query.priority && query.priority !== "ALL") ||
      (query.category && query.category !== "ALL") ||
      (query.plan && query.plan !== "ALL")
  );

  return (
    <div className="space-y-4 bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border shadow-sm text-left">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tickets by subject, ticket ID, customer name, or email..."
            value={query.search || ""}
            onChange={(e) => onChangeQuery({ search: e.target.value, page: 1 })}
            className="w-full pl-10 pr-9 py-2.5 text-xs bg-background/80 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
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
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <div className="text-xs text-muted-foreground font-semibold px-2">
            Tickets: <span className="text-foreground font-bold">{totalResults}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/60">
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
            Status
          </label>
          <select
            value={query.status || "ALL"}
            onChange={(e) => onChangeQuery({ status: e.target.value, page: 1 })}
            className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="PENDING">PENDING</option>
            <option value="WAITING_FOR_CUSTOMER">WAITING FOR CUSTOMER</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
            <option value="ESCALATED">ESCALATED</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
            Priority
          </label>
          <select
            value={query.priority || "ALL"}
            onChange={(e) => onChangeQuery({ priority: e.target.value, page: 1 })}
            className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">LOW</option>
            <option value="NORMAL">NORMAL</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
            Category
          </label>
          <select
            value={query.category || "ALL"}
            onChange={(e) => onChangeQuery({ category: e.target.value, page: 1 })}
            className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="BILLING">Billing &amp; Invoices</option>
            <option value="AI_GENERATION">AI Operations</option>
            <option value="CUSTOM_DOMAIN">Custom Domain &amp; SSL</option>
            <option value="PORTFOLIO_BUILDER">Portfolio Builder</option>
            <option value="ACCOUNT_ACCESS">Account Access</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
            Customer Plan
          </label>
          <select
            value={query.plan || "ALL"}
            onChange={(e) => onChangeQuery({ plan: e.target.value, page: 1 })}
            className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Plans</option>
            <option value="FREE">FREE</option>
            <option value="PRO">PRO</option>
            <option value="BUSINESS">BUSINESS</option>
            <option value="ENTERPRISE">ENTERPRISE</option>
          </select>
        </div>
      </div>
    </div>
  );
}
