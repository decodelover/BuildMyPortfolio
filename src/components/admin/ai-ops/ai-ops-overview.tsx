"use client";

import React, { useEffect, useState } from "react";
import { AIOpsOverviewMetrics } from "@/types/admin-ai-ops";
import {
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  Cpu,
  RefreshCw,
  Users,
  ShieldCheck,
} from "lucide-react";

export function AIOpsOverview() {
  const [metrics, setMetrics] = useState<AIOpsOverviewMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/ai-ops/metrics");
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (isLoading || !metrics) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">
        Initializing AI Operations Control Center metrics...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total AI Requests */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Total AI Operations
          </span>
          <p className="text-2xl font-black text-primary">{metrics.totalRequests.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> {metrics.successRatePercentage}% Success Rate
          </span>
        </div>

        {/* Average Latency */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Avg Response Time
          </span>
          <p className="text-2xl font-black text-foreground">{metrics.averageResponseTimeMs} ms</p>
          <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Optimal Latency
          </span>
        </div>

        {/* Token Consumption */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Token Consumption
          </span>
          <p className="text-2xl font-black text-indigo-600">
            {(metrics.tokenConsumption.totalTokens / 1000000).toFixed(1)}M
          </p>
          <span className="text-[11px] text-muted-foreground font-semibold">
            Prompt + Completion tokens
          </span>
        </div>

        {/* Estimated AI Cost */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Estimated AI Cost
          </span>
          <p className="text-2xl font-black text-emerald-600">${metrics.estimatedCostUSD.toFixed(2)}</p>
          <span className="text-[11px] text-muted-foreground font-semibold">MTD Usage Estimate</span>
        </div>
      </div>

      {/* Queue & Active Users Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-muted-foreground uppercase">Current Queue Health</h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 uppercase">
              {metrics.queueHealth}
            </span>
          </div>
          <p className="text-3xl font-black text-foreground">{metrics.currentQueueSize} Jobs</p>
          <p className="text-xs text-muted-foreground">Active jobs running across worker threads.</p>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-muted-foreground uppercase">Active AI Users</h4>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <p className="text-3xl font-black text-primary">{metrics.activeAIUsers}</p>
          <p className="text-xs text-muted-foreground">Users executing portfolio generations right now.</p>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-muted-foreground uppercase">Peak Execution Rate</h4>
            <Activity className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-3xl font-black text-sky-600">{metrics.peakRequestsPerMin} RPM</p>
          <p className="text-xs text-muted-foreground">Peak request rate in current 24-hour window.</p>
        </div>
      </div>

      {/* Model Provider Status Bar */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Cpu className="w-4 h-4 text-primary" /> Live AI Provider &amp; Model Gateway Health
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          {Object.entries(metrics.providerStatus).map(([provider, status]) => (
            <div key={provider} className="p-4 rounded-xl border border-border bg-background flex items-center justify-between">
              <div>
                <span className="font-bold text-foreground uppercase block">{provider}</span>
                <span className="text-[10px] text-muted-foreground">Gateway status</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> {status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
