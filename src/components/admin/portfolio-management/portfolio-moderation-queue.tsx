"use client";

import React, { useEffect, useState } from "react";
import { AdminPortfolio } from "@/types/admin-portfolio";
import { ShieldAlert, CheckCircle2, XCircle, RefreshCw, Eye, MessageSquare } from "lucide-react";

export function PortfolioModerationQueue() {
  const [queue, setQueue] = useState<AdminPortfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<AdminPortfolio | null>(null);
  const [notes, setNotes] = useState("");

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/portfolios/moderation");
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

  const handleModeration = async (action: "approve" | "reject") => {
    if (!selectedItem) return;
    try {
      const res = await fetch("/api/admin/portfolios/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          portfolioId: selectedItem.id,
          reason: action === "reject" ? "Content Policy Violation" : undefined,
          notes,
        }),
      });
      if (res.ok) {
        setSelectedItem(null);
        setNotes("");
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
            <ShieldAlert className="w-4 h-4 text-rose-500" /> Content Moderation &amp; Safety Review Queue
          </h3>
          <p className="text-xs text-muted-foreground">Inspect reported or automatically flagged portfolios, review asset safety, and issue decisions.</p>
        </div>

        <button onClick={fetchQueue} className="p-2 rounded-xl bg-secondary border border-border">
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Moderation Items Grid */}
      {queue.length === 0 ? (
        <div className="p-12 text-center text-xs text-muted-foreground border border-dashed border-border rounded-2xl space-y-2">
          <ShieldAlert className="w-8 h-8 text-emerald-500 mx-auto opacity-70" />
          <p className="font-bold text-foreground">Moderation Queue Clear</p>
          <p>No portfolios currently require safety review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {queue.map((item) => (
            <div key={item.id} className="p-5 rounded-2xl border border-rose-500/30 bg-card shadow-sm space-y-3 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-foreground text-sm">{item.name}</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Owner: <span className="font-bold text-foreground">{item.ownerName}</span> ({item.ownerEmail})
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20 uppercase">
                  FLAGGED FOR REVIEW
                </span>
              </div>

              {item.moderationInfo?.flagReason && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 font-medium">
                  Flag Reason: {item.moderationInfo.flagReason}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    handleModeration("approve");
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve Portfolio
                </button>
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    handleModeration("reject");
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject &amp; Unpublish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
