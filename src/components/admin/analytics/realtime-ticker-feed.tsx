"use client";

import React, { useEffect, useState } from "react";
import { RealtimeActivityFeedItem } from "@/types/admin-analytics";
import { Activity, UserPlus, Folder, Sparkles, CreditCard, RefreshCw } from "lucide-react";

export function RealtimeTickerFeed() {
  const [feed, setFeed] = useState<RealtimeActivityFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeed = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/analytics/overview");
      if (res.ok) {
        // mock stream items
        setFeed([
          { id: "act_1", timestamp: new Date().toISOString(), type: "REGISTRATION", title: "New Account Signup", description: "Marcus Vance created a new developer account.", userEmail: "m.vance@dev.io" },
          { id: "act_2", timestamp: new Date(Date.now() - 45000).toISOString(), type: "PORTFOLIO_PUBLISH", title: "Portfolio Published", description: "Published 'AI Research Showcase' on custom domain.", userEmail: "research@ai.org" },
          { id: "act_3", timestamp: new Date(Date.now() - 120000).toISOString(), type: "SUBSCRIPTION_UPGRADE", title: "Plan Upgraded to BUSINESS", description: "Upgraded from PRO to BUSINESS plan.", userEmail: "sarah.c@techsolutions.io", amountUSD: 99 },
          { id: "act_4", timestamp: new Date(Date.now() - 300000).toISOString(), type: "AI_GENERATION", title: "AI Generation Completed", description: "Compiler Agent rendered layout in 1,240 ms." },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "REGISTRATION":
        return <UserPlus className="w-4 h-4 text-primary" />;
      case "PORTFOLIO_PUBLISH":
        return <Folder className="w-4 h-4 text-emerald-500" />;
      case "SUBSCRIPTION_UPGRADE":
        return <CreditCard className="w-4 h-4 text-indigo-500" />;
      case "AI_GENERATION":
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 text-left text-xs">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary animate-pulse" /> Live Realtime Activity Stream
        </h4>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          STREAMING LIVE
        </span>
      </div>

      <div className="space-y-3">
        {feed.map((item) => (
          <div key={item.id} className="p-3.5 rounded-xl border border-border bg-background flex items-start gap-3">
            <div className="p-2 rounded-lg bg-card border border-border">{getIcon(item.type)}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">{item.title}</span>
                <span className="text-[10px] text-muted-foreground">{new Date(item.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
