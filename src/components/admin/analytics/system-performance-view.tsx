"use client";

import React, { useEffect, useState } from "react";
import { SystemPerformanceAnalyticsData } from "@/types/admin-analytics";
import { Activity, Database, HardDrive, Cpu, CheckCircle2, Zap } from "lucide-react";

export function SystemPerformanceView() {
  const [data, setData] = useState<SystemPerformanceAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/analytics/system");
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
  }, []);

  if (isLoading || !data) {
    return <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">Loading System Observability...</div>;
  }

  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">API Latency (p50)</span>
          <p className="text-2xl font-black text-emerald-600">{data.apiLatencyP50Ms} ms</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">API Latency (p95)</span>
          <p className="text-2xl font-black text-sky-600">{data.apiLatencyP95Ms} ms</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">DB Query Avg</span>
          <p className="text-2xl font-black text-indigo-600">{data.databaseQueryAvgMs} ms</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Build Success Rate</span>
          <p className="text-2xl font-black text-emerald-600">{data.buildSuccessRatePercentage}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-2 text-xs">
          <span className="text-[10px] font-bold text-muted-foreground uppercase block">Storage Usage</span>
          <p className="text-3xl font-black text-foreground">{data.storageUsageGB} GB</p>
          <p className="text-muted-foreground">Assets and portfolio artifacts stored.</p>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-2 text-xs">
          <span className="text-[10px] font-bold text-muted-foreground uppercase block">Bandwidth MTD</span>
          <p className="text-3xl font-black text-primary">{data.bandwidthUsageGB.toLocaleString()} GB</p>
          <p className="text-muted-foreground">Global CDN delivery bandwidth.</p>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-2 text-xs">
          <span className="text-[10px] font-bold text-muted-foreground uppercase block">Active Worker Queue</span>
          <p className="text-3xl font-black text-emerald-600">{data.activeQueueJobs} Jobs</p>
          <p className="text-muted-foreground">Background jobs processing cleanly.</p>
        </div>
      </div>
    </div>
  );
}
