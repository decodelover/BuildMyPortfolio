"use client";

import React from "react";
import {
  Ban,
  Trash2,
  Shield,
  CreditCard,
  Download,
  X,
  Send,
  Users,
} from "lucide-react";
import { EnterpriseRole, SubscriptionPlanType } from "@/types/admin-user";

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkSuspend: () => void;
  onBulkDelete: () => void;
  onBulkAssignRole: (role: EnterpriseRole) => void;
  onBulkAssignPlan: (plan: SubscriptionPlanType) => void;
  onBulkExport: (format: "csv" | "json") => void;
}

export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onBulkSuspend,
  onBulkDelete,
  onBulkAssignRole,
  onBulkAssignPlan,
  onBulkExport,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-foreground text-background px-6 py-3 rounded-2xl shadow-2xl border border-border/40 flex items-center gap-4 animate-in slide-in-from-bottom duration-300 backdrop-blur-md">
      {/* Selected Indicator */}
      <div className="flex items-center gap-2 border-r border-background/20 pr-4 text-xs font-bold">
        <Users className="w-4 h-4 text-primary" />
        <span>{selectedCount} Selected</span>
        <button
          onClick={onClearSelection}
          className="p-1 rounded-full hover:bg-background/20 text-background/80 hover:text-background transition-all ml-1"
          title="Clear selection"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 text-xs">
        {/* Bulk Suspend */}
        <button
          onClick={onBulkSuspend}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition-all shadow-xs"
        >
          <Ban className="w-3.5 h-3.5" /> Suspend
        </button>

        {/* Assign Role Dropdown */}
        <div className="relative group">
          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                onBulkAssignRole(e.target.value as EnterpriseRole);
                e.target.value = "";
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-background/20 text-background font-semibold hover:bg-background/30 focus:outline-none cursor-pointer"
          >
            <option value="" disabled className="text-foreground bg-card">
              Assign Role...
            </option>
            <option value="USER" className="text-foreground bg-card">User</option>
            <option value="PRO_USER" className="text-foreground bg-card">Pro User</option>
            <option value="BUSINESS_USER" className="text-foreground bg-card">Business User</option>
            <option value="ADMIN" className="text-foreground bg-card">Admin</option>
            <option value="SUPPORT_AGENT" className="text-foreground bg-card">Support Agent</option>
            <option value="FINANCE_MANAGER" className="text-foreground bg-card">Finance Manager</option>
            <option value="DEVELOPER" className="text-foreground bg-card">Developer</option>
          </select>
        </div>

        {/* Assign Plan Dropdown */}
        <div className="relative group">
          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                onBulkAssignPlan(e.target.value as SubscriptionPlanType);
                e.target.value = "";
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-background/20 text-background font-semibold hover:bg-background/30 focus:outline-none cursor-pointer"
          >
            <option value="" disabled className="text-foreground bg-card">
              Assign Plan...
            </option>
            <option value="FREE" className="text-foreground bg-card">FREE</option>
            <option value="PRO" className="text-foreground bg-card">PRO</option>
            <option value="BUSINESS" className="text-foreground bg-card">BUSINESS</option>
            <option value="ENTERPRISE" className="text-foreground bg-card">ENTERPRISE</option>
          </select>
        </div>

        {/* Export CSV / JSON */}
        <button
          onClick={() => onBulkExport("csv")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background/20 text-background font-semibold hover:bg-background/30 transition-all"
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>

        {/* Bulk Delete */}
        <button
          onClick={onBulkDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/30 text-rose-300 hover:bg-rose-600 hover:text-white font-bold transition-all border border-rose-500/40"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>
    </div>
  );
}
