"use client";

import React, { useEffect, useState } from "react";
import { PortfolioAnalyticsData, AnalyticsTimeframeType } from "@/types/admin-analytics";
import { Folder, Globe, Eye, Download, Award, Sparkles } from "lucide-react";

interface PortfolioBiViewProps {
  timeframe: AnalyticsTimeframeType;
}

export function PortfolioBiView({ timeframe }: PortfolioBiViewProps) {
  const [data, setData] = useState<PortfolioAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/analytics/portfolios?timeframe=${timeframe}`);
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
    return <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">Loading Portfolio Intelligence...</div>;
  }

  return (
    <div className="space-y-6 text-left">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Portfolios Created</span>
          <p className="text-2xl font-black text-primary">{data.portfoliosCreatedTotal.toLocaleString()}</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Published Portfolios</span>
          <p className="text-2xl font-black text-emerald-600">{data.publishedPortfoliosCount.toLocaleString()}</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Custom Domain Adoption</span>
          <p className="text-2xl font-black text-indigo-600">{data.customDomainAdoptionCount.toLocaleString()}</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Resume Downloads</span>
          <p className="text-2xl font-black text-amber-500">{data.resumeDownloadsTotal.toLocaleString()}</p>
        </div>
      </div>

      {/* Template Popularity Ranking */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 text-xs">
        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" /> Template Popularity Ranking
        </h4>

        <div className="space-y-3">
          {data.templatePopularity.map((tpl) => (
            <div key={tpl.templateId} className="space-y-1">
              <div className="flex items-center justify-between font-semibold">
                <span>{tpl.templateName}</span>
                <span>
                  {tpl.count.toLocaleString()} portfolios ({tpl.percentage}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${tpl.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
