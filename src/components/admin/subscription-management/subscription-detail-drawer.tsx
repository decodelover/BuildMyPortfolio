"use client";

import React, { useState } from "react";
import { AdminSubscription } from "@/types/admin-billing";
import {
  X,
  CreditCard,
  User,
  FileText,
  Sparkles,
  Tag,
  Clock,
  Gift,
  DollarSign,
  PauseCircle,
  CheckCircle2,
  AlertTriangle,
  Download,
  Calendar,
  HardDrive,
} from "lucide-react";

interface SubscriptionDetailDrawerProps {
  subscription: AdminSubscription | null;
  onClose: () => void;
  onUpgradeDowngrade: (sub: AdminSubscription) => void;
  onGrantComp: (sub: AdminSubscription) => void;
  onRefund: (sub: AdminSubscription) => void;
  onPauseCancel: (sub: AdminSubscription) => void;
}

export function SubscriptionDetailDrawer({
  subscription,
  onClose,
  onUpgradeDowngrade,
  onGrantComp,
  onRefund,
  onPauseCancel,
}: SubscriptionDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "invoices" | "usage" | "discounts" | "timeline">("overview");

  if (!subscription) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-background/80 backdrop-blur-xs flex justify-end transition-opacity">
      <div
        className="w-full max-w-2xl bg-card border-l border-border h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 border-b border-border bg-muted/20 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground">{subscription.customerName}</h3>
              <span className="text-xs text-muted-foreground font-mono">({subscription.customerId})</span>
            </div>
            <p className="text-xs text-muted-foreground">{subscription.customerEmail}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                {subscription.plan} PLAN
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                {subscription.billingCycle} (${subscription.amount})
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  subscription.status === "active"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-rose-500/10 text-rose-600"
                }`}
              >
                {subscription.status.toUpperCase()}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="px-6 py-3 border-b border-border bg-card flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => onUpgradeDowngrade(subscription)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all shadow-xs"
          >
            <CreditCard className="w-3.5 h-3.5" /> Change Plan
          </button>
          <button
            onClick={() => onGrantComp(subscription)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-all"
          >
            <Gift className="w-3.5 h-3.5" /> Grant Comp Access
          </button>
          <button
            onClick={() => onRefund(subscription)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all"
          >
            <DollarSign className="w-3.5 h-3.5" /> Issue Refund
          </button>
          <button
            onClick={() => onPauseCancel(subscription)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 rounded-lg transition-all"
          >
            <PauseCircle className="w-3.5 h-3.5" /> Pause / Cancel
          </button>
        </div>

        {/* Tabs Header */}
        <div className="px-6 border-b border-border bg-muted/10 flex items-center gap-4 text-xs font-semibold">
          {[
            { id: "overview", label: "Overview", icon: CreditCard },
            { id: "usage", label: "Usage & Limits", icon: Sparkles },
            { id: "discounts", label: "Discounts & Coupons", icon: Tag },
            { id: "timeline", label: "Billing Audit Events", icon: Clock },
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
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Subscription ID</span>
                  <p className="text-xs font-mono font-bold text-foreground">{subscription.id}</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">MRR Contribution</span>
                  <p className="text-base font-bold text-emerald-600">${subscription.mrrContribution}.00/mo</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Current Period Start</span>
                  <p className="text-xs font-semibold text-foreground">{new Date(subscription.currentPeriodStart).toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Current Period Renewal</span>
                  <p className="text-xs font-semibold text-foreground">{new Date(subscription.currentPeriodEnd).toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Payment Provider</span>
                  <p className="text-xs font-semibold text-foreground uppercase">{subscription.paymentProvider}</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Payment Method</span>
                  <p className="text-xs font-semibold text-foreground">
                    {subscription.paymentMethod.brand} {subscription.paymentMethod.last4 ? `•••• ${subscription.paymentMethod.last4}` : ""}
                  </p>
                </div>
              </div>

              {subscription.compAccessGrantedBy && (
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-700 dark:text-amber-400 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <Gift className="w-4 h-4" /> Complimentary Access Active
                  </p>
                  <p>Granted by Admin: {subscription.compAccessGrantedBy}. Reason: {subscription.compAccessReason}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "usage" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-card text-center space-y-1">
                  <span className="text-2xl font-black text-primary">{subscription.usageSummary.portfolioCount}</span>
                  <span className="text-xs font-semibold text-muted-foreground block">Portfolios Created</span>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card text-center space-y-1">
                  <span className="text-2xl font-black text-emerald-600">{subscription.usageSummary.publishedCount}</span>
                  <span className="text-xs font-semibold text-muted-foreground block">Published Live</span>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card text-center space-y-1">
                  <span className="text-2xl font-black text-indigo-600">{subscription.usageSummary.resumeCount}</span>
                  <span className="text-xs font-semibold text-muted-foreground block">AI Resumes</span>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card text-center space-y-1">
                  <span className="text-2xl font-black text-amber-500">{subscription.usageSummary.storageUsageMB} MB</span>
                  <span className="text-xs font-semibold text-muted-foreground block">Asset Storage</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "discounts" && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-foreground uppercase">Applied Promotional Coupons</h4>
              {subscription.appliedCoupons.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                  No promotional coupons applied to this subscription.
                </div>
              ) : (
                subscription.appliedCoupons.map((c) => (
                  <div key={c.couponId} className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-primary">{c.code}</span>
                      <span className="text-muted-foreground text-[11px] block">
                        Discount: {c.discountValue}% Off ({c.discountType})
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">Applied {c.appliedAt}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase">Billing Event Stream</h4>
              {subscription.eventsTimeline.map((evt) => (
                <div key={evt.id} className="p-3.5 rounded-xl border border-border bg-card space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-primary">{evt.action}</span>
                    <span className="text-[10px] text-muted-foreground">{new Date(evt.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-foreground font-medium">{evt.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
