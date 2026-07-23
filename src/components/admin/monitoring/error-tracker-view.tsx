"use client";

import React, { useEffect, useState } from "react";
import { TrackedError } from "@/types/admin-monitoring";
import { AlertTriangle, Bug, Users, Eye, CheckCircle2, RefreshCw } from "lucide-react";

export function ErrorTrackerView() {
  const [errors, setErrors] = useState<TrackedError[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedError, setSelectedError] = useState<TrackedError | null>(null);

  const fetchErrors = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/monitoring/errors");
      if (res.ok) {
        const data = await res.json();
        setErrors(data.errors || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchErrors();
  }, []);

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Bug className="w-4 h-4 text-rose-500" /> Sentry &amp; Crashlytics Style Error Tracker
          </h3>
          <p className="text-xs text-muted-foreground">Track unhandled exceptions, failure occurrences, affected users, and inspect stack traces.</p>
        </div>

        <button onClick={fetchErrors} className="p-2 rounded-xl bg-secondary border border-border">
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Error List */}
      <div className="space-y-3">
        {errors.map((err) => (
          <div key={err.id} className="p-5 rounded-2xl border border-rose-500/30 bg-card shadow-sm space-y-3 text-xs">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-foreground text-sm font-mono">{err.errorTitle}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {err.serviceModule}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Last seen: {new Date(err.lastSeen).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono font-bold text-xs">
                <span className="text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  {err.occurrencesCount} events
                </span>
                <span className="text-sky-600 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  {err.affectedUsersCount} users
                </span>
              </div>
            </div>

            <pre className="p-3 rounded-xl bg-muted/40 font-mono text-[10px] text-muted-foreground overflow-x-auto truncate">
              {err.stackTrace}
            </pre>

            <div className="flex items-center justify-end">
              <button
                onClick={() => setSelectedError(err)}
                className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <Eye className="w-3.5 h-3.5" /> Inspect Full Stack Trace
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
