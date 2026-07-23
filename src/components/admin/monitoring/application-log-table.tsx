"use client";

import React, { useState } from "react";
import { SystemLogEntry, LogQueryFilter, LogQueryResult } from "@/types/admin-monitoring";
import {
  Terminal,
  AlertTriangle,
  Info,
  Zap,
  Code,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";

interface ApplicationLogTableProps {
  result: LogQueryResult | null;
  query: LogQueryFilter;
  onChangeQuery: (newQuery: Partial<LogQueryFilter>) => void;
  isLoading: boolean;
}

export function ApplicationLogTable({
  result,
  query,
  onChangeQuery,
  isLoading,
}: ApplicationLogTableProps) {
  const [selectedLog, setSelectedLog] = useState<SystemLogEntry | null>(null);
  const logs = result?.logs || [];

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "CRITICAL":
        return (
          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 border border-rose-500/30 uppercase animate-pulse">
            CRITICAL
          </span>
        );
      case "ERROR":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20 uppercase">
            ERROR
          </span>
        );
      case "WARN":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20 uppercase">
            WARN
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 border border-sky-500/20 uppercase">
            INFO
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col text-left">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead className="border-b border-border bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider font-sans">
            <tr>
              <th className="py-3.5 px-4">Time / Severity</th>
              <th className="py-3.5 px-4">Source &amp; Module</th>
              <th className="py-3.5 px-4">Service</th>
              <th className="py-3.5 px-4">Request ID</th>
              <th className="py-3.5 px-4">Log Message</th>
              <th className="py-3.5 px-4">Runtime</th>
              <th className="py-3.5 px-4 text-right font-sans">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 px-4"><div className="w-28 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4"><div className="w-24 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4"><div className="w-20 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4"><div className="w-20 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4"><div className="w-48 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4"><div className="w-12 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4 text-right"><div className="w-12 h-6 bg-muted rounded ml-auto" /></td>
                </tr>
              ))
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-muted-foreground font-sans">
                  No log entries match the specified search or filter criteria.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="text-[10px] text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</div>
                    <div>{getSeverityBadge(log.severity)}</div>
                  </td>
                  <td className="py-3 px-4 font-bold text-foreground">
                    <div>{log.module}</div>
                    <div className="text-[10px] text-muted-foreground">{log.source}</div>
                  </td>
                  <td className="py-3 px-4 text-foreground font-bold">{log.service}</td>
                  <td className="py-3 px-4 text-primary font-bold">{log.requestId}</td>
                  <td className="py-3 px-4 text-foreground max-w-md truncate font-sans text-xs">{log.message}</td>
                  <td className="py-3 px-4 font-bold text-foreground">{log.executionTimeMs} ms</td>
                  <td className="py-3 px-4 text-right font-sans">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {result && (
        <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between gap-4 text-xs font-sans">
          <span className="text-muted-foreground font-medium">
            Page {result.page} of {result.totalPages}
          </span>
          <div className="flex items-center gap-1.5">
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

      {/* Log Detail Drawer */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex justify-end font-sans">
          <div className="w-full max-w-xl bg-card border-l border-border h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-base font-bold text-foreground">Log Details — {selectedLog.id}</h3>
                <button onClick={() => setSelectedLog(null)}><X className="w-5 h-5 text-muted-foreground" /></button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-background border">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Severity</span>
                  <span>{getSeverityBadge(selectedLog.severity)}</span>
                </div>
                <div className="p-3 rounded-xl bg-background border">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Service</span>
                  <span className="font-bold">{selectedLog.service}</span>
                </div>
                <div className="p-3 rounded-xl bg-background border">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Request ID</span>
                  <span className="font-mono font-bold text-primary">{selectedLog.requestId}</span>
                </div>
                <div className="p-3 rounded-xl bg-background border">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Execution Time</span>
                  <span className="font-mono font-bold">{selectedLog.executionTimeMs} ms</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-muted-foreground uppercase text-[10px]">Log Message</span>
                <div className="p-3 rounded-xl bg-muted/30 border font-mono text-[11px] text-foreground leading-relaxed">
                  {selectedLog.message}
                </div>
              </div>

              {selectedLog.stackTrace && (
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-rose-600 uppercase text-[10px]">Stack Trace</span>
                  <pre className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 font-mono text-[10px] whitespace-pre-wrap overflow-x-auto">
                    {selectedLog.stackTrace}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
