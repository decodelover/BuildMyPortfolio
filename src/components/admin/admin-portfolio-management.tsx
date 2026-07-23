"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Folder, ShieldAlert, BarChart3, CheckCircle2, AlertTriangle, X, Sparkles } from "lucide-react";
import { AdminPortfolio, PortfolioDirectoryQuery, PortfolioDirectoryResult } from "@/types/admin-portfolio";
import { PortfolioToolbar } from "./portfolio-management/portfolio-toolbar";
import { PortfolioTable } from "./portfolio-management/portfolio-table";
import { PortfolioDetailDrawer } from "./portfolio-management/portfolio-detail-drawer";
import { PortfolioBulkBar } from "./portfolio-management/portfolio-bulk-bar";
import {
  EditPortfolioModal,
  TransferOwnershipModal,
  DeletePortfolioModal,
} from "./portfolio-management/portfolio-action-modals";
import { PortfolioModerationQueue } from "./portfolio-management/portfolio-moderation-queue";
import { PortfolioAnalyticsView } from "./portfolio-management/portfolio-analytics-view";

export function AdminPortfolioManagement() {
  const [activeTab, setActiveTab] = useState<"directory" | "moderation" | "analytics">("directory");

  const [query, setQuery] = useState<PortfolioDirectoryQuery>({
    search: "",
    status: "ALL",
    visibility: "ALL",
    templateId: "ALL",
    plan: "ALL",
    minSeoScore: 0,
    sortBy: "updatedAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  });

  const [directoryResult, setDirectoryResult] = useState<PortfolioDirectoryResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Drawers & Modals
  const [viewingPortfolio, setViewingPortfolio] = useState<AdminPortfolio | null>(null);
  const [editingPortfolio, setEditingPortfolio] = useState<AdminPortfolio | null>(null);
  const [transferringPortfolio, setTransferringPortfolio] = useState<AdminPortfolio | null>(null);
  const [deletingPortfolio, setDeletingPortfolio] = useState<AdminPortfolio | null>(null);

  const fetchPortfolios = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.search) params.set("search", query.search);
      if (query.status && query.status !== "ALL") params.set("status", query.status);
      if (query.visibility && query.visibility !== "ALL") params.set("visibility", query.visibility);
      if (query.plan && query.plan !== "ALL") params.set("plan", query.plan);
      if (query.templateId && query.templateId !== "ALL") params.set("templateId", query.templateId);
      if (query.minSeoScore) params.set("minSeoScore", query.minSeoScore.toString());
      if (query.sortBy) params.set("sortBy", query.sortBy);
      if (query.sortOrder) params.set("sortOrder", query.sortOrder);
      params.set("page", query.page.toString());
      params.set("limit", query.limit.toString());

      const res = await fetch(`/api/admin/portfolios?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load portfolio directory.");
      const data = await res.json();
      setDirectoryResult(data);
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (activeTab === "directory") {
      fetchPortfolios();
    }
  }, [activeTab, fetchPortfolios]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Select Handlers
  const handleToggleSelectAll = () => {
    if (!directoryResult) return;
    const pageIds = directoryResult.portfolios.map((p) => p.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(selectedIds.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds(Array.from(new Set([...selectedIds, ...pageIds])));
    }
  };

  const handleToggleSelectUser = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Actions
  const handlePublishUnpublish = async (p: AdminPortfolio) => {
    const action = p.status === "published" ? "unpublish" : "publish";
    try {
      const res = await fetch(`/api/admin/portfolios/${p.id}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed.");
      showToast(`Portfolio ${p.name} status updated to ${action}ed.`);
      fetchPortfolios();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleSaveEdit = async (updatedData: Partial<AdminPortfolio>) => {
    if (!editingPortfolio) return;
    showToast(`Updated portfolio ${editingPortfolio.name} metadata.`);
    fetchPortfolios();
  };

  const handleTransfer = async (newOwnerId: string, newOwnerEmail: string) => {
    if (!transferringPortfolio) return;
    try {
      const res = await fetch(`/api/admin/portfolios/${transferringPortfolio.id}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "transfer", newOwnerId, newOwnerEmail }),
      });
      if (res.ok) {
        showToast(`Transferred portfolio ownership to ${newOwnerEmail}.`);
        fetchPortfolios();
      }
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleDeleteConfirm = async (confirmationName: string) => {
    if (!deletingPortfolio) return;
    try {
      const res = await fetch(
        `/api/admin/portfolios/${deletingPortfolio.id}?confirmationName=${encodeURIComponent(confirmationName)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        showToast(`Permanently deleted portfolio ${deletingPortfolio.name}.`);
        fetchPortfolios();
      }
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // Bulk Actions
  const handleBulkAction = async (action: string) => {
    try {
      const res = await fetch("/api/admin/portfolios/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, portfolioIds: selectedIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bulk action failed.");
      showToast(`Executed ${action} across ${data.count} portfolios.`);
      setSelectedIds([]);
      fetchPortfolios();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="space-y-6 text-left relative pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Folder className="h-5 w-5 text-primary" />
            Enterprise Portfolio Management System
          </h2>
          <p className="text-xs text-muted-foreground">
            Search, manage, moderate, transfer ownership, and audit every portfolio across BuildMyPortfolio without manual database queries.
          </p>
        </div>

        {directoryResult && (
          <div className="flex items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-xl border border-border bg-card font-semibold">
              Total Portfolios: <span className="text-foreground font-bold">{directoryResult.stats.totalPortfolios}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 font-bold">
              Published: {directoryResult.stats.publishedCount}
            </div>
            <div className="px-3 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 font-bold">
              Flagged: {directoryResult.stats.flaggedCount}
            </div>
          </div>
        )}
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto text-xs font-bold">
        {[
          { id: "directory", label: "Portfolios Directory", icon: Folder },
          { id: "moderation", label: "Moderation Queue", icon: ShieldAlert },
          { id: "analytics", label: "Traffic Analytics", icon: BarChart3 },
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

      {/* Toast Notification */}
      {notification && (
        <div
          className={`rounded-xl border p-3 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200 ${
            notification.type === "error"
              ? "border-rose-500/30 bg-rose-500/10 text-rose-600"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "error" ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)}><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* TAB 1: DIRECTORY */}
      {activeTab === "directory" && (
        <div className="space-y-6">
          <PortfolioToolbar
            query={query}
            onChangeQuery={(newQ) => setQuery({ ...query, ...newQ })}
            onResetFilters={() =>
              setQuery({
                search: "",
                status: "ALL",
                visibility: "ALL",
                templateId: "ALL",
                plan: "ALL",
                minSeoScore: 0,
                sortBy: "updatedAt",
                sortOrder: "desc",
                page: 1,
                limit: 10,
              })
            }
            onRefresh={fetchPortfolios}
            totalResults={directoryResult?.total || 0}
            isLoading={isLoading}
          />

          <PortfolioTable
            result={directoryResult}
            query={query}
            onChangeQuery={(newQ) => setQuery({ ...query, ...newQ })}
            selectedIds={selectedIds}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleSelectUser={handleToggleSelectUser}
            onViewPortfolio={setViewingPortfolio}
            onEditPortfolio={setEditingPortfolio}
            onPublishUnpublish={handlePublishUnpublish}
            onTransferOwnership={setTransferringPortfolio}
            onDeletePortfolio={setDeletingPortfolio}
            isLoading={isLoading}
          />

          <PortfolioBulkBar
            selectedCount={selectedIds.length}
            onClearSelection={() => setSelectedIds([])}
            onBulkPublish={() => handleBulkAction("publish")}
            onBulkUnpublish={() => handleBulkAction("unpublish")}
            onBulkArchive={() => handleBulkAction("archive")}
            onBulkDelete={() => handleBulkAction("delete")}
            onBulkRegenerateSEO={() => handleBulkAction("regenerate_seo")}
          />
        </div>
      )}

      {/* TAB 2: MODERATION QUEUE */}
      {activeTab === "moderation" && <PortfolioModerationQueue />}

      {/* TAB 3: TRAFFIC ANALYTICS */}
      {activeTab === "analytics" && <PortfolioAnalyticsView />}

      {/* 360 Portfolio Detail Drawer */}
      <PortfolioDetailDrawer
        portfolio={viewingPortfolio}
        onClose={() => setViewingPortfolio(null)}
        onEdit={(p) => {
          setViewingPortfolio(null);
          setEditingPortfolio(p);
        }}
        onPublishUnpublish={(p) => {
          setViewingPortfolio(null);
          handlePublishUnpublish(p);
        }}
        onTransfer={(p) => {
          setViewingPortfolio(null);
          setTransferringPortfolio(p);
        }}
        onDelete={(p) => {
          setViewingPortfolio(null);
          setDeletingPortfolio(p);
        }}
      />

      {/* Action Modals */}
      <EditPortfolioModal
        portfolio={editingPortfolio}
        isOpen={Boolean(editingPortfolio)}
        onClose={() => setEditingPortfolio(null)}
        onSave={handleSaveEdit}
      />

      <TransferOwnershipModal
        portfolio={transferringPortfolio}
        isOpen={Boolean(transferringPortfolio)}
        onClose={() => setTransferringPortfolio(null)}
        onConfirm={handleTransfer}
      />

      <DeletePortfolioModal
        portfolio={deletingPortfolio}
        isOpen={Boolean(deletingPortfolio)}
        onClose={() => setDeletingPortfolio(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
