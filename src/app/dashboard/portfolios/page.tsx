"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import {
  FolderKanban,
  Plus,
  Search,
  Globe,
  FileEdit,
  Trash2,
  ExternalLink,
  Sparkles,
  LayoutGrid,
  List,
  Eye,
  Copy,
  SlidersHorizontal,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";
import { PortfolioPreviewModal } from "@/components/dashboard/ui/PortfolioPreviewModal";
import { cn } from "@/lib/utils";

interface PortfolioItem {
  id: string;
  name: string;
  theme: string;
  status: "draft" | "published";
  domain?: string;
  updatedAt: string;
}

export default function PortfoliosPage() {
  const { user } = useAuthStore();
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Preview modal state
  const [previewPortfolioId, setPreviewPortfolioId] = useState<string | null>(null);
  const [previewPortfolioTitle, setPreviewPortfolioTitle] = useState<string>("");

  useEffect(() => {
    if (!user) return;

    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "websiteBuilders"), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        const loaded: PortfolioItem[] = [];
        snap.forEach((d) => {
          const data = d.data();
          loaded.push({
            id: d.id,
            name: data.personalInfo?.fullName
              ? `${data.personalInfo.fullName}'s Portfolio`
              : `Portfolio ${d.id.slice(0, 6)}`,
            theme: data.preferences?.themeId || "minimalist",
            status: data.status || "draft",
            domain: data.domain || "",
            updatedAt: data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : "Recently",
          });
        });

        if (loaded.length === 0) {
          loaded.push({
            id: "demo-1",
            name: "Senior React Architect Portfolio",
            theme: "cyberpunk",
            status: "published",
            domain: "alexcarter.buildmyportfolio.com",
            updatedAt: new Date().toLocaleDateString(),
          });
        }
        setPortfolios(loaded);
      } catch (err) {
        console.error("Failed to query portfolios:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this portfolio?")) return;
    try {
      if (id !== "demo-1") {
        await deleteDoc(doc(db, "websiteBuilders", id));
      }
      setPortfolios((prev) => prev.filter((p) => p.id !== id));
      toast.success("Portfolio deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete portfolio.");
    }
  };

  const handleDuplicate = (portfolio: PortfolioItem) => {
    const duplicated: PortfolioItem = {
      ...portfolio,
      id: `copy-${Date.now()}`,
      name: `${portfolio.name} (Copy)`,
      status: "draft",
      updatedAt: "Just now",
    };
    setPortfolios([duplicated, ...portfolios]);
    toast.success("Portfolio duplicated as draft!");
  };

  const filteredPortfolios = portfolios.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 text-left">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <FolderKanban className="h-7 w-7 text-primary" /> My Portfolios
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage, preview, compile, and publish your AI-generated personal sites.
          </p>
        </div>

        <Link
          href="/dashboard/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold shadow-md hover:opacity-95 transition-opacity cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" /> Create New Portfolio
        </Link>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search portfolios by name..."
            className="w-full rounded-2xl border border-border/60 bg-card/70 pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary/45 shadow-xs"
          />
        </div>

        {/* Filters & Grid/List View Toggles */}
        <div className="flex items-center gap-3">
          {/* Status Filter Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-muted/40 border border-border/50 text-xs font-semibold">
            {(["all", "published", "draft"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={cn(
                  "px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer",
                  filterStatus === st ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                )}
              >
                {st}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-muted/40 border border-border/50 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-lg transition-colors cursor-pointer",
                viewMode === "grid" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
              )}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded-lg transition-colors cursor-pointer",
                viewMode === "list" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
              )}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Items List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-muted-foreground font-medium">
          Loading portfolios...
        </div>
      ) : filteredPortfolios.length === 0 ? (
        <div className="py-20 border-2 border-dashed border-border/60 rounded-3xl text-center space-y-3 p-8">
          <FolderKanban className="h-10 w-10 mx-auto text-muted-foreground/30" />
          <p className="text-sm font-bold text-foreground">No portfolios found</p>
          <p className="text-xs text-muted-foreground">Try clearing search filters or create a new portfolio.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolios.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-4 hover:border-primary/40 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider",
                      item.status === "published"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    )}
                  >
                    {item.status}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60">{item.updatedAt}</span>
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Theme: {item.theme}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/40">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewPortfolioId(item.id);
                      setPreviewPortfolioTitle(item.name);
                    }}
                    className="p-2 rounded-xl border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    title="Quick Preview Sandbox"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicate(item)}
                    className="p-2 rounded-xl border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    title="Duplicate Portfolio"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl border border-border/60 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                    title="Delete Portfolio"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <Link
                  href={`/dashboard/create?builderId=${item.id}`}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:opacity-90 transition-opacity"
                >
                  Edit Portfolio
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="rounded-3xl border border-border/60 bg-card/70 overflow-hidden shadow-sm backdrop-blur-2xl divide-y divide-border/40">
          {filteredPortfolios.map((item) => (
            <div
              key={item.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="min-w-0 text-left">
                  <h4 className="text-xs font-bold text-foreground truncate">{item.name}</h4>
                  <p className="text-[10px] text-muted-foreground">Updated {item.updatedAt} • Theme: {item.theme}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider",
                    item.status === "published"
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                  )}
                >
                  {item.status}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setPreviewPortfolioId(item.id);
                    setPreviewPortfolioTitle(item.name);
                  }}
                  className="p-2 rounded-xl border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Preview"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <Link
                  href={`/dashboard/create?builderId=${item.id}`}
                  className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Portfolio Preview Drawer/Modal */}
      <PortfolioPreviewModal
        isOpen={Boolean(previewPortfolioId)}
        portfolioId={previewPortfolioId}
        portfolioTitle={previewPortfolioTitle}
        onClose={() => setPreviewPortfolioId(null)}
      />
    </div>
  );
}
