"use client";

import React, { useEffect, useState } from "react";
import { SupportAnalyticsMetrics } from "@/types/admin-support";
import { Award, Clock, CheckCircle2, MessageSquare, TrendingUp, Users } from "lucide-react";

export function SupportAnalyticsView() {
  const [metrics, setMetrics] = useState<SupportAnalyticsMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/support/metrics");
        if (res.ok) {
          const json = await res.json();
          setMetrics(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (isLoading || !metrics) {
    return <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">Loading Support Analytics...</div>;
  }

  return (
    <div className="space-y-6 text-left">
      {/* Top Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Customer Satisfaction (CSAT)</span>
          <p className="text-2xl font-black text-emerald-600">{metrics.csatPercentage}%</p>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> World Class Rating
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Avg First Response Time</span>
          <p className="text-2xl font-black text-primary">{metrics.avgResponseTimeMinutes} mins</p>
          <span className="text-[11px] text-muted-foreground font-semibold">Under 15m SLA Target</span>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Avg Resolution Time</span>
          <p className="text-2xl font-black text-foreground">{metrics.avgResolutionTimeHours} hours</p>
          <span className="text-[11px] text-muted-foreground font-semibold">MTTR Metric</span>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Total Tickets Handled</span>
          <p className="text-2xl font-black text-indigo-600">{metrics.totalTickets}</p>
        </div>
      </div>

      {/* Agent Leaderboard */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 text-xs">
        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" /> Support Team Performance Leaderboard
        </h4>
        <div className="space-y-3">
          {metrics.agentPerformance.map((agent) => (
            <div key={agent.agentId} className="p-4 rounded-xl border border-border bg-background flex items-center justify-between">
              <div>
                <span className="font-bold text-foreground block">{agent.agentName}</span>
                <span className="text-[10px] text-muted-foreground font-mono">Agent ID: {agent.agentId}</span>
              </div>
              <div className="flex items-center gap-6 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block font-sans">Resolved</span>
                  <span className="font-bold text-primary">{agent.ticketsResolved} tickets</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-sans">Avg Response</span>
                  <span className="font-bold text-foreground">{agent.avgResponseMins} mins</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-sans">CSAT Score</span>
                  <span className="font-bold text-emerald-600">{agent.csatScore}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
