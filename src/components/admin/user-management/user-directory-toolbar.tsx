"use client";

import React from "react";
import {
  Search,
  Filter,
  X,
  RefreshCw,
  Globe,
  Shield,
  CreditCard,
  UserCheck,
  Calendar,
  Activity,
  Key,
} from "lucide-react";
import { UserDirectoryQuery } from "@/types/admin-user";

interface UserDirectoryToolbarProps {
  query: UserDirectoryQuery;
  onChangeQuery: (newQuery: Partial<UserDirectoryQuery>) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
  totalResults: number;
  isLoading: boolean;
}

export function UserDirectoryToolbar({
  query,
  onChangeQuery,
  onResetFilters,
  onRefresh,
  totalResults,
  isLoading,
}: UserDirectoryToolbarProps) {
  const hasActiveFilters = Boolean(
    query.search ||
      (query.role && query.role !== "ALL") ||
      (query.plan && query.plan !== "ALL") ||
      (query.status && query.status !== "ALL") ||
      (query.country && query.country !== "ALL") ||
      (query.authProvider && query.authProvider !== "ALL") ||
      (query.activity && query.activity !== "ALL") ||
      (query.regDateRange && query.regDateRange !== "all") ||
      (query.lastLoginRange && query.lastLoginRange !== "all")
  );

  return (
    <div className="space-y-4 bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border shadow-sm">
      {/* Top Search & Action Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, username, phone, or ID..."
            value={query.search || ""}
            onChange={(e) => onChangeQuery({ search: e.target.value, page: 1 })}
            className="w-full pl-10 pr-9 py-2.5 text-xs bg-background/80 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-muted-foreground/70"
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

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-all"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-secondary hover:bg-secondary/80 border border-border rounded-xl transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <div className="text-xs text-muted-foreground font-semibold px-2">
            Showing <span className="text-foreground font-bold">{totalResults}</span> users
          </div>
        </div>
      </div>

      {/* Filter Options Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 pt-2 border-t border-border/60">
        {/* Role Filter */}
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1 flex items-center gap-1">
            <Shield className="w-3 h-3 text-primary" /> Role
          </label>
          <select
            value={query.role || "ALL"}
            onChange={(e) => onChangeQuery({ role: e.target.value, page: 1 })}
            className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
          >
            <option value="ALL">All Roles</option>
            <option value="USER font-bold">User</option>
            <option value="PRO_USER">Pro User</option>
            <option value="BUSINESS_USER">Business User</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="SUPPORT_AGENT">Support Agent</option>
            <option value="FINANCE_MANAGER">Finance Manager</option>
            <option value="DEVELOPER">Developer</option>
            <option value="CONTENT_MANAGER">Content Manager</option>
          </select>
        </div>

        {/* Plan Filter */}
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1 flex items-center gap-1">
            <CreditCard className="w-3 h-3 text-emerald-500" /> Plan
          </label>
          <select
            value={query.plan || "ALL"}
            onChange={(e) => onChangeQuery({ plan: e.target.value, page: 1 })}
            className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
          >
            <option value="ALL">All Plans</option>
            <option value="FREE">Free</option>
            <option value="PRO">Pro</option>
            <option value="BUSINESS">Business</option>
            <option value="ENTERPRISE">Enterprise</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1 flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-sky-500" /> Status
          </label>
          <select
            value={query.status || "ALL"}
            onChange={(e) => onChangeQuery({ status: e.target.value, page: 1 })}
            className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="disabled">Disabled</option>
            <option value="pending_verification">Pending Verification</option>
          </select>
        </div>

        {/* Country Filter */}
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1 flex items-center gap-1">
            <Globe className="w-3 h-3 text-indigo-500" /> Country
          </label>
          <select
            value={query.country || "ALL"}
            onChange={(e) => onChangeQuery({ country: e.target.value, page: 1 })}
            className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
          >
            <option value="ALL">All Countries</option>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Germany">Germany</option>
            <option value="South Korea">South Korea</option>
            <option value="India">India</option>
            <option value="Brazil">Brazil</option>
            <option value="Nigeria">Nigeria</option>
          </select>
        </div>

        {/* Auth Provider Filter */}
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1 flex items-center gap-1">
            <Key className="w-3 h-3 text-amber-500" /> Provider
          </label>
          <select
            value={query.authProvider || "ALL"}
            onChange={(e) => onChangeQuery({ authProvider: e.target.value, page: 1 })}
            className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
          >
            <option value="ALL">All Providers</option>
            <option value="email">Email / Password</option>
            <option value="google">Google SSO</option>
            <option value="github">GitHub SSO</option>
            <option value="saml">SAML Enterprise</option>
          </select>
        </div>

        {/* Reg Date Range */}
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-violet-500" /> Joined
          </label>
          <select
            value={query.regDateRange || "all"}
            onChange={(e) => onChangeQuery({ regDateRange: e.target.value as any, page: 1 })}
            className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
          >
            <option value="all">Anytime</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        {/* Activity Filter */}
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1 flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-600" /> Activity
          </label>
          <select
            value={query.activity || "ALL"}
            onChange={(e) => onChangeQuery({ activity: e.target.value, page: 1 })}
            className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
          >
            <option value="ALL">All Levels</option>
            <option value="high">High Usage</option>
            <option value="low">Low Usage</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
}
