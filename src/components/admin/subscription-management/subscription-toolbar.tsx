"use client";

import React from "react";
import { Search, RefreshCw, X, CreditCard, Shield, Filter, Globe } from "lucide-react";
import { SubscriptionDirectoryQuery } from "@/types/admin-billing";

interface SubscriptionToolbarProps {
  query: SubscriptionDirectoryQuery;
  onChangeQuery: (newQuery: Partial<SubscriptionDirectoryQuery>) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
  totalResults: number;
  isLoading: boolean;
}

export function SubscriptionToolbar({
  query,
  onChangeQuery,
  onResetFilters,
  onRefresh,
  totalResults,
  isLoading,
}: SubscriptionToolbarProps) {
  const hasFilters = Boolean(
    query.search ||
      (query.status && query.status !== "ALL") ||
      (query.plan && query.plan !== "ALL") ||
      (query.paymentProvider && query.paymentProvider !== "ALL") ||
      (query.billingCycle && query.billingCycle !== "ALL")
  );

  return (
    <div className="space-y-4 bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border shadow-sm text-left">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search subscriptions by customer name, email, subscription ID, or provider ID..."
            value={query.search || ""}
            onChange={(e) => onChangeQuery({ search: e.target.value, page: 1 })}
            className="w-full pl-10 pr-9 py-2.5 text-xs bg-background/80 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium placeholder:text-muted-foreground/70"
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
            Subscriptions: <span className="text-foreground font-bold">{totalResults}</span>
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
            <option value="active">Active</option>
            <option value="past_due">Past Due</option>
            <option value="canceled">Canceled</option>
            <option value="trialing">Trialing</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
            Plan Level
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

        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
            Payment Provider
          </label>
          <select
            value={query.paymentProvider || "ALL"}
            onChange={(e) => onChangeQuery({ paymentProvider: e.target.value, page: 1 })}
            className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Providers</option>
            <option value="stripe">Stripe</option>
            <option value="paystack">Paystack</option>
            <option value="paypal">PayPal</option>
            <option value="manual">Manual Wire / Admin</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
            Billing Cycle
          </label>
          <select
            value={query.billingCycle || "ALL"}
            onChange={(e) => onChangeQuery({ billingCycle: e.target.value, page: 1 })}
            className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Cycles</option>
            <option value="monthly">Monthly</option>
            <option value="annual">Annual</option>
          </select>
        </div>
      </div>
    </div>
  );
}
