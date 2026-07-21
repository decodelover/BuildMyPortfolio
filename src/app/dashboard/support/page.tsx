"use client";

import { useState } from "react";
import { AIStudioWorkspace } from "@/components/dashboard/workspace/AIStudioWorkspace";
import { HelpCircle, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SupportPage() {
  const [view, setView] = useState<"ai" | "tickets">("ai");

  return (
    <div className="space-y-6">
      {/* Top Selector Bar */}
      <div className="flex items-center gap-2 border-b border-border/40 pb-2">
        <button
          type="button"
          onClick={() => setView("ai")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
            view === "ai" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
          )}
        >
          AI Studio &amp; Copilot
        </button>
        <button
          type="button"
          onClick={() => setView("tickets")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
            view === "tickets" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Support Tickets SLA
        </button>
      </div>

      {view === "ai" ? (
        <AIStudioWorkspace />
      ) : (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl text-left space-y-4">
          <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" /> Dedicated Developer Support
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            Pro and Business subscribers receive guaranteed response times under 4 hours from senior software architects. Email support@buildmyportfolio.com anytime.
          </p>
        </div>
      )}
    </div>
  );
}
