"use client";

import React, { useEffect, useState } from "react";
import { AIAgentInfo } from "@/types/admin-ai-ops";
import { Bot, Cpu, CheckCircle2, Zap, Play, RefreshCw, Activity, ShieldCheck } from "lucide-react";

export function AIAgentManager() {
  const [agents, setAgents] = useState<AIAgentInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [diagnosticStatus, setDiagnosticStatus] = useState<string | null>(null);

  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/ai-ops/agents");
      if (res.ok) {
        const data = await res.json();
        setAgents(data.agents || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleRunDiagnostics = async (agentId: string) => {
    try {
      const res = await fetch("/api/admin/ai-ops/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId }),
      });
      if (res.ok) {
        setDiagnosticStatus(`Diagnostic check passed cleanly for ${agentId}.`);
        setTimeout(() => setDiagnosticStatus(null), 4000);
        fetchAgents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary" /> Autonomous AI Agent Swarm Directory
          </h3>
          <p className="text-xs text-muted-foreground">Monitor health scores, runtimes, versions, and trigger instant agent diagnostics.</p>
        </div>

        <button onClick={fetchAgents} className="p-2 rounded-xl bg-secondary border border-border">
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {diagnosticStatus && (
        <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {diagnosticStatus}
        </div>
      )}

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{agent.name}</h4>
                    <span className="text-[10px] font-mono text-muted-foreground font-semibold">{agent.version}</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase">
                  {agent.status}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{agent.description}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-border/60 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-background border border-border">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block">Avg Runtime</span>
                  <span className="font-mono font-bold text-foreground">{agent.averageRuntimeMs} ms</span>
                </div>
                <div className="p-2.5 rounded-xl bg-background border border-border">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block">Success Rate</span>
                  <span className="font-mono font-bold text-emerald-600">{agent.successRatePercentage}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Health Score: <span className="font-bold text-foreground">{agent.healthScorePercentage}%</span></span>
                <span>Queue Size: <span className="font-bold text-primary">{agent.queueSize}</span></span>
              </div>

              <button
                onClick={() => handleRunDiagnostics(agent.id)}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold bg-secondary hover:bg-secondary/80 border border-border rounded-xl transition-all"
              >
                <Play className="w-3.5 h-3.5 text-primary" /> Run Agent Diagnostics
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
