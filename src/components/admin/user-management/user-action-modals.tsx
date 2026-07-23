"use client";

import React, { useState } from "react";
import { EnterpriseUser, EnterpriseRole, SubscriptionPlanType } from "@/types/admin-user";
import {
  X,
  AlertTriangle,
  Shield,
  Ban,
  Trash2,
  Edit,
  UserCheck,
  CheckCircle2,
  LogOut,
} from "lucide-react";

// Edit User Modal
interface EditUserModalProps {
  user: EnterpriseUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: Partial<EnterpriseUser>) => void;
}

export function EditUserModal({ user, isOpen, onClose, onSave }: EditUserModalProps) {
  if (!isOpen || !user) return null;

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [country, setCountry] = useState(user.country);
  const [timezone, setTimezone] = useState(user.timezone);
  const [role, setRole] = useState(user.role);
  const [subscriptionPlan, setSubscriptionPlan] = useState(user.subscriptionPlan);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      username,
      email,
      phoneNumber,
      country,
      timezone,
      role: role as EnterpriseRole,
      subscriptionPlan: subscriptionPlan as SubscriptionPlanType,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-border bg-muted/20 flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Edit className="w-4 h-4 text-primary" /> Edit User Profile — {user.name}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Timezone</label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Assigned Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="USER">USER</option>
                <option value="PRO_USER">PRO_USER</option>
                <option value="BUSINESS_USER">BUSINESS_USER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                <option value="SUPPORT_AGENT">SUPPORT_AGENT</option>
                <option value="FINANCE_MANAGER">FINANCE_MANAGER</option>
                <option value="DEVELOPER">DEVELOPER</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Subscription Plan</label>
              <select
                value={subscriptionPlan}
                onChange={(e) => setSubscriptionPlan(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="FREE">FREE</option>
                <option value="PRO">PRO</option>
                <option value="BUSINESS">BUSINESS</option>
                <option value="ENTERPRISE">ENTERPRISE</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold bg-secondary hover:bg-secondary/80 border border-border rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Suspend User Modal
interface SuspendUserModalProps {
  user: EnterpriseUser | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, durationDays?: number) => void;
}

export function SuspendUserModal({ user, isOpen, onClose, onConfirm }: SuspendUserModalProps) {
  if (!isOpen || !user) return null;

  const [reason, setReason] = useState("");
  const [durationDays, setDurationDays] = useState<number>(7);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(reason, durationDays);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left">
        <div className="p-5 border-b border-border bg-rose-500/10 flex items-center justify-between">
          <h3 className="text-base font-bold text-rose-600 flex items-center gap-2">
            <Ban className="w-4 h-4" /> Suspend User Account
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-muted-foreground">
            You are about to suspend <span className="font-bold text-foreground">{user.name}</span> ({user.email}). Suspended users will immediately lose access to their published portfolios and dashboard until reactivated.
          </p>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Reason for Suspension</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Terms of Service violation, payment chargeback, or security investigation..."
              required
              rows={3}
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Duration (Days)</label>
            <select
              value={durationDays}
              onChange={(e) => setDurationDays(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none"
            >
              <option value={1}>1 Day</option>
              <option value={7}>7 Days</option>
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
              <option value={9999}>Indefinite</option>
            </select>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold bg-secondary hover:bg-secondary/80 border border-border rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all shadow-xs"
            >
              Confirm Suspension
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete User Safety Modal
interface DeleteUserModalProps {
  user: EnterpriseUser | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (confirmationInput: string) => void;
}

export function DeleteUserModal({ user, isOpen, onClose, onConfirm }: DeleteUserModalProps) {
  if (!isOpen || !user) return null;

  const [inputVal, setInputVal] = useState("");
  const targetCheck = user.email;

  const isConfirmed = inputVal.trim() === targetCheck;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirmed) return;
    onConfirm(inputVal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-rose-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left">
        <div className="p-5 border-b border-border bg-rose-500/15 flex items-center justify-between">
          <h3 className="text-base font-bold text-rose-600 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Permanently Delete User Account
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs text-rose-700 dark:text-rose-400 space-y-1">
            <p className="font-bold">CAUTION: THIS ACTION CANNOT BE UNDONE</p>
            <p>
              Deleting <span className="font-bold">{user.name}</span> will permanently wipe all portfolios, resumes, domain mappings, and billing ties.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground block">
              To verify, type <span className="font-mono font-bold text-foreground">{targetCheck}</span> below:
            </label>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={targetCheck}
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-mono"
            />
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold bg-secondary hover:bg-secondary/80 border border-border rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isConfirmed}
              className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700 disabled:opacity-40 transition-all shadow-xs"
            >
              Permanently Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Impersonation Banner Component
interface ImpersonationBannerProps {
  user: EnterpriseUser | null;
  onExit: () => void;
}

export function ImpersonationBanner({ user, onExit }: ImpersonationBannerProps) {
  if (!user) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 px-6 py-2.5 shadow-lg flex items-center justify-between font-semibold text-xs animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-2">
        <UserCheck className="w-4 h-4 font-bold" />
        <span>
          IMPERSONATION MODE ACTIVE: Currently acting as <span className="font-black underline">{user.name}</span> ({user.email})
        </span>
      </div>
      <button
        onClick={onExit}
        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 text-white hover:bg-slate-900 transition-all text-xs font-bold shadow-xs"
      >
        <LogOut className="w-3.5 h-3.5" /> Exit Impersonation Mode
      </button>
    </div>
  );
}
