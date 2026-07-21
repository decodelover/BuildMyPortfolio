"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useBillingEngineStore } from "@/store/useBillingEngineStore";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Globe,
  FolderKanban,
  CreditCard,
  PlusCircle,
  TrendingUp,
  Activity,
  ArrowUpRight,
  TrendingDown,
} from "lucide-react";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { cn } from "@/lib/utils";

interface ActivityLog {
  id: string;
  type: string;
  title: string;
  desc: string;
  time: string;
}

export default function DashboardHome() {
  const { user } = useAuthStore();
  const { activePlan, usage, loadUserBillingState } = useBillingEngineStore();

  const [totalPortfolios, setTotalPortfolios] = useState(0);
  const [publishedPortfolios, setPublishedPortfolios] = useState(0);
  const [recentActivities, setRecentActivities] = useState<ActivityLog[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Chart state toggle: "views" or "credits"
  const [chartMetric, setChartMetric] = useState<"views" | "credits">("views");

  // Mock data representing weekly trends
  const chartData = {
    views: [
      { day: "Mon", val: 120 },
      { day: "Tue", val: 185 },
      { day: "Wed", val: 240 },
      { day: "Thu", val: 195 },
      { day: "Fri", val: 320 },
      { day: "Sat", val: 450 },
      { day: "Sun", val: 390 },
    ],
    credits: [
      { day: "Mon", val: 100 },
      { day: "Tue", val: 98 },
      { day: "Wed", val: 95 },
      { day: "Thu", val: 95 },
      { day: "Fri", val: 90 },
      { day: "Sat", val: 82 },
      { day: "Sun", val: 82 },
    ],
  };

  useEffect(() => {
    if (!user) return;
    loadUserBillingState(user.uid);

    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const portfoliosQuery = query(
          collection(db, "portfolios"),
          where("userId", "==", user.uid)
        );
        const portfoliosSnap = await getDocs(portfoliosQuery);
        setTotalPortfolios(portfoliosSnap.size);

        const publishedQuery = query(
          collection(db, "portfolios"),
          where("userId", "==", user.uid),
          where("status", "==", "published")
        );
        const publishedSnap = await getDocs(publishedQuery);
        setPublishedPortfolios(publishedSnap.size);

        const notificationsQuery = query(
          collection(db, "notifications"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(3)
        );
        const notificationsSnap = await getDocs(notificationsQuery);
        const logs: ActivityLog[] = [];
        notificationsSnap.forEach((doc) => {
          const data = doc.data();
          logs.push({
            id: doc.id,
            type: "notification",
            title: data.title || "Notification Received",
            desc: data.message || "",
            time: data.createdAt?.toDate().toLocaleDateString() || "Recently",
          });
        });

        if (logs.length === 0) {
          logs.push({
            id: "welcome",
            type: "welcome",
            title: "Welcome to BuildMyPortfolio!",
            desc: "Start generating your developer website inside the Create Portfolio tab.",
            time: new Date().toLocaleDateString(),
          });
        }
        setRecentActivities(logs);
      } catch (err) {
        console.error("Failed to query dashboard database stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [user, loadUserBillingState]);

  // SVG dimensions for chart drawing
  const chartWidth = 500;
  const chartHeight = 180;
  const padding = 20;

  // Build interactive SVG path string dynamically based on toggle metric
  const points = chartData[chartMetric];
  const maxVal = Math.max(...points.map((p) => p.val));
  const minVal = Math.min(...points.map((p) => p.val));
  const valRange = maxVal - minVal || 1;

  const coordinates = points.map((p, idx) => {
    const x = padding + (idx * (chartWidth - padding * 2)) / (points.length - 1);
    const y = chartHeight - padding - ((p.val - minVal) / valRange) * (chartHeight - padding * 2);
    return { x, y, day: p.day, val: p.val };
  });

  const linePath = coordinates.reduce((path, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, "");

  // Area filling path for gradient under the line chart
  const areaPath = `${linePath} L ${coordinates[coordinates.length - 1].x} ${chartHeight - padding} L ${coordinates[0].x} ${chartHeight - padding} Z`;

  const remainingCredits = activePlan ? Math.max(0, activePlan.limits.aiCreditsPerMonth - (usage?.aiCreditsUsed || 0)) : 50;

  const stats = [
    {
      label: "Total Portfolios",
      value: loadingStats ? "..." : totalPortfolios,
      desc: "Scaffolded templates",
      icon: <FolderKanban className="h-5 w-5 text-primary" />,
      color: "bg-primary/10 border-primary/20",
    },
    {
      label: "Published Websites",
      value: loadingStats ? "..." : publishedPortfolios,
      desc: "Live edge hostnames",
      icon: <Globe className="h-5 w-5 text-accent" />,
      color: "bg-accent/10 border-accent/20",
    },
    {
      label: "Current Plan",
      value: activePlan?.name || user?.currentPlan || "FREE",
      desc: "Membership status",
      icon: <CreditCard className="h-5 w-5 text-primary" />,
      color: "bg-primary/10 border-primary/20",
    },
    {
      label: "AI Credits Left",
      value: `${remainingCredits}/${activePlan?.limits.aiCreditsPerMonth || 50}`,
      desc: "Gemini writing quota",
      icon: <Zap className="h-5 w-5 text-accent animate-pulse" />,
      color: "bg-accent/10 border-accent/20",
    },
  ];

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-primary/15 via-accent/5 to-transparent p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
            Control Hub Station
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            Manage your portfolios, verify analytics, and deploy templates using the control center.
          </p>
        </div>
        <Link
          href="/dashboard/create"
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/15 transition-all hover:-translate-y-0.5 max-w-[180px] shrink-0"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          Create Portfolio
        </Link>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="rounded-xl border border-border bg-card p-5 flex items-center justify-between shadow-sm hover:border-primary/45 transition-colors glow-card"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">{stat.label}</span>
              <p className="text-2xl font-black text-foreground">{stat.value}</p>
              <span className="text-[10px] text-muted-foreground block">{stat.desc}</span>
            </div>
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${stat.color}`}>
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dynamic Graph & Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Interactive SVG Chart */}
        <div className="lg:col-span-8 rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground">Interactive Metrics</h3>
            </div>

            {/* Metric filters toggle */}
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <button
                onClick={() => setChartMetric("views")}
                className={cn(
                  "rounded px-3 py-1 uppercase tracking-wider border transition-all cursor-pointer",
                  chartMetric === "views"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "text-muted-foreground border-border hover:bg-muted"
                )}
              >
                Page Views
              </button>
              <button
                onClick={() => setChartMetric("credits")}
                className={cn(
                  "rounded px-3 py-1 uppercase tracking-wider border transition-all cursor-pointer",
                  chartMetric === "credits"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "text-muted-foreground border-border hover:bg-muted"
                )}
              >
                AI Credits
              </button>
            </div>
          </div>

          {/* SVG Canvas Chart Rendering */}
          <div className="w-full overflow-hidden pt-4">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-full text-primary"
              aria-label="Interactive weekly metrics performance graph"
            >
              <defs>
                <linearGradient id="chartGlowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Gridlines */}
              <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="currentColor" strokeOpacity="0.05" strokeDasharray="4 4" />
              <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="currentColor" strokeOpacity="0.05" strokeDasharray="4 4" />
              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="currentColor" strokeOpacity="0.05" />

              {/* Filled Area */}
              <motion.path
                d={areaPath}
                fill="url(#chartGlowGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={`area-${chartMetric}`}
                transition={{ duration: 0.4 }}
              />

              {/* Connected Line Path */}
              <motion.path
                d={linePath}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                key={`line-${chartMetric}`}
                transition={{ duration: 0.6 }}
              />

              {/* Data points markers */}
              {coordinates.map((c, idx) => (
                <g key={`${chartMetric}-${idx}`} className="group/dot cursor-pointer">
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r="4"
                    className="fill-card stroke-primary stroke-2 transition-all group-hover/dot:r-6"
                  />
                  <text
                    x={c.x}
                    y={c.y - 12}
                    textAnchor="middle"
                    className="text-[9px] font-bold fill-foreground opacity-0 group-hover/dot:opacity-100 transition-opacity"
                  >
                    {c.val}
                  </text>
                  <text
                    x={c.x}
                    y={chartHeight - 4}
                    textAnchor="middle"
                    className="text-[9px] fill-muted-foreground font-semibold"
                  >
                    {c.day}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="flex justify-between items-center text-xs text-muted-foreground border-t border-border pt-4 mt-2">
            <span>Weekly analysis insights</span>
            <div className="flex items-center gap-1.5 text-xs text-green-500 font-bold">
              {chartMetric === "views" ? (
                <>
                  <TrendingUp className="h-4.5 w-4.5" />
                  +24% Increase
                </>
              ) : (
                <>
                  <TrendingDown className="h-4.5 w-4.5 text-amber-500" />
                  <span className="text-amber-500">-18% Consumed</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Actions & Logs */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick links preset */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-accent animate-pulse" />
              Quick Launcher
            </h3>

            <div className="space-y-2 text-xs font-semibold">
              <Link
                href="/dashboard/profile"
                className="flex items-center justify-between rounded-xl border border-border p-3.5 hover:bg-muted/50 hover:border-primary/45 transition-colors group"
              >
                <span>Edit Profile Details</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <Link
                href="/dashboard/themes"
                className="flex items-center justify-between rounded-xl border border-border p-3.5 hover:bg-muted/50 hover:border-primary/45 transition-colors group"
              >
                <span>Theme Library Showcase</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <Link
                href="/dashboard/billing"
                className="flex items-center justify-between rounded-xl border border-border p-3.5 hover:bg-muted/50 hover:border-primary/45 transition-colors group"
              >
                <span>Manage Plan Upgrades</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Activity feed list */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-primary" />
              Activity Feed
            </h3>

            <div className="space-y-4">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex gap-3.5 items-start text-xs border-b border-border/40 pb-3 last:border-0 last:pb-0">
                  <span className="h-2 w-2 rounded-full bg-accent shrink-0 mt-1.5" />
                  <div className="space-y-0.5 flex-1 text-left">
                    <h4 className="font-bold text-foreground">{act.title}</h4>
                    <p className="text-muted-foreground leading-relaxed text-[11px]">{act.desc}</p>
                    <span className="text-[10px] text-muted-foreground block pt-0.5">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
