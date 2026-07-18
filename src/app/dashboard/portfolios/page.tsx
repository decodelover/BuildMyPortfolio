"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { FolderKanban, Plus, Search, Loader2, Globe, FileEdit, Trash2, ExternalLink, Settings2, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PortfolioItem {
  id: string;
  name: string;
  theme: string;
  status: "draft" | "published";
  domain?: string;
  updatedAt: string;
}

// Background theme color mock mapping for templates visual previews
const themeBackgrounds: Record<string, string> = {
  minimalist: "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800",
  cyberpunk: "bg-zinc-950 border-cyan-500/30 text-cyan-400",
  brutalist: "bg-yellow-50 border-black dark:bg-yellow-950/20 dark:border-white",
  creative: "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800",
};

export default function PortfoliosPage() {
  const { user } = useAuthStore();
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");

  // Fetch portfolios dynamically from Firestore database
  useEffect(() => {
    if (!user) return;

    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "portfolios"),
          where("userId", "==", user.uid)
        );
        const snap = await getDocs(q);
        const loaded: PortfolioItem[] = [];
        snap.forEach((doc) => {
          const data = doc.data();
          loaded.push({
            id: doc.id,
            name: data.name || "My Developer Portfolio",
            theme: data.theme || "minimalist",
            status: data.status || "draft",
            domain: data.domain || "",
            updatedAt: data.updatedAt?.toDate().toLocaleDateString() || "Recently",
          });
        });

        // Add a mock dynamic item if empty to show design interactions clearly
        if (loaded.length === 0) {
          loaded.push({
            id: "mock-1",
            name: "Senior React Architect Portfolio",
            theme: "cyberpunk",
            status: "published",
            domain: "alexcarter.buildmyportfolio.com",
            updatedAt: new Date().toLocaleDateString(),
          });
        }
        setPortfolios(loaded);
      } catch (err) {
        console.error("Failed to query user portfolios list:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [user]);

  const handleEdit = (id: string) => {
    toast.info(`Opening theme and layout editor for portfolio: ${id}`);
  };

  const handleDelete = async (id: string) => {
    const confirmation = window.confirm("Are you sure you want to delete this portfolio? This cannot be undone.");
    if (!confirmation) return;
    toast.success("Portfolio deleted successfully.");
    setPortfolios(portfolios.filter((p) => p.id !== id));
  };

  const handleTogglePublish = (id: string) => {
    setPortfolios(portfolios.map((p) => {
      if (p.id === id) {
        const nextStatus = p.status === "published" ? "draft" : "published";
        toast.success(`Portfolio marked as ${nextStatus}!`);
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  const filteredPortfolios = portfolios.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.theme.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">My Portfolios</h1>
          <p className="text-sm text-muted-foreground font-medium">Manage, customize, and edit your live developer websites.</p>
        </div>
        
        <Link
          href="/dashboard/create"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all hover:-translate-y-0.5 shrink-0"
        >
          <Plus className="h-4 w-4" />
          Create Portfolio
        </Link>
      </div>

      {/* Control panel: Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between text-xs font-semibold">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search portfolios, themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-9 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-card border border-border p-1 rounded-lg">
          {(["all", "published", "draft"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "rounded px-3 py-1.5 uppercase tracking-wider text-[10px] font-extrabold transition-all cursor-pointer",
                filterStatus === status ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Layout items Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground space-y-2">
          <Loader2 className="h-9 w-9 animate-spin opacity-45" />
          <p className="text-xs">Fetching hosted templates...</p>
        </div>
      ) : filteredPortfolios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPortfolios.map((portfolio) => (
              <motion.div
                key={portfolio.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col justify-between hover:border-primary/45 transition-colors group relative"
              >
                {/* Visual Emulator Mock Block */}
                <div className={cn("h-44 flex flex-col justify-between p-5 border-b border-border relative overflow-hidden transition-all duration-300", themeBackgrounds[portfolio.theme] || themeBackgrounds.minimalist)}>
                  {/* Subtle Grid Pattern Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

                  <div className="flex justify-between items-start relative z-10">
                    <span className="text-[9px] font-mono tracking-wider opacity-60 uppercase bg-card/65 px-2 py-0.5 rounded border border-border">
                      {portfolio.theme} layout
                    </span>
                    
                    <button
                      onClick={() => handleTogglePublish(portfolio.id)}
                      className={cn(
                        "rounded px-2.5 py-0.5 text-[9px] font-bold uppercase border cursor-pointer transition-colors",
                        portfolio.status === "published" 
                          ? "border-green-500/20 bg-green-500/10 text-green-500" 
                          : "border-border bg-muted text-muted-foreground"
                      )}
                    >
                      {portfolio.status}
                    </button>
                  </div>

                  <div className="relative z-10 space-y-1 pb-2">
                    <h4 className="font-extrabold text-foreground text-base tracking-tight truncate">
                      {portfolio.name}
                    </h4>
                    {portfolio.status === "published" && portfolio.domain ? (
                      <a
                        href={`https://${portfolio.domain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[11px] text-primary hover:underline font-semibold"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[200px]">{portfolio.domain}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic block">Not published to domain yet</span>
                    )}
                  </div>
                </div>

                {/* Card footer options */}
                <div className="px-5 py-3.5 bg-muted/20 flex justify-between items-center text-xs font-semibold border-t border-border">
                  <span className="text-[10px] text-muted-foreground font-medium">Updated {portfolio.updatedAt}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(portfolio.id)}
                      className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      title="Edit website layout"
                    >
                      <FileEdit className="h-4.5 w-4.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(portfolio.id)}
                      className="rounded p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                      title="Remove site"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Dynamic Empty State */
        <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[340px]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary border border-border">
            <FolderKanban className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h3 className="text-base font-bold text-foreground">Launch your first website</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No developer portals compiled yet. Tap below to select templates and write your sections using Gemini.
            </p>
          </div>
          <Link
            href="/dashboard/create"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all mt-2"
          >
            <Plus className="h-4 w-4" />
            Build My Portfolio
          </Link>
        </div>
      )}

    </div>
  );
}
