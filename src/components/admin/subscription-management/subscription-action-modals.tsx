"use client";

import React, { useState } from "react";
import { AdminSubscription } from "@/types/admin-billing";
import { SubscriptionPlanType } from "@/types/admin-user";
import { X, CreditCard, DollarSign, Ban, PauseCircle, Gift, AlertTriangle } from "lucide-react";

// Plan Override Modal
interface PlanOverrideModalProps {
  subscription: AdminSubscription | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newPlan: SubscriptionPlanType) => void;
}

export function PlanOverrideModal({ subscription, isOpen, onClose, onConfirm }: PlanOverrideModalProps) {
  if (!isOpen || !subscription) return null;
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanType>(subscription.plan);

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-left">
        <div className="p-5 border-b border-border bg-muted/20 flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" /> Change Subscription Plan
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onConfirm(selectedPlan);
            onClose();
          }}
          className="p-6 space-y-4 text-xs"
        >
          <p className="text-muted-foreground">
            Adjust plan level for <span className="font-bold text-foreground">{subscription.customerName}</span> ({subscription.customerEmail}). Current Plan: <span className="font-bold">{subscription.plan}</span>.
          </p>

          <div>
            <label className="font-bold text-muted-foreground block mb-1">New Plan Level</label>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none"
            >
              <option value="FREE">FREE ($0/mo)</option>
              <option value="PRO">PRO ($29/mo)</option>
              <option value="BUSINESS">BUSINESS ($99/mo)</option>
              <option value="ENTERPRISE">ENTERPRISE ($499/mo)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 font-semibold bg-secondary rounded-xl">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 font-bold bg-primary text-primary-foreground rounded-xl shadow-xs">
              Apply Plan Change
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Refund Modal
interface RefundModalProps {
  subscription: AdminSubscription | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number, reason: string) => void;
}

export function RefundModal({ subscription, isOpen, onClose, onConfirm }: RefundModalProps) {
  if (!isOpen || !subscription) return null;
  const [amount, setAmount] = useState<number>(subscription.amount);
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden text-left">
        <div className="p-5 border-b border-border bg-emerald-500/10 flex items-center justify-between">
          <h3 className="text-base font-bold text-emerald-600 flex items-center gap-2">
            <DollarSign className="w-5 h-5" /> Issue Customer Refund
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onConfirm(amount, reason);
            onClose();
          }}
          className="p-6 space-y-4 text-xs"
        >
          <p className="text-muted-foreground">
            Issue a partial or full refund to <span className="font-bold text-foreground">{subscription.customerName}</span> via <span className="uppercase font-bold">{subscription.paymentProvider}</span>.
          </p>

          <div>
            <label className="font-bold text-muted-foreground block mb-1">Refund Amount ($)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              required
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-muted-foreground block mb-1">Refund Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Customer satisfaction, duplicate charge, or support resolution..."
              required
              rows={3}
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 font-semibold bg-secondary rounded-xl">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 font-bold bg-emerald-600 text-white rounded-xl shadow-xs">
              Confirm Refund
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
