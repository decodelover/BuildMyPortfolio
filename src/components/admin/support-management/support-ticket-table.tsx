"use client";

import React from "react";
import { SupportTicket, TicketDirectoryQuery, TicketDirectoryResult } from "@/types/admin-support";
import {
  MessageSquare,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  User,
  Zap,
  Tag,
  Eye,
  UserCheck,
} from "lucide-react";

interface SupportTicketTableProps {
  result: TicketDirectoryResult | null;
  query: TicketDirectoryQuery;
  onChangeQuery: (newQuery: Partial<TicketDirectoryQuery>) => void;
  onOpenConversation: (tkt: SupportTicket) => void;
  isLoading: boolean;
}

export function SupportTicketTable({
  result,
  query,
  onChangeQuery,
  onOpenConversation,
  isLoading,
}: SupportTicketTableProps) {
  const tickets = result?.tickets || [];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
      case "URGENT":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20 uppercase">
            <AlertTriangle className="w-3 h-3" /> {priority}
          </span>
        );
      case "HIGH":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20 uppercase">
            {priority}
          </span>
        );
      case "LOW":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border uppercase">
            {priority}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 border border-sky-500/20 uppercase">
            NORMAL
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase">
            OPEN
          </span>
        );
      case "RESOLVED":
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 border border-sky-500/20 uppercase">
            RESOLVED
          </span>
        );
      case "ESCALATED":
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20 uppercase">
            ESCALATED
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 uppercase">
            {status}
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
              <th className="py-3.5 px-4">Ticket ID / Subject</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Assigned Agent</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 px-4"><div className="w-44 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4"><div className="w-28 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4"><div className="w-20 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4"><div className="w-16 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4"><div className="w-16 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4"><div className="w-28 h-4 bg-muted rounded" /></td>
                  <td className="py-4 px-4 text-right"><div className="w-16 h-6 bg-muted rounded ml-auto" /></td>
                </tr>
              ))
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-muted-foreground">
                  No support tickets match the specified filter parameters.
                </td>
              </tr>
            ) : (
              tickets.map((tkt) => (
                <tr key={tkt.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-primary">{tkt.id}</span>
                      {(tkt.responseSlaBreached || tkt.resolutionSlaBreached) && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20 uppercase flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> SLA BREACH
                        </span>
                      )}
                    </div>
                    <div
                      onClick={() => onOpenConversation(tkt)}
                      className="font-bold text-foreground hover:text-primary cursor-pointer transition-colors truncate"
                    >
                      {tkt.subject}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-foreground">{tkt.customerName}</div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <span>{tkt.customerEmail}</span>
                      <span className="text-[9px] font-extrabold uppercase px-1 rounded bg-primary/10 text-primary">
                        {tkt.customerPlan}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-semibold text-foreground">
                    {tkt.category}
                  </td>

                  <td className="py-3.5 px-4">{getPriorityBadge(tkt.priority)}</td>

                  <td className="py-3.5 px-4">{getStatusBadge(tkt.status)}</td>

                  <td className="py-3.5 px-4 font-medium text-foreground">
                    {tkt.assignedAgentName || <span className="text-muted-foreground italic">Unassigned</span>}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onOpenConversation(tkt)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-xl shadow-xs hover:opacity-90 ml-auto"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Reply Thread
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {result && (
        <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between gap-4 text-xs">
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
    </div>
  );
}
