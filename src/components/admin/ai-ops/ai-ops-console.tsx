"use client";

import React, { useState } from "react";
import { Sparkles, Bot, Eye, Code, Cpu, ListOrdered, ShieldCheck } from "lucide-react";
import { AIOpsOverview } from "./ai-ops-overview";
import { AIAgentManager } from "./ai-agent-manager";
import { AIRequestInspector } from "./ai-request-inspector";
import { PromptEngineeringStudio } from "./prompt-engineering-studio";
import { ProviderGatewayManager } from "./provider-gateway-manager";
import { AIQueueManager } from "./ai-queue-manager";

export function AIOpsConsole() {
  const [activeTab, setActiveTab] = useState<"overview" | "agents" | "requests" | "prompts" | "providers" | "queue">("overview");

  return (
    <div className="space-y-6 text-left relative pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Enterprise AI Operations Control Center
          </h2>
          <p className="text-xs text-muted-foreground">
            Monitor, manage, optimize, and audit every AI request, autonomous agent, prompt template, model provider, and execution queue.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            AI Grid: 100% Operational
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto text-xs font-bold">
        {[
          { id: "overview", label: "Control Tower", icon: Sparkles },
          { id: "agents", label: "Autonomous Agents", icon: Bot },
          { id: "requests", label: "Request Inspector", icon: Eye },
          { id: "prompts", label: "Prompt Studio", icon: Code },
          { id: "providers", label: "Model Gateway", icon: Cpu },
          { id: "queue", label: "Execution Queue", icon: ListOrdered },
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

      {/* Tab Panels */}
      {activeTab === "overview" && <AIOpsOverview />}
      {activeTab === "agents" && <AIAgentManager />}
      {activeTab === "requests" && <AIRequestInspector />}
      {activeTab === "prompts" && <PromptEngineeringStudio />}
      {activeTab === "providers" && <ProviderGatewayManager />}
      {activeTab === "queue" && <AIQueueManager />}
    </div>
  );
}
