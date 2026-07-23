"use client";

import React, { useState } from "react";
import { AdminPortfolio } from "@/types/admin-portfolio";
import {
  X,
  Folder,
  Globe,
  User,
  GitBranch,
  HardDrive,
  BarChart3,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Edit,
  Trash2,
  UserCheck,
} from "lucide-react";

interface PortfolioDetailDrawerProps {
  portfolio: AdminPortfolio | null;
  onClose: () => void;
  onEdit: (p: AdminPortfolio) => void;
  onPublishUnpublish: (p: AdminPortfolio) => void;
  onTransfer: (p: AdminPortfolio) => void;
  onDelete: (p: AdminPortfolio) => void;
}

export function PortfolioDetailDrawer({
  portfolio,
  onClose,
  onEdit,
  onPublishUnpublish,
  onTransfer,
  onDelete,
}: PortfolioDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "versions" | "media" | "analytics" | "moderation">("overview");

  if (!portfolio) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-background/80 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-2xl bg-card border-l border-border h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-border bg-muted/20 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground">{portfolio.name}</h3>
              <span className="text-xs text-muted-foreground font-mono">({portfolio.id})</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Owned by <span className="font-bold text-foreground">{portfolio.ownerName}</span> ({portfolio.ownerEmail})
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                {portfolio.templateName}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                {portfolio.themeName}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  portfolio.status === "published"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-amber-500/10 text-amber-600"
                }`}
              >
                {portfolio.status.toUpperCase()}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="px-6 py-3 border-b border-border bg-card flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => onEdit(portfolio)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-secondary hover:bg-secondary/80 border border-border rounded-lg"
          >
            <Edit className="w-3.5 h-3.5" /> Edit Metadata
          </button>
          <button
            onClick={() => onPublishUnpublish(portfolio)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> {portfolio.status === "published" ? "Unpublish" : "Publish"}
          </button>
          <button
            onClick={() => onTransfer(portfolio)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-secondary hover:bg-secondary/80 border border-border rounded-lg"
          >
            <UserCheck className="w-3.5 h-3.5" /> Transfer Ownership
          </button>
          <button
            onClick={() => onDelete(portfolio)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>

        {/* Tab Header */}
        <div className="px-6 border-b border-border bg-muted/10 flex items-center gap-4 text-xs font-semibold">
          {[
            { id: "overview", label: "Overview", icon: Folder },
            { id: "versions", label: "Version History", icon: GitBranch },
            { id: "media", label: "Media & Assets", icon: HardDrive },
            { id: "analytics", label: "Traffic Analytics", icon: BarChart3 },
            { id: "moderation", label: "Moderation Logs", icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 py-3 border-b-2 transition-all ${
                  isActive
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-background space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Subdomain URL</span>
                  <p className="text-xs font-mono font-bold text-foreground">{portfolio.subdomain}</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Custom Domain</span>
                  <p className="text-xs font-mono font-bold text-emerald-600">
                    {portfolio.customDomain || "Not configured"}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">SEO Score</span>
                  <p className="text-sm font-bold text-emerald-600">{portfolio.seoScore} / 100</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Performance Score</span>
                  <p className="text-sm font-bold text-sky-600">{portfolio.performanceScore} / 100</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Created At</span>
                  <p className="text-xs font-semibold text-foreground">{new Date(portfolio.createdAt).toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Last Updated</span>
                  <p className="text-xs font-semibold text-foreground">{new Date(portfolio.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "versions" && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase">Version Release Timeline</h4>
              {portfolio.versionsHistory.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                  No version release history recorded.
                </div>
              ) : (
                portfolio.versionsHistory.map((ver) => (
                  <div key={ver.id} className="p-3.5 rounded-xl border border-border bg-card space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-primary">{ver.versionNumber}</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(ver.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-foreground font-medium">{ver.changeSummary}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-card text-center space-y-1">
                  <span className="text-2xl font-black text-primary">{portfolio.analytics.totalViews.toLocaleString()}</span>
                  <span className="text-xs font-semibold text-muted-foreground block">Total Views</span>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card text-center space-y-1">
                  <span className="text-2xl font-black text-emerald-600">{portfolio.analytics.uniqueVisitors.toLocaleString()}</span>
                  <span className="text-xs font-semibold text-muted-foreground block">Unique Visitors</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card space-y-3 text-xs">
                <h5 className="font-bold text-foreground">Traffic Sources Breakdown</h5>
                {portfolio.analytics.trafficSources.map((src) => (
                  <div key={src.source} className="space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span>{src.source}</span>
                      <span>{src.count} ({src.percentage}%)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${src.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "moderation" && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-foreground uppercase">Content Moderation &amp; Review Notes</h4>
              {portfolio.moderationInfo ? (
                <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs text-rose-700 dark:text-rose-400 space-y-2">
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" /> Moderation Notice
                  </p>
                  <p>Flag Reason: {portfolio.moderationInfo.flagReason}</p>
                  <p>Review Status: <span className="font-bold uppercase">{portfolio.moderationInfo.reviewStatus}</span></p>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                  No moderation flags or safety reports on file for this portfolio.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
