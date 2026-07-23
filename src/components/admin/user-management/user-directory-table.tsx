"use client";

import React from "react";
import {
  EnterpriseUser,
  UserDirectoryQuery,
  UserDirectoryResult,
} from "@/types/admin-user";
import {
  CheckCircle2,
  Ban,
  AlertTriangle,
  MoreVertical,
  Eye,
  Edit,
  Shield,
  Key,
  LogOut,
  UserCheck,
  Trash2,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Briefcase,
} from "lucide-react";

interface UserDirectoryTableProps {
  directoryResult: UserDirectoryResult | null;
  query: UserDirectoryQuery;
  onChangeQuery: (newQuery: Partial<UserDirectoryQuery>) => void;
  selectedUserIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectUser: (userId: string) => void;
  onViewUser: (user: EnterpriseUser) => void;
  onEditUser: (user: EnterpriseUser) => void;
  onSuspendUser: (user: EnterpriseUser) => void;
  onReactivateUser: (user: EnterpriseUser) => void;
  onResetPassword: (user: EnterpriseUser) => void;
  onForceLogout: (user: EnterpriseUser) => void;
  onImpersonateUser: (user: EnterpriseUser) => void;
  onDeleteUser: (user: EnterpriseUser) => void;
  onExportSingleUser: (user: EnterpriseUser) => void;
  isLoading: boolean;
}

export function UserDirectoryTable({
  directoryResult,
  query,
  onChangeQuery,
  selectedUserIds,
  onToggleSelectAll,
  onToggleSelectUser,
  onViewUser,
  onEditUser,
  onSuspendUser,
  onReactivateUser,
  onResetPassword,
  onForceLogout,
  onImpersonateUser,
  onDeleteUser,
  onExportSingleUser,
  isLoading,
}: UserDirectoryTableProps) {
  const users = directoryResult?.users || [];
  const allSelectedOnPage =
    users.length > 0 && users.every((u) => selectedUserIds.includes(u.id));

  const handleSort = (field: UserDirectoryQuery["sortBy"]) => {
    if (query.sortBy === field) {
      onChangeQuery({ sortOrder: query.sortOrder === "asc" ? "desc" : "asc" });
    } else {
      onChangeQuery({ sortBy: field, sortOrder: "desc" });
    }
  };

  const renderSortIcon = (field: UserDirectoryQuery["sortBy"]) => {
    if (query.sortBy !== field) return <ArrowUpDown className="w-3 h-3 text-muted-foreground/60" />;
    return query.sortOrder === "asc" ? (
      <ArrowUp className="w-3 h-3 text-primary" />
    ) : (
      <ArrowDown className="w-3 h-3 text-primary" />
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20">
            <Ban className="w-3 h-3" /> Suspended
          </span>
        );
      case "disabled":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" /> Disabled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 border border-sky-500/20">
            Pending
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
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="border-b border-border bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allSelectedOnPage}
                  onChange={onToggleSelectAll}
                  className="rounded border-border text-primary focus:ring-primary/20"
                />
              </th>
              <th
                onClick={() => handleSort("name")}
                className="py-3.5 px-4 cursor-pointer hover:text-foreground transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>User Details</span>
                  {renderSortIcon("name")}
                </div>
              </th>
              <th
                onClick={() => handleSort("role")}
                className="py-3.5 px-4 cursor-pointer hover:text-foreground transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Role</span>
                  {renderSortIcon("role")}
                </div>
              </th>
              <th
                onClick={() => handleSort("subscriptionPlan")}
                className="py-3.5 px-4 cursor-pointer hover:text-foreground transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Subscription</span>
                  {renderSortIcon("subscriptionPlan")}
                </div>
              </th>
              <th className="py-3.5 px-4">Status</th>
              <th
                onClick={() => handleSort("portfolioCount")}
                className="py-3.5 px-4 cursor-pointer hover:text-foreground transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Portfolios</span>
                  {renderSortIcon("portfolioCount")}
                </div>
              </th>
              <th
                onClick={() => handleSort("registrationDate")}
                className="py-3.5 px-4 cursor-pointer hover:text-foreground transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Joined / Country</span>
                  {renderSortIcon("registrationDate")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              // Skeleton Loader Rows
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 px-4 text-center">
                    <div className="w-4 h-4 bg-muted rounded mx-auto" />
                  </td>
                  <td className="py-4 px-4 space-y-2">
                    <div className="w-32 h-3.5 bg-muted rounded" />
                    <div className="w-44 h-3 bg-muted/60 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-16 h-4 bg-muted rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-20 h-4 bg-muted rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-16 h-4 bg-muted rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-12 h-3.5 bg-muted rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-24 h-3.5 bg-muted rounded" />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="w-8 h-6 bg-muted rounded ml-auto" />
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={8} className="py-16 text-center text-muted-foreground space-y-3">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center">
                    <Ban className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">No users found matching current filters</p>
                  <p className="text-xs max-w-sm mx-auto">
                    Try adjusting search terms or clearing role/status filter criteria.
                  </p>
                </td>
              </tr>
            ) : (
              // Data Rows
              users.map((u) => {
                const isSelected = selectedUserIds.includes(u.id);
                return (
                  <tr
                    key={u.id}
                    className={`transition-colors ${
                      isSelected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/20"
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectUser(u.id)}
                        className="rounded border-border text-primary focus:ring-primary/20"
                      />
                    </td>

                    {/* User Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {u.photoURL ? (
                          <img
                            src={u.photoURL}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover border border-border"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div
                            onClick={() => onViewUser(u)}
                            className="font-bold text-foreground hover:text-primary cursor-pointer transition-colors flex items-center gap-1.5"
                          >
                            <span>{u.name}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">@{u.username}</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                            <span>{u.email}</span>
                            <span className="text-[10px] uppercase font-bold text-primary/80 bg-primary/10 px-1.5 rounded">
                              {u.loginProvider}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                        {u.role}
                      </span>
                    </td>

                    {/* Subscription */}
                    <td className="py-3.5 px-4">{getPlanBadge(u.subscriptionPlan)}</td>

                    {/* Status */}
                    <td className="py-3.5 px-4">{getStatusBadge(u.status)}</td>

                    {/* Portfolios */}
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      <span>{u.portfolioCount} total</span>
                      <span className="text-[11px] text-muted-foreground block font-normal">
                        {u.publishedPortfolioCount} published
                      </span>
                    </td>

                    {/* Joined / Country */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-foreground">
                        {new Date(u.registrationDate).toLocaleDateString()}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{u.country}</div>
                    </td>

                    {/* Row Actions Menu */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onViewUser(u)}
                          title="View 360° Profile"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditUser(u)}
                          title="Edit User Details"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {u.status === "active" ? (
                          <button
                            onClick={() => onSuspendUser(u)}
                            title="Suspend User"
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-500/20 transition-all"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onReactivateUser(u)}
                            title="Reactivate User"
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-500/20 transition-all"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteUser(u)}
                          title="Delete User Account"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {directoryResult && (
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
            <span>entries per page</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-muted-foreground font-medium mr-2">
              Page {directoryResult.page} of {directoryResult.totalPages}
            </span>

            <button
              disabled={directoryResult.page <= 1}
              onClick={() => onChangeQuery({ page: directoryResult.page - 1 })}
              className="p-1.5 rounded-lg border border-border bg-background text-foreground hover:bg-muted disabled:opacity-40 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              disabled={directoryResult.page >= directoryResult.totalPages}
              onClick={() => onChangeQuery({ page: directoryResult.page + 1 })}
              className="p-1.5 rounded-lg border border-border bg-background text-foreground hover:bg-muted disabled:opacity-40 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
