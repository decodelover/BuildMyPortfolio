"use client";

import React, { useEffect, useState } from "react";
import { MonitoringAlertRule } from "@/types/admin-monitoring";
import { Bell, ShieldCheck, Mail, MessageSquare, Globe, CheckCircle2, RefreshCw } from "lucide-react";

export function AlertRulesManager() {
  const [alerts, setAlerts] = useState<MonitoringAlertRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/monitoring/alerts");
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleToggle = async (ruleId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/monitoring/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruleId, isEnabled: !currentStatus }),
      });
      if (res.ok) {
        fetchAlerts();
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
            <Bell className="w-4 h-4 text-primary" /> Automated Alert &amp; Incident Rule Trigger Engine
          </h3>
          <p className="text-xs text-muted-foreground">Configure metric thresholds and multi-channel delivery rules (Email, In-App, Webhook, Slack).</p>
        </div>

        <button onClick={fetchAlerts} className="p-2 rounded-xl bg-secondary border border-border">
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alerts.map((rule) => (
          <div key={rule.id} className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-foreground text-sm">{rule.name}</h4>
                <span className="text-[11px] font-mono text-muted-foreground">
                  Threshold: {rule.condition} {rule.threshold}
                </span>
              </div>

              <button
                onClick={() => handleToggle(rule.id, rule.isEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  rule.isEnabled ? "bg-emerald-500" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    rule.isEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-border/60">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Notification Channels:</span>
              {rule.channels.map((ch) => (
                <span key={ch} className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
                  {ch}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
