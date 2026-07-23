"use client";

import React from "react";
import { Search, RefreshCw, X, Filter, Folder, Globe, Eye, Sparkles } from "lucide-react";
import { PortfolioDirectoryQuery } from "@/types/admin-portfolio";

interface PortfolioToolbarProps {
  query: PortfolioDirectoryQuery;
  onChangeQuery: (newQuery: Partial<PortfolioDirectoryQuery>) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
  totalResults: number;
  isLoading: boolean;
}

export function PortfolioToolbar({
  query,
  onChangeQuery,
  onResetFilters,
  onRefresh,
  totalResults,
  isLoading,
}: PortfolioToolbarProps) {
  const hasFilters = Boolean(
    query.search ||
      (query.status && query.status !== "ALL") ||
      (query.visibility && query.visibility !== "ALL") ||
      (query.plan && query.plan !== "ALL") ||
      (query.templateId && query.templateId !== "ALL") ||
      (query.minSeoScore && query.minSeoScore > 0)
  );

  return (
    <div className="space-y-4 bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border shadow-sm text-left">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search portfolios by name, ID, owner email, username, or custom domain..."
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
            Portfolios: <span className="text-foreground font-bold">{totalResults}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-border/60">
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
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
            <option value="flagged">Flagged / Moderation</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
            Visibility
          </label>
          <select
            value={query.visibility || "ALL"}
            onChange={(e) => onChangeQuery({ visibility: e.target.value, page: 1 })}
            className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Visibilities</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="unlisted">Unlisted</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
            Owner Plan
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
            Template Used
          </label>
          <select
            value={query.templateId || "ALL"}
            onChange={(e) => onChangeQuery({ templateId: e.target.value, page: 1 })}
            className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Templates</option>
            <option value="tpl_modern_dev">Modern Developer Core</option>
            <option value="tpl_enterprise_b2b">Enterprise B2B Suite</option>
            <option value="tpl_minimal_clean">Minimalist Clean</option>
            <option value="tpl_creative_gallery">Creative Gallery</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
            Min SEO Score
          </label>
          <select
            value={query.minSeoScore || 0}
            onChange={(e) => onChangeQuery({ minSeoScore: parseInt(e.target.value, 10), page: 1 })}
            className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value={0}>Any Score</option>
            <option value={80}>80+ Excellent</option>
            <option value={90}>90+ Top Tier</option>
            <option value={95}>95+ Flawless</option>
          </select>
        </div>
      </div>
    </div>
  );
}
