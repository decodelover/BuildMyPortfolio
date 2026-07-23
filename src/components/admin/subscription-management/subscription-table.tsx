"use client";

import React from "react";
import {
  AdminSubscription,
  SubscriptionDirectoryQuery,
  SubscriptionDirectoryResult,
} from "@/types/admin-billing";
import {
  CheckCircle2,
  AlertTriangle,
  Ban,
  Sparkles,
  Briefcase,
  Eye,
  Edit,
  DollarSign,
  PauseCircle,
  XCircle,
  Gift,
  ChevronLeft,
  ChevronRight,
  CreditCard,
} from "lucide-react";

interface SubscriptionTableProps {
  result: SubscriptionDirectoryResult | null;
  query: SubscriptionDirectoryQuery;
  onChangeQuery: (newQuery: Partial<SubscriptionDirectoryQuery>) => void;
  onViewSubscription: (sub: AdminSubscription) => void;
  onUpgradeDowngrade: (sub: AdminSubscription) => void;
  onGrantComp: (sub: AdminSubscription) => void;
  onRefund: (sub: AdminSubscription) => void;
  onPauseCancel: (sub: AdminSubscription) => void;
  isLoading: boolean;
}

export function SubscriptionTable({
  result,
  query,
  onChangeQuery,
  onViewSubscription,
  onUpgradeDowngrade,
  onGrantComp,
  onRefund,
  onPauseCancel,
  isLoading,
}: SubscriptionTableProps) {
  const subscriptions = result?.subscriptions || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        );
      case "past_due":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20">
            <AlertTriangle className="w-3 h-3" /> Past Due
          </span>
        );
      case "canceled":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
            <Ban className="w-3 h-3" /> Canceled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 border border-sky-500/20">
            Trialing
          </span>
        );
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "ENTERPRISE":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs">
            <Sparkles className="w-3 h-3 text-amber-300" /> ENTERPRISE
          </span>
        );
      case "BUSINESS":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-sky-500/15 text-sky-600 border border-sky-500/30">
            <Briefcase className="w-3 h-3" /> BUSINESS
          </span>
        );
      case "PRO":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
            PRO
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
            FREE
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
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Plan Level</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Cycle &amp; MRR</th>
              <th className="py-3.5 px-4">Payment Method</th>
              <th className="py-3.5 px-4">Current Period Renewal</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 px-4"><div className="w-36 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4"><div className="w-20 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4"><div className="w-16 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4"><div className="w-24 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4"><div className="w-28 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4"><div className="w-24 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4 text-right"><div className="w-16 h-6 bg-muted rounded ml-auto" /></td>
                </tr>
              ))
            ) : subscriptions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-muted-foreground space-y-2">
                  <p className="text-sm font-semibold text-foreground">No subscriptions match criteria</p>
                  <p className="text-xs">Adjust status, plan, or provider filter options.</p>
                </td>
              </tr>
            ) : (
              subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-muted/20 transition-colors">
                  {/* Customer */}
                  <td className="py-3.5 px-4">
                    <div
                      onClick={() => onViewSubscription(sub)}
                      className="font-bold text-foreground hover:text-primary cursor-pointer transition-colors"
                    >
                      {sub.customerName}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{sub.customerEmail}</div>
                  </td>

                  {/* Plan */}
                  <td className="py-3.5 px-4">{getPlanBadge(sub.plan)}</td>

                  {/* Status */}
                  <td className="py-3.5 px-4">{getStatusBadge(sub.status)}</td>

                  {/* Cycle & MRR */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-foreground">${sub.mrrContribution}/mo</div>
                    <div className="text-[10px] text-muted-foreground capitalize font-semibold">
                      {sub.billingCycle} (${sub.amount})
                    </div>
                  </td>

                  {/* Payment Method */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-foreground capitalize flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-primary" />
                      <span>{sub.paymentMethod.brand || sub.paymentProvider}</span>
                      {sub.paymentMethod.last4 && (
                        <span className="font-mono text-[10px] text-muted-foreground">
                          •••• {sub.paymentMethod.last4}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">
                      Provider: {sub.paymentProvider}
                    </div>
                  </td>

                  {/* Renewal Date */}
                  <td className="py-3.5 px-4 font-medium text-foreground">
                    {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewSubscription(sub)}
                        title="360° Subscription Details"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onUpgradeDowngrade(sub)}
                        title="Change / Override Plan"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onGrantComp(sub)}
                        title="Grant Complimentary VIP Access"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10 transition-all"
                      >
                        <Gift className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRefund(sub)}
                        title="Issue Refund"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10 transition-all"
                      >
                        <DollarSign className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onPauseCancel(sub)}
                        title="Pause / Cancel Subscription"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-all"
                      >
                        <PauseCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
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
