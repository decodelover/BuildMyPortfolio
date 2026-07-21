"use client";

import React from "react";
import { CheckCircle2, Clock, Zap, CreditCard, ShieldCheck, AlertCircle } from "lucide-react";
import { Invoice } from "@/lib/billing-engine/types";

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "payment" | "created" | "plan_change" | "renewed" | "cancelled";
}

interface BillingTimelineProps {
  invoices?: Invoice[];
  currentPlanName?: string;
  periodEnd?: string;
}

export function BillingTimeline({ invoices = [], currentPlanName = "Free", periodEnd }: BillingTimelineProps) {
  const events: TimelineEvent[] = [];

  // Map generated invoices into timeline events
  invoices.forEach((inv) => {
    events.push({
      id: inv.invoiceId,
      title: `Payment Received ($${inv.total}.00)`,
      description: inv.items[0]?.description || "Subscription renewal charge",
      date: new Date(inv.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      type: "payment",
    });
  });

  // Default timeline event
  if (events.length === 0) {
    events.push({
      id: "evt-init",
      title: "Account Subscription Activated",
      description: `Enrolled in the ${currentPlanName} Plan tier.`,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      type: "created",
    });
  }

  if (periodEnd) {
    events.unshift({
      id: "evt-upcoming",
      title: "Upcoming Cycle Renewal",
      description: `Next billing statement scheduled for ${periodEnd}`,
      date: periodEnd,
      type: "renewed",
    });
  }

  const getEventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "payment":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "renewed":
        return <Clock className="h-4 w-4 text-primary" />;
      case "plan_change":
        return <Zap className="h-4 w-4 text-accent" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-rose-500" />;
      default:
        return <ShieldCheck className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md p-6 space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <CreditCard className="h-4.5 w-4.5 text-primary" />
            Billing Event Activity Stream
          </h3>
          <p className="text-xs text-muted-foreground">Historical timeline of payments, renewals, and plan adjustments.</p>
        </div>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
        {events.map((evt) => (
          <div key={evt.id} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-card border border-border shadow-sm">
              {getEventIcon(evt.type)}
            </div>

            <div className="space-y-0.5">
              <h4 className="font-bold text-foreground text-xs leading-snug">{evt.title}</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{evt.description}</p>
            </div>

            <span className="text-[10px] font-semibold text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-md border border-border/40 shrink-0 self-start sm:self-auto">
              {evt.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
