"use client";

import React, { useEffect, useState } from "react";
import { AIOperationsAnalyticsData, AnalyticsTimeframeType } from "@/types/admin-analytics";
import { Sparkles, Cpu, Bot, CheckCircle2, Zap, DollarSign } from "lucide-react";

interface AiOpsAnalyticsViewProps {
  timeframe: AnalyticsTimeframeType;
}

export function AiOpsAnalyticsView({ timeframe }: AiOpsAnalyticsViewProps) {
  const [data, setData] = useState<AIOperationsAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/analytics/ai?timeframe=${timeframe}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [timeframe]);

  if (isLoading || !data) {
    return <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">Loading AI Ops Analytics...</div>;
  }

  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Total AI Requests</span>
          <p className="text-2xl font-black text-primary">{data.totalRequests.toLocaleString()}</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Success Rate</span>
          <p className="text-2xl font-black text-emerald-600">{data.successRatePercentage}%</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Avg Generation Latency</span>
          <p className="text-2xl font-black text-foreground">{data.averageGenerationTimeMs} ms</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Estimated AI Cost</span>
          <p className="text-2xl font-black text-emerald-600">${data.estimatedCostUSD.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Provider Breakdown */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 text-xs">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" /> AI Model Provider Volume Share
          </h4>
          <div className="space-y-3">
            {data.providerBreakdown.map((p) => (
              <div key={p.providerId} className="space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span>{p.providerName}</span>
                  <span>{p.requestsCount.toLocaleString()} ({p.percentage}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${p.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Breakdown */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 text-xs">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Bot className="w-4 h-4 text-emerald-500" /> Autonomous Agent Request Distribution
          </h4>
          <div className="space-y-3">
            {data.agentBreakdown.map((a) => (
              <div key={a.agentId} className="space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span>{a.agentName}</span>
                  <span>{a.requestsCount.toLocaleString()} ({a.percentage}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${a.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
