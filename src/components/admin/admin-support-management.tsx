"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MessageSquare, BookOpen, BarChart3, HelpCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { SupportTicket, TicketDirectoryQuery, TicketDirectoryResult } from "@/types/admin-support";
import { SupportToolbar } from "./support-management/support-toolbar";
import { SupportTicketTable } from "./support-management/support-ticket-table";
import { TicketConversationDrawer } from "./support-management/ticket-conversation-drawer";
import { KnowledgeBaseManager } from "./support-management/knowledge-base-manager";
import { SupportAnalyticsView } from "./support-management/support-analytics-view";

export function AdminSupportManagement() {
  const [activeTab, setActiveTab] = useState<"inbox" | "kb" | "analytics">("inbox");

  const [query, setQuery] = useState<TicketDirectoryQuery>({
    search: "",
    status: "ALL",
    priority: "ALL",
    category: "ALL",
    plan: "ALL",
    page: 1,
    limit: 10,
  });

  const [result, setResult] = useState<TicketDirectoryResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.search) params.set("search", query.search);
      if (query.status && query.status !== "ALL") params.set("status", query.status);
      if (query.priority && query.priority !== "ALL") params.set("priority", query.priority);
      if (query.category && query.category !== "ALL") params.set("category", query.category);
      if (query.plan && query.plan !== "ALL") params.set("plan", query.plan);
      params.set("page", query.page.toString());
      params.set("limit", query.limit.toString());

      const res = await fetch(`/api/admin/support/tickets?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error(err);
    } fontally: {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (activeTab === "inbox") {
      fetchTickets();
    }
  }, [activeTab, fetchTickets]);

  return (
    <div className="space-y-6 text-left relative pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Enterprise Support &amp; Ticket Management Console
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage customer inquiries, split-thread conversation history, private internal notes, SLA timers, knowledge base articles, and support analytics.
          </p>
        </div>

        {result && (
          <div className="flex items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 font-bold">
              Open Tickets: {result.metrics.openCount}
            </div>
            <div className="px-3 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 font-bold">
              Urgent: {result.metrics.urgentCount}
            </div>
          </div>
        )}
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto text-xs font-bold">
        {[
          { id: "inbox", label: "Support Inbox", icon: MessageSquare },
          { id: "kb", label: "Knowledge Base", icon: BookOpen },
          { id: "analytics", label: "Support Analytics", icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB PANELS */}
      {activeTab === "inbox" && (
        <div className="space-y-6">
          <SupportToolbar
            query={query}
            onChangeQuery={(newQ) => setQuery({ ...query, ...newQ })}
            onResetFilters={() =>
              setQuery({
                search: "",
                status: "ALL",
                priority: "ALL",
                category: "ALL",
                plan: "ALL",
                page: 1,
                limit: 10,
              })
            }
            onRefresh={fetchTickets}
            totalResults={result?.total || 0}
            isLoading={isLoading}
          />

          <SupportTicketTable
            result={result}
            query={query}
            onChangeQuery={(newQ) => setQuery({ ...query, ...newQ })}
            onOpenConversation={setSelectedTicket}
            isLoading={isLoading}
          />
        </div>
      )}

      {activeTab === "kb" && <KnowledgeBaseManager />}
      {activeTab === "analytics" && <SupportAnalyticsView />}

      {/* Conversation Drawer */}
      <TicketConversationDrawer
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onRefresh={() => {
          fetchTickets();
          if (selectedTicket) {
            // refresh single ticket
            fetch(`/api/admin/support/tickets/${selectedTicket.id}`)
              .then((r) => r.json())
              .then((data) => setSelectedTicket(data));
          }
        }}
      />
    </div>
  );
}
