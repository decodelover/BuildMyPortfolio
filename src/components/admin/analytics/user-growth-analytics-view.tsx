"use client";

import React, { useEffect, useState } from "react";
import { UserAnalyticsData, AnalyticsTimeframeType } from "@/types/admin-analytics";
import { Users, Globe, Monitor, Smartphone, Compass, RefreshCw } from "lucide-react";

interface UserGrowthAnalyticsViewProps {
  timeframe: AnalyticsTimeframeType;
}

export function UserGrowthAnalyticsView({ timeframe }: UserGrowthAnalyticsViewProps) {
  const [data, setData] = useState<UserAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/analytics/users?timeframe=${timeframe}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [timeframe]);

  if (isLoading || !data) {
    return <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">Loading User Growth Analytics...</div>;
  }

  return (
    <div className="space-y-6 text-left">
      {/* Geographic Country Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" /> Geographic Country Distribution
            </h4>
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">Global Active Reach</span>
          </div>

          <div className="space-y-3">
            {data.countryDistribution.map((item) => (
              <div key={item.countryCode} className="space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted">
                      {item.countryCode}
                    </span>
                    {item.countryName}
                  </span>
                  <span>
                    {item.usersCount.toLocaleString()} users ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Devices & Browsers */}
        <div className="space-y-6">
          {/* Devices */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 text-xs">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Monitor className="w-4 h-4 text-sky-500" /> Device Distribution
            </h4>
            <div className="space-y-2">
              {data.deviceDistribution.map((d) => (
                <div key={d.deviceType} className="flex items-center justify-between p-2.5 rounded-xl bg-background border">
                  <span className="font-bold text-foreground">{d.deviceType}</span>
                  <span className="font-mono text-primary font-bold">{d.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Browsers */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 text-xs">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-500" /> Browser Market Share
            </h4>
            <div className="space-y-2">
              {data.browserDistribution.map((b) => (
                <div key={b.browserName} className="flex items-center justify-between p-2.5 rounded-xl bg-background border">
                  <span className="font-bold text-foreground">{b.browserName}</span>
                  <span className="font-mono text-emerald-600 font-bold">{b.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
