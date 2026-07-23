"use client";

import React, { useEffect, useState } from "react";
import { Shield, Clock, RefreshCw, User, Terminal, ArrowRight } from "lucide-react";
import { AdminAuditLogEntry } from "@/types/admin-user";

export function AdminAuditLogsView() {
  const [logs, setLogs] = useState<AdminAuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/audit-logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to fetch audit logs", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatVal = (val: any) => {
    if (!val) return "—";
    if (typeof val === "object") return JSON.stringify(val);
    return String(val);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Security &amp; Administrative Audit Event Logs
          </h2>
          <p className="text-xs text-muted-foreground">
            Immutable system audit logs tracking every user modification, suspension, role assignment, and administrative session.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-secondary hover:bg-secondary/80 border border-border rounded-xl transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} /> Refresh Logs
        </button>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Admin Performed By</th>
                  <th className="py-3 px-4">Target User</th>
                  <th className="py-3 px-4">Change Diff (Prev → New)</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">IP / Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 px-4"><div className="w-24 h-4 bg-muted rounded" /></td>
                      <td className="py-4 px-4"><div className="w-32 h-3.5 bg-muted rounded" /></td>
                      <td className="py-4 px-4"><div className="w-28 h-3.5 bg-muted rounded" /></td>
                      <td className="py-4 px-4"><div className="w-40 h-3.5 bg-muted rounded" /></td>
                      <td className="py-4 px-4"><div className="w-48 h-3.5 bg-muted rounded" /></td>
                      <td className="py-4 px-4"><div className="w-20 h-3.5 bg-muted rounded" /></td>
                    </tr>
                  ))
                ) : logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[11px] text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-foreground">{log.adminEmail}</div>
                        <div className="text-[10px] font-mono text-muted-foreground">{log.adminRole}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {log.targetUserEmail ? (
                          <div>
                            <div className="font-bold text-foreground">{log.targetUserEmail}</div>
                            <div className="text-[10px] font-mono text-muted-foreground">{log.targetUserId}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">N/A</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {log.previousValue !== undefined || log.newValue !== undefined ? (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <span className="bg-muted px-1.5 py-0.5 rounded text-rose-500 max-w-[120px] truncate">
                              {formatVal(log.previousValue)}
                            </span>
                            <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="bg-muted px-1.5 py-0.5 rounded text-emerald-600 font-bold max-w-[120px] truncate">
                              {formatVal(log.newValue)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground font-medium max-w-xs truncate">
                        {log.details}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        <div className="font-medium text-foreground">{new Date(log.timestamp).toLocaleString()}</div>
                        <div className="text-[10px] font-mono">{log.ipAddress}</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No administrative audit log entries recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
