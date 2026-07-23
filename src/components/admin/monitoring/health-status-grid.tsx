"use client";

import React, { useEffect, useState } from "react";
import { SystemHealthStatus } from "@/types/admin-monitoring";
import { Activity, CheckCircle2, AlertTriangle, RefreshCw, Cpu, Server, Zap } from "lucide-react";

export function HealthStatusGrid() {
  const [healthList, setHealthList] = useState<SystemHealthStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHealth = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/monitoring/health");
      if (res.ok) {
        const data = await res.json();
        setHealthList(data.health || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" /> Live Service Infrastructure Uptime Grid
          </h3>
          <p className="text-xs text-muted-foreground">Monitor real-time health across 14 core, AI, infrastructure, and payment services.</p>
        </div>

        <button onClick={fetchHealth} className="p-2 rounded-xl bg-secondary border border-border">
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {healthList.map((svc) => (
          <div key={svc.id} className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-3 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-foreground">{svc.serviceName}</h4>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {svc.category}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> {svc.status}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px]">
              <span className="text-muted-foreground">Uptime: <span className="font-bold text-emerald-600 font-mono">{svc.uptimePercentage}%</span></span>
              <span className="text-muted-foreground">Latency: <span className="font-bold text-foreground font-mono">{svc.latencyMs} ms</span></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
