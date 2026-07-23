"use client";

import React, { useState } from "react";
import { HelpCircle, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export function AdminSupportManagement() {
  const [tickets, setTickets] = useState([
    { id: "tkt_1", user: "alex@example.com", subject: "Custom Domain DNS Setup Help", priority: "HIGH", status: "Open", date: "2026-07-22" },
    { id: "tkt_2", user: "sarah.c@example.com", subject: "Paystack Invoice Receipt Request", priority: "MEDIUM", status: "In Progress", date: "2026-07-21" },
    { id: "tkt_3", user: "dkim@example.com", subject: "AI Blueprint Generation Question", priority: "LOW", status: "Resolved", date: "2026-07-20" },
  ]);

  const toggleStatus = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === "Resolved" ? "Open" : "Resolved" } : t))
    );
  };

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          Support Ticket &amp; Operations Center
        </h2>
        <p className="text-xs text-muted-foreground">Manage incoming user support inquiries, technical assistance, and resolution queues.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b bg-muted/40 text-muted-foreground font-semibold">
            <tr>
              <th className="py-3 px-4">Ticket ID</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-primary">{t.id}</td>
                <td className="py-3.5 px-4 font-medium">{t.user}</td>
                <td className="py-3.5 px-4 text-foreground font-semibold">{t.subject}</td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                    t.priority === "HIGH" ? "bg-rose-500/10 text-rose-600" : "bg-amber-500/10 text-amber-600"
                  }`}>
                    {t.priority}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-bold">{t.status}</td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => toggleStatus(t.id)}
                    className="px-2.5 py-1 rounded-lg bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-all font-bold text-[11px]"
                  >
                    Mark {t.status === "Resolved" ? "Open" : "Resolved"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
