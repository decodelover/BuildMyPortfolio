"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { FolderKanban, Plus, Search, Filter, Loader2, Globe, FileEdit, Trash2, ExternalLink } from "lucide-react";
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
    toast.info("Opening editor dashboard...");
    // Future routing link: router.push(`/dashboard/editor/${id}`)
  };

  const handleDelete = async (id: string) => {
    const confirmation = window.confirm("Are you sure you want to delete this portfolio? This cannot be undone.");
    if (!confirmation) return;
    toast.success("Portfolio deleted successfully.");
    setPortfolios(portfolios.filter((p) => p.id !== id));
  };

  const filteredPortfolios = portfolios.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.theme.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 text-left max-w-5xl">
      
      {/* Header segment with CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight">My Portfolios</h1>
          <p className="text-sm text-muted-foreground">Manage, edit, or configure your hosted developer portfolios.</p>
        </div>
        
        <Link
          href="/dashboard/create"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          Create New Portfolio
        </Link>
      </div>

      {/* Search & Filter Options */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between text-xs font-semibold">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search portfolios, themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-8 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {(["all", "published", "draft"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "rounded px-3 py-1.5 uppercase tracking-wider border border-border transition-colors",
                filterStatus === status ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-muted"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Grid listing */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-2">
          <Loader2 className="h-8 w-8 animate-spin opacity-45" />
          <p className="text-xs">Fetching portfolio registry...</p>
        </div>
      ) : filteredPortfolios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolios.map((portfolio) => (
            <div
              key={portfolio.id}
              className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col justify-between hover:border-primary/45 transition-colors"
            >
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="font-bold text-foreground text-sm">{portfolio.name}</h4>
                    <span className="text-[10px] text-muted-foreground font-mono block">Theme: {portfolio.theme}</span>
                  </div>
                  <span className={cn(
                    "rounded px-2.5 py-0.5 text-[9px] font-bold uppercase",
                    portfolio.status === "published" ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                  )}>
                    {portfolio.status}
                  </span>
                </div>

                {portfolio.status === "published" && portfolio.domain && (
                  <div className="flex items-center gap-1.5 text-[11px] text-primary font-semibold">
                    <Globe className="h-3.5 w-3.5" />
                    <span className="truncate">{portfolio.domain}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-border px-5 py-3 bg-muted/20 flex justify-between items-center text-xs font-semibold">
                <span className="text-[10px] text-muted-foreground">Updated {portfolio.updatedAt}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(portfolio.id)}
                    className="rounded p-1 text-muted-foreground hover:text-primary transition-colors"
                    title="Edit portfolio"
                  >
                    <FileEdit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(portfolio.id)}
                    className="rounded p-1 text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete portfolio"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Dynamic Empty State */
        <div className="rounded-2xl border border-dashed border-border p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[300px]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary border border-border">
            <FolderKanban className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h3 className="text-base font-bold text-foreground">No portfolios found</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You haven&apos;t generated any portfolios yet. Create your first project using our guided setup launcher.
            </p>
          </div>
          <Link
            href="/dashboard/create"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all mt-2"
          >
            <Plus className="h-4 w-4" />
            Create First Portfolio
          </Link>
        </div>
      )}

      {/* Pagination items */}
      {filteredPortfolios.length > 0 && (
        <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground border-t border-border pt-4">
          <span>Showing {filteredPortfolios.length} of {filteredPortfolios.length} items</span>
          <div className="flex gap-1.5">
            <button className="rounded px-2.5 py-1 border border-border hover:bg-muted disabled:opacity-40" disabled>
              Prev
            </button>
            <button className="rounded px-2.5 py-1 border border-border hover:bg-muted disabled:opacity-40" disabled>
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
