"use client";

import React, { useState, useEffect } from "react";
import { SupportTicket, CannedResponse, SupportTicketStatus } from "@/types/admin-support";
import {
  X,
  Send,
  Lock,
  MessageSquare,
  User,
  Zap,
  CheckCircle2,
  FileText,
  CreditCard,
  Sparkles,
  Folder,
  ChevronDown,
} from "lucide-react";

interface TicketConversationDrawerProps {
  ticket: SupportTicket | null;
  onClose: () => void;
  onRefresh: () => void;
}

export function TicketConversationDrawer({
  ticket,
  onClose,
  onRefresh,
}: TicketConversationDrawerProps) {
  const [replyText, setReplyText] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [cannedResponses, setCannedResponses] = useState<CannedResponse[]>([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchCanned = async () => {
      try {
        const res = await fetch("/api/admin/support/kb");
        // canned responses mock
        setCannedResponses([
          {
            id: "cn_1",
            title: "Custom Domain SSL Verification",
            shortcut: "/ssl-fix",
            category: "CUSTOM_DOMAIN",
            templateText: "Hello! We have re-triggered the SSL certificate validation. Please allow 15 minutes for DNS propagation.",
          },
          {
            id: "cn_2",
            title: "Tax Invoice PDF Generation",
            shortcut: "/tax-invoice",
            category: "BILLING",
            templateText: "Hello! Your updated VAT tax invoice has been regenerated and sent to your registered email.",
          },
        ]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCanned();
  }, []);

  if (!ticket) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/admin/support/tickets/${ticket.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageText: replyText,
          isInternalNote,
        }),
      });
      if (res.ok) {
        setReplyText("");
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleStatusChange = async (newStatus: SupportTicketStatus) => {
    try {
      const res = await fetch(`/api/admin/support/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const insertCanned = (template: string) => {
    const text = template.replace("{customerName}", ticket.customerName);
    setReplyText((prev) => (prev ? `${prev}\n${text}` : text));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-background/80 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-4xl bg-card border-l border-border h-full shadow-2xl flex flex-col text-left overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-border bg-muted/20 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-primary text-sm">{ticket.id}</span>
              <h3 className="text-base font-bold text-foreground">{ticket.subject}</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Customer: <span className="font-bold text-foreground">{ticket.customerName}</span> ({ticket.customerEmail}) —{" "}
              <span className="font-bold text-primary">{ticket.customerPlan} Plan</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value as any)}
              className="text-xs font-bold bg-background border border-border rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="OPEN">Status: OPEN</option>
              <option value="PENDING">Status: PENDING</option>
              <option value="WAITING_FOR_CUSTOMER">Status: WAITING FOR CUSTOMER</option>
              <option value="RESOLVED">Status: RESOLVED</option>
              <option value="CLOSED">Status: CLOSED</option>
              <option value="ESCALATED">Status: ESCALATED</option>
            </select>

            <button onClick={onClose} className="p-2 rounded-xl text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
          {/* Main Conversation Thread & Composer */}
          <div className="md:col-span-2 flex flex-col h-full border-r border-border overflow-hidden">
            {/* Thread List */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
              {ticket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-2xl border space-y-2 ${
                    msg.isInternalNote
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-300"
                      : msg.senderType === "agent"
                      ? "border-primary/30 bg-primary/5 text-foreground ml-4"
                      : "border-border bg-background text-foreground mr-4"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="flex items-center gap-1.5">
                      {msg.isInternalNote && <Lock className="w-3 h-3 text-amber-500" />}
                      {msg.senderName} ({msg.senderType.toUpperCase()})
                    </span>
                    <span className="text-[10px] text-muted-foreground">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.messageText}</p>
                </div>
              ))}
            </div>

            {/* Message Composer */}
            <form onSubmit={handleSend} className="p-4 border-t border-border bg-card space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsInternalNote(false)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      !isInternalNote ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    Public Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsInternalNote(true)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      isInternalNote ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Lock className="w-3 h-3" /> Private Note
                  </button>
                </div>

                {/* Canned Responses Dropdown */}
                <select
                  onChange={(e) => {
                    if (e.target.value) insertCanned(e.target.value);
                  }}
                  defaultValue=""
                  className="text-xs bg-background border border-border rounded-xl px-2.5 py-1 focus:outline-none max-w-xs"
                >
                  <option value="" disabled>
                    Insert Canned Template...
                  </option>
                  {cannedResponses.map((cn) => (
                    <option key={cn.id} value={cn.templateText}>
                      {cn.title} ({cn.shortcut})
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={isInternalNote ? "Add private internal note (visible only to support agents)..." : "Type your customer reply..."}
                rows={3}
                required
                className="w-full p-3 text-xs bg-background border border-border rounded-xl focus:outline-none leading-relaxed"
              />

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSending}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-xs ${
                    isInternalNote ? "bg-amber-600 text-white" : "bg-primary text-primary-foreground"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" /> {isInternalNote ? "Save Internal Note" : "Send Customer Reply"}
                </button>
              </div>
            </form>
          </div>

          {/* Customer 360 Sidebar */}
          <div className="p-6 space-y-6 overflow-y-auto bg-muted/10 text-xs">
            <div className="space-y-2">
              <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px]">Customer 360 Context</h4>
              <div className="p-3.5 rounded-xl border border-border bg-card space-y-2">
                <div className="font-bold text-foreground text-sm">{ticket.customerName}</div>
                <p className="text-muted-foreground">{ticket.customerEmail}</p>
                <span className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
                  {ticket.customerPlan} PLAN
                </span>
              </div>
            </div>

            {ticket.relatedPortfolios && ticket.relatedPortfolios.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Folder className="w-3.5 h-3.5 text-primary" /> Associated Portfolios
                </h4>
                {ticket.relatedPortfolios.map((id) => (
                  <div key={id} className="p-2.5 rounded-xl border border-border bg-card font-mono text-primary font-bold">
                    {id}
                  </div>
                ))}
              </div>
            )}

            {ticket.relatedBillingEvents && ticket.relatedBillingEvents.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-500" /> Related Invoice / Payment
                </h4>
                {ticket.relatedBillingEvents.map((id) => (
                  <div key={id} className="p-2.5 rounded-xl border border-border bg-card font-mono text-emerald-600 font-bold">
                    {id}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
