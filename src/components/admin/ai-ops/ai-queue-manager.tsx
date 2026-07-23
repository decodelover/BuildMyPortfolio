"use client";

import React, { useEffect, useState } from "react";
import { AIQueueItem, AIJobPriority } from "@/types/admin-ai-ops";
import { ListOrdered, RotateCcw, X, ArrowUp, RefreshCw, CheckCircle2 } from "lucide-react";

export function AIQueueManager() {
  const [queue, setQueue] = useState<AIQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/ai-ops/queue");
      if (res.ok) {
        const data = await res.json();
        setQueue(data.queue || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleQueueAction = async (action: "retry" | "cancel" | "prioritize", jobId: string, priority?: AIJobPriority) => {
    try {
      const res = await fetch("/api/admin/ai-ops/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, jobId, priority }),
      });
      if (res.ok) {
        fetchQueue();
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
            <ListOrdered className="w-4 h-4 text-primary" /> Live AI Execution Queue Manager
          </h3>
          <p className="text-xs text-muted-foreground">Monitor queued and running AI jobs, re-enqueue failures, cancel jobs, or boost priority.</p>
        </div>

        <button onClick={fetchQueue} className="p-2 rounded-xl bg-secondary border border-border">
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Queue Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b bg-muted/40 text-muted-foreground font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">Job ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Target Agent</th>
              <th className="py-3 px-4">Payload Summary</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Enqueued At</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {queue.map((job) => (
              <tr key={job.id} className="hover:bg-muted/20">
                <td className="py-3.5 px-4 font-mono font-bold text-primary">{job.id}</td>
                <td className="py-3.5 px-4 font-bold text-foreground">{job.customerName}</td>
                <td className="py-3.5 px-4 font-medium">{job.agentName}</td>
                <td className="py-3.5 px-4 text-muted-foreground font-medium max-w-xs truncate">{job.payloadSummary}</td>
                <td className="py-3.5 px-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    job.priority === "urgent" || job.priority === "high"
                      ? "bg-rose-500/10 text-rose-600"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {job.priority}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    job.status === "running"
                      ? "bg-sky-500/10 text-sky-600 animate-pulse"
                      : job.status === "queued"
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-emerald-500/10 text-emerald-600"
                  }`}>
                    {job.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-muted-foreground">{new Date(job.enqueuedAt).toLocaleTimeString()}</td>
                <td className="py-3.5 px-4 text-right space-x-1">
                  <button
                    onClick={() => handleQueueAction("prioritize", job.id, "high")}
                    title="Boost Priority"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleQueueAction("retry", job.id)}
                    title="Re-enqueue / Retry Job"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleQueueAction("cancel", job.id)}
                    title="Cancel Job"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
