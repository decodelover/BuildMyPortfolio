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
  CreditCard,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Eye,
  Search,
  Wand2,
  CheckCircle2,
  Clock,
  Layout,
  Layers,
  BarChart3,
  SlidersHorizontal,
} from "lucide-react";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { PortfolioPreviewModal } from "@/components/dashboard/ui/PortfolioPreviewModal";
import { cn } from "@/lib/utils";

interface ActivityLog {
  id: string;
  type: string;
  title: string;
  desc: string;
  time: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
}

export default function DashboardHome() {
  const { user } = useAuthStore();

  const [totalPortfolios, setTotalPortfolios] = useState(0);
  const [publishedPortfolios, setPublishedPortfolios] = useState(0);
  const [recentPortfolios, setRecentPortfolios] = useState<PortfolioItem[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityLog[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Preview modal state
  const [previewPortfolioId, setPreviewPortfolioId] = useState<string | null>(null);
  const [previewPortfolioTitle, setPreviewPortfolioTitle] = useState<string>("");

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        // Query user portfolios
        const portfoliosQuery = query(
          collection(db, "websiteBuilders"),
          where("userId", "==", user.uid)
        );
        const portfoliosSnap = await getDocs(portfoliosQuery);
        setTotalPortfolios(portfoliosSnap.size);

        const list: PortfolioItem[] = [];
        portfoliosSnap.forEach((doc) => {
          const d = doc.data();
          list.push({
            id: doc.id,
            title: d.personalInfo?.fullName
              ? `${d.personalInfo.fullName}'s Portfolio`
              : `Portfolio ${doc.id.slice(0, 6)}`,
            status: d.status || "draft",
            updatedAt: d.updatedAt ? new Date(d.updatedAt).toLocaleDateString() : "Recently",
          });
        });
        setRecentPortfolios(list.slice(0, 3));
        setPublishedPortfolios(list.filter((p) => p.status === "published").length);

        // Fetch notifications log
        const notificationsQuery = query(
          collection(db, "notifications"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(4)
        );
        const notificationsSnap = await getDocs(notificationsQuery);
        const logs: ActivityLog[] = [];
        notificationsSnap.forEach((doc) => {
          const data = doc.data();
          logs.push({
            id: doc.id,
            type: "notification",
            title: data.title || "Activity Alert",
            desc: data.message || "",
            time: "Today",
          });
        });

        if (logs.length === 0) {
          logs.push({
            id: "default-1",
            type: "system",
            title: "Welcome to BuildMyPortfolio AI",
            desc: "Your enterprise workspace is fully active and ready for portfolio generation.",
            time: "Just now",
          });
        }
        setRecentActivities(logs);
      } catch (err) {
        console.warn("Firestore dashboard stats fetch note:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [user]);

  const aiSuggestions = [
    {
      title: "Enhance Professional Headline",
      desc: "AI detected an opportunity to increase recruiter clicks by 35% with an executive summary.",
      actionLabel: "Optimize with AI",
    },
    {
      title: "Add Project Live Demos",
      desc: "Portfolios with active live links rank 2.4x higher on search engines.",
      actionLabel: "Update Projects",
    },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Top Welcome Banner */}
      <div className="relative rounded-3xl border border-border/60 bg-gradient-to-r from-card via-card/80 to-primary/10 p-6 sm:p-8 shadow-xl backdrop-blur-2xl overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> AI Workspace Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, {user?.fullName || "Creator"} 👋
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Your portfolios are active. Generate, compile, and publish high-converting personal websites powered by Gemini AI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 w-full md:w-auto">
          <Link
            href="/dashboard/create"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-xs shadow-lg hover:opacity-95 transition-opacity cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" /> Launch Portfolio Wizard
          </Link>
          <Link
            href="/dashboard/portfolios"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-border/80 bg-background/60 hover:bg-muted font-bold text-xs text-foreground transition-colors cursor-pointer"
          >
            <FolderKanban className="h-4 w-4 text-primary" /> View All ({totalPortfolios})
          </Link>
        </div>
      </div>

      {/* Metrics & Quotas Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Portfolios */}
        <div className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Total Portfolios</span>
            <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FolderKanban className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-foreground">{loadingStats ? "..." : totalPortfolios}</span>
            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> Active
            </span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(totalPortfolios * 20, 100)}%` }} />
          </div>
        </div>

        {/* Published Sites */}
        <div className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Published Sites</span>
            <div className="h-8 w-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <Globe className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-foreground">{loadingStats ? "..." : publishedPortfolios}</span>
            <span className="text-[10px] font-bold text-accent flex items-center gap-0.5">
              <CheckCircle2 className="h-3 w-3" /> Live CDN
            </span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full" style={{ width: `${publishedPortfolios > 0 ? 100 : 0}%` }} />
          </div>
        </div>

        {/* AI Credits Meter */}
        <div className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">AI Credits</span>
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-foreground">850 / 1,000</span>
            <span className="text-[10px] font-bold text-amber-500">85% Remaining</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: "85%" }} />
          </div>
        </div>

        {/* SEO Quality Index */}
        <div className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">SEO Quality Index</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <BarChart3 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-foreground">96 / 100</span>
            <span className="text-[10px] font-bold text-emerald-500">Optimized</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "96%" }} />
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Portfolios & AI Recommendations */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Portfolios Section */}
          <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Recent Portfolios</h3>
                <p className="text-xs text-muted-foreground">Manage and launch portfolio previews</p>
              </div>
              <Link
                href="/dashboard/portfolios"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {loadingStats ? (
              <div className="py-12 text-center text-xs text-muted-foreground">Loading portfolios...</div>
            ) : recentPortfolios.length === 0 ? (
              <div className="py-12 border-2 border-dashed border-border/60 rounded-2xl text-center space-y-3 p-6">
                <FolderKanban className="h-8 w-8 mx-auto text-muted-foreground/40" />
                <div>
                  <p className="text-xs font-bold text-foreground">No portfolios generated yet</p>
                  <p className="text-[11px] text-muted-foreground">Use the AI Wizard to generate your first site in minutes.</p>
                </div>
                <Link
                  href="/dashboard/create"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:opacity-90"
                >
                  <PlusCircle className="h-4 w-4" /> Start Wizard
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recentPortfolios.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-border/60 bg-background/60 p-4 space-y-3 hover:border-primary/40 transition-all flex flex-col justify-between group shadow-xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider",
                            item.status === "published"
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          )}
                        >
                          {item.status}
                        </span>
                        <span className="text-[9px] text-muted-foreground/60">{item.updatedAt}</span>
                      </div>
                      <h4 className="text-xs font-bold text-foreground truncate">{item.title}</h4>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewPortfolioId(item.id);
                          setPreviewPortfolioTitle(item.title);
                        }}
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-border/60 hover:bg-muted text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <Eye className="h-3 w-3 text-primary" /> Preview
                      </button>
                      <Link
                        href={`/dashboard/create?builderId=${item.id}`}
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Suggestions Box */}
          <div className="rounded-3xl border border-accent/30 bg-accent/5 p-6 shadow-sm backdrop-blur-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <h3 className="text-sm font-bold text-foreground">Daily AI Optimizations</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {aiSuggestions.map((sugg, idx) => (
                <div key={idx} className="rounded-2xl border border-border/60 bg-card/80 p-4 space-y-2 text-left">
                  <h4 className="text-xs font-bold text-foreground">{sugg.title}</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{sugg.desc}</p>
                  <Link
                    href="/dashboard/create"
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-accent hover:underline pt-1"
                  >
                    {sugg.actionLabel} <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Activity Feed & Subscription Quick Card */}
        <div className="space-y-8">
          {/* Subscription Card */}
          <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-card to-primary/5 p-6 shadow-sm backdrop-blur-2xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-extrabold uppercase tracking-wider">
                Pro Plan
              </span>
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-foreground">Enterprise Creator</h4>
              <p className="text-xs text-muted-foreground">Unlimited AI generations & published portfolios.</p>
            </div>
            <Link
              href="/dashboard/billing"
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-border/80 bg-background/80 hover:bg-muted text-xs font-bold text-foreground transition-colors"
            >
              Manage Subscription
            </Link>
          </div>

          {/* Activity Timeline */}
          <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" /> Workspace Activity
              </h3>
              <span className="text-[10px] font-semibold text-muted-foreground">Real-time</span>
            </div>

            <div className="space-y-4">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex gap-3 text-xs">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <p className="font-bold text-foreground truncate">{act.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{act.desc}</p>
                    <span className="text-[9px] text-muted-foreground/60 block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Preview Modal */}
      <PortfolioPreviewModal
        isOpen={Boolean(previewPortfolioId)}
        portfolioId={previewPortfolioId}
        portfolioTitle={previewPortfolioTitle}
        onClose={() => setPreviewPortfolioId(null)}
      />
    </div>
  );
}
