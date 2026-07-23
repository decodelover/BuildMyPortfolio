"use client";

import React, { useEffect, useState } from "react";
import { AIRequestLog, AIRequestQueryResult } from "@/types/admin-ai-ops";
import { Search, RefreshCw, Eye, X, CheckCircle2, AlertTriangle, Cpu, Clock, Code } from "lucide-react";

export function AIRequestInspector() {
  const [result, setResult] = useState<AIRequestQueryResult | null>(null);
  const [search, setSearch] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<AIRequestLog | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedAgent && selectedAgent !== "ALL") params.set("agentId", selectedAgent);
      const res = await fetch(`/api/admin/ai-ops/requests?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [search, selectedAgent]);

  const requests = result?.requests || [];

  return (
    <div className="space-y-6 text-left">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by user name, request ID, or agent..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none"
            />
          </div>

          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="text-xs bg-background border border-border rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="ALL">All AI Agents</option>
            <option value="content-agent">Content Agent</option>
            <option value="design-agent">Design Agent</option>
            <option value="seo-agent">SEO Agent</option>
            <option value="qa-agent">QA Agent</option>
            <option value="compiler-agent">Compiler Agent</option>
          </select>
        </div>

        <button onClick={fetchRequests} className="p-2 rounded-xl bg-secondary border border-border">
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b bg-muted/40 text-muted-foreground font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">Request ID / Time</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Agent Used</th>
              <th className="py-3 px-4">Model &amp; Provider</th>
              <th className="py-3 px-4">Tokens &amp; Cost</th>
              <th className="py-3 px-4">Runtime</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-muted/20">
                <td className="py-3.5 px-4 font-mono">
                  <div className="font-bold text-primary">{req.id}</div>
                  <div className="text-[10px] text-muted-foreground">{new Date(req.timestamp).toLocaleTimeString()}</div>
                </td>
                <td className="py-3.5 px-4 font-bold text-foreground">{req.userName}</td>
                <td className="py-3.5 px-4 font-medium">{req.agentName}</td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-foreground">{req.modelName}</div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">{req.providerId}</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-mono font-bold text-foreground">{req.promptTokens + req.completionTokens} tok</div>
                  <div className="text-[10px] font-semibold text-emerald-600">${req.estimatedCostUSD.toFixed(4)}</div>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-foreground">{req.executionTimeMs} ms</td>
                <td className="py-3.5 px-4">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    req.status === "completed" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                  }`}>
                    {req.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-card border-l border-border h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-base font-bold text-foreground">AI Request Inspection — {selectedRequest.id}</h3>
                <button onClick={() => setSelectedRequest(null)}><X className="w-5 h-5 text-muted-foreground" /></button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-background border">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">User</span>
                  <span className="font-bold">{selectedRequest.userName}</span>
                </div>
                <div className="p-3 rounded-xl bg-background border">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Agent</span>
                  <span className="font-bold">{selectedRequest.agentName}</span>
                </div>
                <div className="p-3 rounded-xl bg-background border">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Execution Time</span>
                  <span className="font-mono font-bold text-primary">{selectedRequest.executionTimeMs} ms</span>
                </div>
                <div className="p-3 rounded-xl bg-background border">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Estimated Cost</span>
                  <span className="font-mono font-bold text-emerald-600">${selectedRequest.estimatedCostUSD.toFixed(5)}</span>
                </div>
              </div>

              {selectedRequest.promptPreview && (
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-muted-foreground uppercase text-[10px]">Prompt Preview</span>
                  <div className="p-3 rounded-xl bg-muted/30 border font-mono text-[11px] text-foreground leading-relaxed">
                    {selectedRequest.promptPreview}
                  </div>
                </div>
              )}

              {selectedRequest.responsePreview && (
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-muted-foreground uppercase text-[10px]">Response Payload</span>
                  <div className="p-3 rounded-xl bg-muted/30 border font-mono text-[11px] text-foreground leading-relaxed">
                    {selectedRequest.responsePreview}
                  </div>
                </div>
              )}

              {selectedRequest.errorDetails && (
                <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs text-rose-600 font-semibold space-y-1">
                  <span className="font-bold">Error Stack / Details</span>
                  <p>{selectedRequest.errorDetails}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
