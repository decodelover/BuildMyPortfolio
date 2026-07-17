"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Globe,
  FolderKanban,
  UserCheck,
  CreditCard,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Activity,
} from "lucide-react";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";

interface ActivityLog {
  id: string;
  type: "portfolio_created" | "portfolio_published" | "profile_updated" | "billing_updated";
  title: string;
  desc: string;
  time: string;
}

export default function DashboardHome() {
  const { user } = useAuthStore();

  const [totalPortfolios, setTotalPortfolios] = useState(0);
  const [publishedPortfolios, setPublishedPortfolios] = useState(0);
  const [recentActivities, setRecentActivities] = useState<ActivityLog[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Fetch dynamic stats from firestore database
  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        // Query portfolios
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

        // Fetch user notifications for recent activity log fallback
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
            type: "profile_updated", // fallback
            title: data.title || "Notification Received",
            desc: data.message || "",
            time: data.createdAt?.toDate().toLocaleDateString() || "Recently",
          });
        });

        // Fallbacks if no notifications/activity exist yet
        if (logs.length === 0) {
          logs.push({
            id: "welcome",
            type: "portfolio_created",
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
  }, [user]);

  const stats = [
    {
      label: "Total Portfolios",
      value: loadingStats ? "..." : totalPortfolios,
      desc: "Created layouts",
      icon: <FolderKanban className="h-5 w-5 text-primary" />,
      color: "bg-primary/10 border-primary/20",
    },
    {
      label: "Published Websites",
      value: loadingStats ? "..." : publishedPortfolios,
      desc: "Live edge URLs",
      icon: <Globe className="h-5 w-5 text-accent" />,
      color: "bg-accent/10 border-accent/20",
    },
    {
      label: "Current Plan",
      value: user?.currentPlan || "FREE",
      desc: "Membership status",
      icon: <CreditCard className="h-5 w-5 text-primary" />,
      color: "bg-primary/10 border-primary/20",
    },
    {
      label: "AI Credits Left",
      value: `${user?.aiCredits ?? 100}/100`,
      desc: "Gemini writing quota",
      icon: <Zap className="h-5 w-5 text-accent animate-pulse" />,
      color: "bg-accent/10 border-accent/20",
    },
  ];

  return (
    <div className="space-y-8 text-left">
      
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-primary/10 via-accent/5 to-transparent p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
            Control Station
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            Generate new sites, swap styling templates, or review visitor statistics directly from your management desk.
          </p>
        </div>
        <Link
          href="/dashboard/create"
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all hover:-translate-y-0.5 max-w-[180px]"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          Create Portfolio
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="rounded-xl border border-border bg-card p-5 flex items-center justify-between shadow-sm hover:border-primary/45 transition-colors"
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

      {/* Activities & Actions panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Recent Activity */}
        <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-border">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-foreground">Recent Activity Logs</h3>
          </div>

          <div className="space-y-4">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex gap-4 items-start text-xs border-b border-border/40 pb-4 last:border-0 last:pb-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary shrink-0 border border-border">
                  <TrendingUp className="h-4 w-4 text-accent" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="font-bold text-foreground">{act.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{act.desc}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Action presets */}
        <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-border">
            <Sparkles className="h-5 w-5 text-accent animate-pulse" />
            <h3 className="font-bold text-foreground">Quick Action Shortcuts</h3>
          </div>

          <div className="grid grid-cols-1 gap-3 text-xs">
            <Link
              href="/dashboard/profile"
              className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-muted/50 hover:border-primary/45 transition-all group"
            >
              <div>
                <h4 className="font-bold text-foreground">Configure Profile settings</h4>
                <p className="text-muted-foreground mt-0.5">Customize bio, social tags, and avatar.</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/dashboard/billing"
              className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-muted/50 hover:border-primary/45 transition-all group"
            >
              <div>
                <h4 className="font-bold text-foreground">Manage Billing tier</h4>
                <p className="text-muted-foreground mt-0.5">Upgrade license and buy theme packs.</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/dashboard/themes"
              className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-muted/50 hover:border-primary/45 transition-all group"
            >
              <div>
                <h4 className="font-bold text-foreground">Browse Theme gallery</h4>
                <p className="text-muted-foreground mt-0.5">See responsive design presets.</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
