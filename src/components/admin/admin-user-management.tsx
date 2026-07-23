"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Users, Shield, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, X } from "lucide-react";
import {
  EnterpriseUser,
  UserDirectoryQuery,
  UserDirectoryResult,
  EnterpriseRole,
  SubscriptionPlanType,
} from "@/types/admin-user";
import { UserDirectoryToolbar } from "./user-management/user-directory-toolbar";
import { UserDirectoryTable } from "./user-management/user-directory-table";
import { UserProfileDrawer } from "./user-management/user-profile-drawer";
import { BulkActionsBar } from "./user-management/bulk-actions-bar";
import {
  EditUserModal,
  SuspendUserModal,
  DeleteUserModal,
  ImpersonationBanner,
} from "./user-management/user-action-modals";

export function AdminUserManagement() {
  // Query State
  const [query, setQuery] = useState<UserDirectoryQuery>({
    search: "",
    role: "ALL",
    plan: "ALL",
    status: "ALL",
    country: "ALL",
    authProvider: "ALL",
    activity: "ALL",
    regDateRange: "all",
    lastLoginRange: "all",
    sortBy: "registrationDate",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  });

  // Directory Result State
  const [directoryResult, setDirectoryResult] = useState<UserDirectoryResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Selection State
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Drawer & Modal States
  const [viewingUser, setViewingUser] = useState<EnterpriseUser | null>(null);
  const [editingUser, setEditingUser] = useState<EnterpriseUser | null>(null);
  const [suspendingUser, setSuspendingUser] = useState<EnterpriseUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<EnterpriseUser | null>(null);

  // Impersonation Active Session State
  const [impersonatedUser, setImpersonatedUser] = useState<EnterpriseUser | null>(null);

  // Fetch Directory Data
  const fetchDirectory = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.search) params.set("search", query.search);
      if (query.role && query.role !== "ALL") params.set("role", query.role);
      if (query.plan && query.plan !== "ALL") params.set("plan", query.plan);
      if (query.status && query.status !== "ALL") params.set("status", query.status);
      if (query.country && query.country !== "ALL") params.set("country", query.country);
      if (query.authProvider && query.authProvider !== "ALL") params.set("authProvider", query.authProvider);
      if (query.activity && query.activity !== "ALL") params.set("activity", query.activity);
      if (query.regDateRange && query.regDateRange !== "all") params.set("regDateRange", query.regDateRange);
      if (query.lastLoginRange && query.lastLoginRange !== "all") params.set("lastLoginRange", query.lastLoginRange);
      if (query.sortBy) params.set("sortBy", query.sortBy);
      if (query.sortOrder) params.set("sortOrder", query.sortOrder);
      params.set("page", query.page.toString());
      params.set("limit", query.limit.toString());

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load user directory.");
      const data = await res.json();
      setDirectoryResult(data);
    } catch (err: any) {
      showToast(err.message || "Failed to fetch user directory.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchDirectory();
  }, [fetchDirectory]);

  // Toast Handler
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Selection Handlers
  const handleToggleSelectAll = () => {
    if (!directoryResult) return;
    const pageUserIds = directoryResult.users.map((u) => u.id);
    const allSelected = pageUserIds.every((id) => selectedUserIds.includes(id));
    if (allSelected) {
      setSelectedUserIds(selectedUserIds.filter((id) => !pageUserIds.includes(id)));
    } else {
      const merged = Array.from(new Set([...selectedUserIds, ...pageUserIds]));
      setSelectedUserIds(merged);
    }
  };

  const handleToggleSelectUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  // User Actions API Callers
  const handleSaveUserEdit = async (updatedData: Partial<EnterpriseUser>) => {
    if (!editingUser) return;
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user.");
      showToast(`User ${editingUser.name} profile updated successfully.`);
      fetchDirectory();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleConfirmSuspend = async (reason: string, durationDays?: number) => {
    if (!suspendingUser) return;
    try {
      const res = await fetch(`/api/admin/users/${suspendingUser.id}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "suspend", reason, durationDays }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to suspend user.");
      showToast(`User ${suspendingUser.name} suspended successfully.`);
      fetchDirectory();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleReactivateUser = async (user: EnterpriseUser) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reactivate" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reactivate user.");
      showToast(`User ${user.name} account reactivated.`);
      fetchDirectory();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    try {
      const res = await fetch(
        `/api/admin/users/${deletingUser.id}?confirmationName=${encodeURIComponent(deletingUser.email)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user.");
      showToast(`User ${deletingUser.name} account permanently deleted.`);
      fetchDirectory();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleResetPassword = async (user: EnterpriseUser) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_password" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to trigger password reset.");
      showToast(`Password reset link dispatched to ${user.email}.`);
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleForceLogout = async (user: EnterpriseUser) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "force_logout" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to force logout.");
      showToast(`Force logout executed for ${user.name}. Active tokens revoked.`);
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleImpersonateUser = async (user: EnterpriseUser) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "impersonate" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to impersonate user.");
      setImpersonatedUser(user);
      showToast(`Impersonating ${user.name}. Session token issued.`);
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleExportSingleUser = async (user: EnterpriseUser) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "export" }),
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `user_${user.id}_export.json`;
      a.click();
      showToast(`User data export generated for ${user.name}.`);
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // Bulk Actions
  const handleBulkSuspend = async () => {
    try {
      const res = await fetch("/api/admin/users/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "suspend",
          userIds: selectedUserIds,
          payload: { reason: "Bulk Administrative Action" },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bulk suspend failed.");
      showToast(`Bulk suspended ${data.count} users successfully.`);
      setSelectedUserIds([]);
      fetchDirectory();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete ${selectedUserIds.length} selected users?`)) return;
    try {
      const res = await fetch("/api/admin/users/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", userIds: selectedUserIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bulk delete failed.");
      showToast(`Bulk deleted ${data.count} users.`);
      setSelectedUserIds([]);
      fetchDirectory();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleBulkAssignRole = async (newRole: EnterpriseRole) => {
    try {
      const res = await fetch("/api/admin/users/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "assign_role",
          userIds: selectedUserIds,
          payload: { newRole },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bulk role assignment failed.");
      showToast(`Assigned ${newRole} role to ${data.count} users.`);
      setSelectedUserIds([]);
      fetchDirectory();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleBulkAssignPlan = async (newPlan: SubscriptionPlanType) => {
    try {
      const res = await fetch("/api/admin/users/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "assign_plan",
          userIds: selectedUserIds,
          payload: { newPlan },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bulk plan assignment failed.");
      showToast(`Assigned ${newPlan} plan to ${data.count} users.`);
      setSelectedUserIds([]);
      fetchDirectory();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleBulkExport = async (format: "csv" | "json") => {
    try {
      const res = await fetch("/api/admin/users/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "export",
          userIds: selectedUserIds,
          payload: { exportFormat: format },
        }),
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users_bulk_export.${format}`;
      a.click();
      showToast(`Exported ${selectedUserIds.length} users to ${format.toUpperCase()}.`);
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const stats = directoryResult?.stats;

  return (
    <div className="space-y-6 text-left relative pb-16">
      {/* Impersonation Banner */}
      <ImpersonationBanner
        user={impersonatedUser}
        onExit={() => {
          setImpersonatedUser(null);
          showToast("Exited impersonation mode.");
        }}
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Enterprise User Management System
          </h2>
          <p className="text-xs text-muted-foreground">
            Search, filter, manage, impersonate, and audit all platform accounts without touching Firebase directly.
          </p>
        </div>

        {stats && (
          <div className="flex items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-xl border border-border bg-card font-semibold">
              Total: <span className="text-foreground font-bold">{stats.totalUsers}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 font-semibold">
              Active: <span className="font-bold">{stats.activeUsers}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 font-semibold">
              Suspended: <span className="font-bold">{stats.suspendedUsers}</span>
            </div>
          </div>
        )}
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`rounded-xl border p-3 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200 ${
            notification.type === "error"
              ? "border-rose-500/30 bg-rose-500/10 text-rose-600"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "error" ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Directory Toolbar */}
      <UserDirectoryToolbar
        query={query}
        onChangeQuery={(newQ) => setQuery({ ...query, ...newQ })}
        onResetFilters={() =>
          setQuery({
            search: "",
            role: "ALL",
            plan: "ALL",
            status: "ALL",
            country: "ALL",
            authProvider: "ALL",
            activity: "ALL",
            regDateRange: "all",
            lastLoginRange: "all",
            sortBy: "registrationDate",
            sortOrder: "desc",
            page: 1,
            limit: 10,
          })
        }
        onRefresh={fetchDirectory}
        totalResults={directoryResult?.total || 0}
        isLoading={isLoading}
      />

      {/* Directory Table */}
      <UserDirectoryTable
        directoryResult={directoryResult}
        query={query}
        onChangeQuery={(newQ) => setQuery({ ...query, ...newQ })}
        selectedUserIds={selectedUserIds}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelectUser={handleToggleSelectUser}
        onViewUser={setViewingUser}
        onEditUser={setEditingUser}
        onSuspendUser={setSuspendingUser}
        onReactivateUser={handleReactivateUser}
        onResetPassword={handleResetPassword}
        onForceLogout={handleForceLogout}
        onImpersonateUser={handleImpersonateUser}
        onDeleteUser={setDeletingUser}
        onExportSingleUser={handleExportSingleUser}
        isLoading={isLoading}
      />

      {/* Floating Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedUserIds.length}
        onClearSelection={() => setSelectedUserIds([])}
        onBulkSuspend={handleBulkSuspend}
        onBulkDelete={handleBulkDelete}
        onBulkAssignRole={handleBulkAssignRole}
        onBulkAssignPlan={handleBulkAssignPlan}
        onBulkExport={handleBulkExport}
      />

      {/* 360 User Profile Drawer */}
      <UserProfileDrawer
        user={viewingUser}
        onClose={() => setViewingUser(null)}
        onEdit={(u) => {
          setViewingUser(null);
          setEditingUser(u);
        }}
        onSuspend={(u) => {
          setViewingUser(null);
          setSuspendingUser(u);
        }}
        onReactivate={(u) => {
          setViewingUser(null);
          handleReactivateUser(u);
        }}
        onResetPassword={handleResetPassword}
        onForceLogout={handleForceLogout}
        onImpersonate={handleImpersonateUser}
        onExport={handleExportSingleUser}
      />

      {/* Action Modals */}
      <EditUserModal
        user={editingUser}
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveUserEdit}
      />

      <SuspendUserModal
        user={suspendingUser}
        isOpen={Boolean(suspendingUser)}
        onClose={() => setSuspendingUser(null)}
        onConfirm={handleConfirmSuspend}
      />

      <DeleteUserModal
        user={deletingUser}
        isOpen={Boolean(deletingUser)}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
