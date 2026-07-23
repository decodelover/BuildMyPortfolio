"use client";

import React, { useState } from "react";
import { EnterpriseUser } from "@/types/admin-user";
import {
  X,
  User,
  Shield,
  CreditCard,
  HardDrive,
  Sparkles,
  FileText,
  HelpCircle,
  Activity,
  Key,
  Globe,
  Clock,
  CheckCircle2,
  Ban,
  AlertTriangle,
  Mail,
  Phone,
  LogOut,
  UserCheck,
  FileSpreadsheet,
  Download,
  Lock,
} from "lucide-react";

interface UserProfileDrawerProps {
  user: EnterpriseUser | null;
  onClose: () => void;
  onEdit: (user: EnterpriseUser) => void;
  onSuspend: (user: EnterpriseUser) => void;
  onReactivate: (user: EnterpriseUser) => void;
  onResetPassword: (user: EnterpriseUser) => void;
  onForceLogout: (user: EnterpriseUser) => void;
  onImpersonate: (user: EnterpriseUser) => void;
  onExport: (user: EnterpriseUser) => void;
}

export function UserProfileDrawer({
  user,
  onClose,
  onEdit,
  onSuspend,
  onReactivate,
  onResetPassword,
  onForceLogout,
  onImpersonate,
  onExport,
}: UserProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "subscription" | "financials" | "support" | "activity"
  >("overview");

  if (!user) return null;

  const formatStorage = (bytes: number) => {
    if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(2)} GB`;
    return `${(bytes / 1048576).toFixed(0)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-background/80 backdrop-blur-xs flex justify-end transition-opacity">
      <div
        className="w-full max-w-2xl bg-card border-l border-border h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Drawer Header */}
        <div className="p-6 border-b border-border bg-muted/20 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 shadow-xs"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary font-bold text-xl flex items-center justify-center border border-primary/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">{user.name}</h3>
                <span className="text-xs text-muted-foreground font-mono">@{user.username}</span>
              </div>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-mono">
                  {user.role}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                  {user.subscriptionPlan} PLAN
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    user.status === "active"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-rose-500/10 text-rose-600"
                  }`}
                >
                  {user.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Toolbar */}
        <div className="px-6 py-3 border-b border-border bg-card flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => onImpersonate(user)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all shadow-xs"
          >
            <UserCheck className="w-3.5 h-3.5" /> Impersonate
          </button>
          <button
            onClick={() => onEdit(user)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition-all"
          >
            Edit Profile
          </button>
          <button
            onClick={() => onResetPassword(user)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition-all"
          >
            <Lock className="w-3.5 h-3.5" /> Reset Pass
          </button>
          <button
            onClick={() => onForceLogout(user)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Force Logout
          </button>
          {user.status === "active" ? (
            <button
              onClick={() => onSuspend(user)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-all"
            >
              <Ban className="w-3.5 h-3.5" /> Suspend
            </button>
          ) : (
            <button
              onClick={() => onReactivate(user)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Reactivate
            </button>
          )}
          <button
            onClick={() => onExport(user)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Export Data
          </button>
        </div>

        {/* Tab Header Navigation */}
        <div className="px-6 border-b border-border bg-muted/10 flex items-center gap-4 text-xs font-semibold">
          {[
            { id: "overview", label: "Overview", icon: User },
            { id: "subscription", label: "Plan & Usage", icon: CreditCard },
            { id: "financials", label: "Invoices", icon: FileText },
            { id: "support", label: "Support", icon: HelpCircle },
            { id: "activity", label: "Activity Log", icon: Activity },
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

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-background space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Full Name
                  </span>
                  <p className="text-sm font-semibold text-foreground">{user.name}</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Username
                  </span>
                  <p className="text-sm font-semibold text-foreground">@{user.username}</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Email Address
                  </span>
                  <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                    {user.email}
                    {user.emailVerified ? (
                      <span title="Verified Email">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      </span>
                    ) : (
                      <span title="Unverified">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      </span>
                    )}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Phone Number
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    {user.phoneNumber || "Not provided"}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Country
                  </span>
                  <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-primary" /> {user.country}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Timezone
                  </span>
                  <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" /> {user.timezone}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Registration Date
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    {new Date(user.registrationDate).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Last Login
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    {new Date(user.lastLogin).toLocaleString()}
                  </p>
                </div>
              </div>

              {user.suspensionReason && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 space-y-1">
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
                    <Ban className="w-4 h-4" /> Account Suspension Notice
                  </div>
                  <p className="text-xs text-rose-700 dark:text-rose-400">{user.suspensionReason}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SUBSCRIPTION & USAGE */}
          {activeTab === "subscription" && (
            <div className="space-y-6 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                    Subscription Plan
                  </span>
                  <p className="text-xl font-black text-foreground">{user.subscriptionPlan}</p>
                  <span className="text-xs text-muted-foreground capitalize">
                    Status: {user.subscriptionStatus}
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Storage Usage
                  </span>
                  <p className="text-xl font-bold text-foreground flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-primary" />
                    {formatStorage(user.storageUsageBytes)}
                  </p>
                </div>
              </div>

              {/* Usage breakdown cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-border bg-card text-center space-y-1">
                  <span className="text-2xl font-black text-primary">{user.portfolioCount}</span>
                  <span className="text-xs font-semibold text-muted-foreground block">
                    Total Portfolios
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card text-center space-y-1">
                  <span className="text-2xl font-black text-emerald-600">
                    {user.publishedPortfolioCount}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground block">
                    Published Live
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card text-center space-y-1">
                  <span className="text-2xl font-black text-indigo-600">{user.resumeCount}</span>
                  <span className="text-xs font-semibold text-muted-foreground block">
                    AI Resumes
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" /> AI Usage Credits
                  </span>
                  <span>{user.aiUsageCredits} / 10,000 Credits</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-primary rounded-full"
                    style={{ width: `${Math.min(100, (user.aiUsageCredits / 10000) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FINANCIALS */}
          {activeTab === "financials" && (
            <div className="space-y-4 text-left">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Payment & Invoice History
              </h4>
              {user.paymentHistorySummary.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                  No payment history found for this account.
                </div>
              ) : (
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                      <tr>
                        <th className="py-2.5 px-3">Invoice</th>
                        <th className="py-2.5 px-3">Description</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {user.paymentHistorySummary.map((inv) => (
                        <tr key={inv.id} className="hover:bg-muted/20">
                          <td className="py-2.5 px-3 font-mono font-bold">{inv.id}</td>
                          <td className="py-2.5 px-3">{inv.description}</td>
                          <td className="py-2.5 px-3 font-bold">${inv.amount.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-muted-foreground">{inv.date}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-emerald-600 uppercase">
                            {inv.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SUPPORT */}
          {activeTab === "support" && (
            <div className="space-y-4 text-left">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Support Ticket History
              </h4>
              {user.supportHistory.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                  No open or past support tickets for this user.
                </div>
              ) : (
                <div className="space-y-2">
                  {user.supportHistory.map((tkt) => (
                    <div
                      key={tkt.id}
                      className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-foreground flex items-center gap-2">
                          <span className="font-mono text-primary">#{tkt.id}</span>
                          <span>{tkt.subject}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">Opened on {tkt.date}</span>
                      </div>
                      <span className="font-bold text-[10px] uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {tkt.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ACTIVITY */}
          {activeTab === "activity" && (
            <div className="space-y-4 text-left">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Recent Audit Activity Trail
              </h4>
              {user.recentActivity.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                  No activity events recorded.
                </div>
              ) : (
                <div className="space-y-2">
                  {user.recentActivity.map((act) => (
                    <div
                      key={act.id}
                      className="p-3.5 rounded-xl border border-border bg-card space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-primary text-[11px]">
                          {act.action}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(act.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-foreground font-medium">{act.description}</p>
                      {act.ipAddress && (
                        <span className="text-[10px] text-muted-foreground font-mono block">
                          IP: {act.ipAddress}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
