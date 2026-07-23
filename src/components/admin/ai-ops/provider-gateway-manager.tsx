"use client";

import React, { useEffect, useState } from "react";
import { AIProviderConfig } from "@/types/admin-ai-ops";
import { Cpu, Zap, Activity, ShieldCheck, RefreshCw, CheckCircle2 } from "lucide-react";

export function ProviderGatewayManager() {
  const [providers, setProviders] = useState<AIProviderConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProviders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/ai-ops/providers");
      if (res.ok) {
        const data = await res.json();
        setProviders(data.providers || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" /> Multi-Model Provider Gateway &amp; Quotas
          </h3>
          <p className="text-xs text-muted-foreground">Monitor real-time latencies, rate limits (RPM/TPM), quota utilization, and model fallbacks.</p>
        </div>

        <button onClick={fetchProviders} className="p-2 rounded-xl bg-secondary border border-border">
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providers.map((p) => (
          <div key={p.id} className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-foreground">{p.name}</h4>
                  {p.isDefault && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-primary/10 text-primary uppercase">
                      DEFAULT PROVIDER
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground">Provider Gateway ID: {p.id}</span>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> {p.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-background border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Latency</span>
                <span className="font-mono font-bold text-foreground">{p.latencyMs} ms</span>
              </div>
              <div className="p-3 rounded-xl bg-background border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Availability</span>
                <span className="font-mono font-bold text-emerald-600">{p.availabilityPercentage}%</span>
              </div>
              <div className="p-3 rounded-xl bg-background border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Quota Used</span>
                <span className="font-mono font-bold text-primary">{p.quotaUsedPercentage}%</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/60">
              <h5 className="font-bold text-muted-foreground uppercase text-[10px]">Supported Provider Models</h5>
              {p.supportedModels.map((m) => (
                <div key={m.modelId} className="p-2.5 rounded-xl bg-background border flex items-center justify-between">
                  <div>
                    <span className="font-bold text-foreground">{m.modelName}</span>
                    <span className="text-[10px] text-muted-foreground block font-mono">
                      Max Context: {m.maxContextTokens.toLocaleString()} tokens
                    </span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-emerald-600 font-bold block">${m.costPer1kPromptTokensUSD}/1k prompt</span>
                    <span className="text-muted-foreground text-[10px]">${m.costPer1kCompletionTokensUSD}/1k completion</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
