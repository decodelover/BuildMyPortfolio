"use client";

import React from "react";
import { AdminPortfolio, PortfolioDirectoryQuery, PortfolioDirectoryResult } from "@/types/admin-portfolio";
import {
  CheckCircle2,
  AlertTriangle,
  Ban,
  Eye,
  ExternalLink,
  Edit,
  Trash2,
  Globe,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  UserCheck,
  UploadCloud,
  FileSpreadsheet,
} from "lucide-react";

interface PortfolioTableProps {
  result: PortfolioDirectoryResult | null;
  query: PortfolioDirectoryQuery;
  onChangeQuery: (newQuery: Partial<PortfolioDirectoryQuery>) => void;
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectUser: (id: string) => void;
  onViewPortfolio: (p: AdminPortfolio) => void;
  onEditPortfolio: (p: AdminPortfolio) => void;
  onPublishUnpublish: (p: AdminPortfolio) => void;
  onTransferOwnership: (p: AdminPortfolio) => void;
  onDeletePortfolio: (p: AdminPortfolio) => void;
  isLoading: boolean;
}

export function PortfolioTable({
  result,
  query,
  onChangeQuery,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectUser,
  onViewPortfolio,
  onEditPortfolio,
  onPublishUnpublish,
  onTransferOwnership,
  onDeletePortfolio,
  isLoading,
}: PortfolioTableProps) {
  const portfolios = result?.portfolios || [];
  const allSelected = portfolios.length > 0 && portfolios.every((p) => selectedIds.includes(p.id));

  const handleSort = (field: PortfolioDirectoryQuery["sortBy"]) => {
    if (query.sortBy === field) {
      onChangeQuery({ sortOrder: query.sortOrder === "asc" ? "desc" : "asc" });
    } else {
      onChangeQuery({ sortBy: field, sortOrder: "desc" });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Published
          </span>
        );
      case "flagged":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20">
            <AlertTriangle className="w-3 h-3" /> Flagged
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
            <Ban className="w-3 h-3" /> Archived
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col text-left">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="border-b border-border bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  className="rounded border-border text-primary focus:ring-primary/20"
                />
              </th>
              <th onClick={() => handleSort("name")} className="py-3.5 px-4 cursor-pointer hover:text-foreground">
                Portfolio &amp; Domain
              </th>
              <th className="py-3.5 px-4">Owner</th>
              <th className="py-3.5 px-4">Template &amp; Theme</th>
              <th className="py-3.5 px-4">Status &amp; Visibility</th>
              <th onClick={() => handleSort("seoScore")} className="py-3.5 px-4 cursor-pointer hover:text-foreground">
                SEO / Perf
              </th>
              <th onClick={() => handleSort("viewsCount")} className="py-3.5 px-4 cursor-pointer hover:text-foreground">
                Views
              </th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 px-4 text-center"><div className="w-4 h-4 bg-muted rounded mx-auto" /></td>
                  <td className="py-4 px-4"><div className="w-40 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4"><div className="w-28 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4"><div className="w-32 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4"><div className="w-20 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4"><div className="w-16 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4"><div className="w-16 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4 text-right"><div className="w-16 h-6 bg-muted rounded ml-auto" /></td>
                </tr>
              ))
            ) : portfolios.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-muted-foreground">
                  No portfolios match the specified search or filter criteria.
                </td>
              </tr>
            ) : (
              portfolios.map((fol) => {
                const isSelected = selectedIds.includes(fol.id);
                return (
                  <tr key={fol.id} className={`transition-colors ${isSelected ? "bg-primary/5" : "hover:bg-muted/20"}`}>
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectUser(fol.id)}
                        className="rounded border-border text-primary focus:ring-primary/20"
                      />
                    </td>

                    {/* Portfolio & Domain */}
                    <td className="py-3.5 px-4">
                      <div
                        onClick={() => onViewPortfolio(fol)}
                        className="font-bold text-foreground hover:text-primary cursor-pointer transition-colors"
                      >
                        {fol.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 font-mono">
                        {fol.customDomain ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <Globe className="w-3 h-3" /> {fol.customDomain}
                          </span>
                        ) : (
                          <span>{fol.subdomain}</span>
                        )}
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground">{fol.ownerName}</div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <span>{fol.ownerEmail}</span>
                        <span className="text-[9px] font-extrabold uppercase px-1 rounded bg-primary/10 text-primary">
                          {fol.ownerPlan}
                        </span>
                      </div>
                    </td>

                    {/* Template & Theme */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-foreground">{fol.templateName}</div>
                      <div className="text-[11px] text-muted-foreground font-semibold">{fol.themeName}</div>
                    </td>

                    {/* Status & Visibility */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div>{getStatusBadge(fol.status)}</div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase block">
                          {fol.visibility}
                        </span>
                      </div>
                    </td>

                    {/* SEO / Perf */}
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span className="text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded mr-1">
                        SEO: {fol.seoScore}
                      </span>
                      <span className="text-sky-600 bg-sky-500/10 px-1.5 py-0.5 rounded">
                        Perf: {fol.performanceScore}
                      </span>
                    </td>

                    {/* Views */}
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      {fol.viewsCount.toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onViewPortfolio(fol)}
                          title="360° Portfolio Details"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditPortfolio(fol)}
                          title="Edit Portfolio Metadata"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onPublishUnpublish(fol)}
                          title={fol.status === "published" ? "Unpublish" : "Publish"}
                          className={`p-1.5 rounded-lg ${
                            fol.status === "published"
                              ? "text-amber-600 hover:bg-amber-500/10"
                              : "text-emerald-600 hover:bg-emerald-500/10"
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onTransferOwnership(fol)}
                          title="Transfer Ownership"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-indigo-600 hover:bg-indigo-500/10"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeletePortfolio(fol)}
                          title="Delete Portfolio"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {result && (
        <div className="p-4 border-t border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Show</span>
            <select
              value={query.limit || 10}
              onChange={(e) => onChangeQuery({ limit: parseInt(e.target.value, 10), page: 1 })}
              className="bg-background border border-border rounded-lg px-2 py-1 text-xs focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-muted-foreground font-medium mr-2">
              Page {result.page} of {result.totalPages}
            </span>
            <button
              disabled={result.page <= 1}
              onClick={() => onChangeQuery({ page: result.page - 1 })}
              className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={result.page >= result.totalPages}
              onClick={() => onChangeQuery({ page: result.page + 1 })}
              className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
