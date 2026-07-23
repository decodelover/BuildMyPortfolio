"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CreditCard, DollarSign, FileText, BarChart2, Tag, CheckCircle2, AlertTriangle, X } from "lucide-react";
import {
  AdminSubscription,
  SubscriptionDirectoryQuery,
  SubscriptionDirectoryResult,
} from "@/types/admin-billing";
import { SubscriptionPlanType } from "@/types/admin-user";
import { SubscriptionToolbar } from "./subscription-management/subscription-toolbar";
import { SubscriptionTable } from "./subscription-management/subscription-table";
import { SubscriptionDetailDrawer } from "./subscription-management/subscription-detail-drawer";
import { PlanOverrideModal, RefundModal } from "./subscription-management/subscription-action-modals";
import { InvoicePaymentManager } from "./subscription-management/invoice-payment-manager";
import { FinancialAnalyticsOverview } from "./subscription-management/financial-analytics-overview";
import { PromotionsManager } from "./subscription-management/promotions-manager";

export function AdminSubscriptionManagement() {
  const [activeTab, setActiveTab] = useState<"subscriptions" | "invoices" | "analytics" | "promotions">("subscriptions");

  // Query state
  const [query, setQuery] = useState<SubscriptionDirectoryQuery>({
    search: "",
    status: "ALL",
    plan: "ALL",
    paymentProvider: "ALL",
    billingCycle: "ALL",
    sortBy: "currentPeriodEnd",
    sortOrder: "asc",
    page: 1,
    limit: 10,
  });

  const [directoryResult, setDirectoryResult] = useState<SubscriptionDirectoryResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Selected subscription for drawer/modals
  const [viewingSub, setViewingSub] = useState<AdminSubscription | null>(null);
  const [overrideSub, setOverrideSub] = useState<AdminSubscription | null>(null);
  const [refundSub, setRefundSub] = useState<AdminSubscription | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.search) params.set("search", query.search);
      if (query.status && query.status !== "ALL") params.set("status", query.status);
      if (query.plan && query.plan !== "ALL") params.set("plan", query.plan);
      if (query.paymentProvider && query.paymentProvider !== "ALL") params.set("paymentProvider", query.paymentProvider);
      if (query.billingCycle && query.billingCycle !== "ALL") params.set("billingCycle", query.billingCycle);
      if (query.sortBy) params.set("sortBy", query.sortBy);
      if (query.sortOrder) params.set("sortOrder", query.sortOrder);
      params.set("page", query.page.toString());
      params.set("limit", query.limit.toString());

      const res = await fetch(`/api/admin/subscriptions?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load subscriptions directory.");
      const data = await res.json();
      setDirectoryResult(data);
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (activeTab === "subscriptions") {
      fetchSubscriptions();
    }
  }, [activeTab, fetchSubscriptions]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Actions
  const handleConfirmPlanChange = async (newPlan: SubscriptionPlanType) => {
    if (!overrideSub) return;
    try {
      const res = await fetch(`/api/admin/subscriptions/${overrideSub.id}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upgrade", newPlan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Plan change failed.");
      showToast(`Subscription plan updated to ${newPlan}.`);
      fetchSubscriptions();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleConfirmRefund = async (amount: number, reason: string) => {
    if (!refundSub) return;
    try {
      const res = await fetch(`/api/admin/subscriptions/${refundSub.id}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "refund", refundAmount: amount, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Refund failed.");
      showToast(`Refund of $${amount.toFixed(2)} issued successfully.`);
      fetchSubscriptions();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleGrantCompAccess = async (sub: AdminSubscription) => {
    try {
      const res = await fetch(`/api/admin/subscriptions/${sub.id}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "grant_comp", newPlan: "BUSINESS", reason: "Administrative VIP Grant" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Grant comp failed.");
      showToast(`Granted complimentary BUSINESS access to ${sub.customerName}.`);
      fetchSubscriptions();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handlePauseCancel = async (sub: AdminSubscription) => {
    if (!confirm(`Cancel subscription for ${sub.customerName}?`)) return;
    try {
      const res = await fetch(`/api/admin/subscriptions/${sub.id}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel", reason: "Administrative cancellation" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cancellation failed.");
      showToast(`Subscription for ${sub.customerName} canceled.`);
      fetchSubscriptions();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="space-y-6 text-left relative pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Enterprise Subscription &amp; Billing Management Console
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage customer subscriptions, invoices, refunds, financial metrics, and promotional campaigns without direct Firebase access.
          </p>
        </div>

        {directoryResult && (
          <div className="flex items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 font-bold">
              Total MRR: ${directoryResult.stats.totalMRR.toLocaleString()}/mo
            </div>
            <div className="px-3 py-1.5 rounded-xl border border-border bg-card font-semibold">
              Active: <span className="font-bold text-foreground">{directoryResult.stats.activeCount}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Section Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto text-xs font-bold">
        {[
          { id: "subscriptions", label: "Subscriptions Directory", icon: CreditCard },
          { id: "invoices", label: "Payments & Invoices", icon: FileText },
          { id: "analytics", label: "Financial Analytics", icon: BarChart2 },
          { id: "promotions", label: "Promotions & Coupons", icon: Tag },
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
          <button onClick={() => setNotification(null)}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TAB 1: SUBSCRIPTIONS DIRECTORY */}
      {activeTab === "subscriptions" && (
        <div className="space-y-6">
          <SubscriptionToolbar
            query={query}
            onChangeQuery={(newQ) => setQuery({ ...query, ...newQ })}
            onResetFilters={() =>
              setQuery({
                search: "",
                status: "ALL",
                plan: "ALL",
                paymentProvider: "ALL",
                billingCycle: "ALL",
                sortBy: "currentPeriodEnd",
                sortOrder: "asc",
                page: 1,
                limit: 10,
              })
            }
            onRefresh={fetchSubscriptions}
            totalResults={directoryResult?.total || 0}
            isLoading={isLoading}
          />

          <SubscriptionTable
            result={directoryResult}
            query={query}
            onChangeQuery={(newQ) => setQuery({ ...query, ...newQ })}
            onViewSubscription={setViewingSub}
            onUpgradeDowngrade={setOverrideSub}
            onGrantComp={handleGrantCompAccess}
            onRefund={setRefundSub}
            onPauseCancel={handlePauseCancel}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* TAB 2: PAYMENTS & INVOICES */}
      {activeTab === "invoices" && <InvoicePaymentManager />}

      {/* TAB 3: FINANCIAL ANALYTICS */}
      {activeTab === "analytics" && <FinancialAnalyticsOverview />}

      {/* TAB 4: PROMOTIONS & COUPONS */}
      {activeTab === "promotions" && <PromotionsManager />}

      {/* 360 Subscription Drawer */}
      <SubscriptionDetailDrawer
        subscription={viewingSub}
        onClose={() => setViewingSub(null)}
        onUpgradeDowngrade={(s) => {
          setViewingSub(null);
          setOverrideSub(s);
        }}
        onGrantComp={(s) => {
          setViewingSub(null);
          handleGrantCompAccess(s);
        }}
        onRefund={(s) => {
          setViewingSub(null);
          setRefundSub(s);
        }}
        onPauseCancel={(s) => {
          setViewingSub(null);
          handlePauseCancel(s);
        }}
      />

      {/* Action Modals */}
      <PlanOverrideModal
        subscription={overrideSub}
        isOpen={Boolean(overrideSub)}
        onClose={() => setOverrideSub(null)}
        onConfirm={handleConfirmPlanChange}
      />

      <RefundModal
        subscription={refundSub}
        isOpen={Boolean(refundSub)}
        onClose={() => setRefundSub(null)}
        onConfirm={handleConfirmRefund}
      />
    </div>
  );
}
