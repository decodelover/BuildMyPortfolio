"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Plus,
  Search,
  LayoutGrid,
  List,
  Eye,
  Copy,
  Trash2,
  ExternalLink,
  Globe,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { PortfolioPreviewModal } from "@/components/dashboard/ui/PortfolioPreviewModal";
import { cn } from "@/lib/utils";

export function BespokePortfoliosView() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"all" | "published" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewItem, setPreviewItem] = useState<{ id: string; title: string; domain?: string } | null>(null);

  const [items, setItems] = useState([
    {
      id: "p1",
      title: "Senior Full-Stack Architecture Portfolio",
      status: "Published",
      theme: "Cyberpunk Obsidian",
      updatedAt: "10 mins ago",
      domain: "alex-rivera.buildmyportfolio.com",
    },
    {
      id: "p2",
      title: "Cloud Systems & DevOps Engineering",
      status: "Draft",
      theme: "Minimalist Slate",
      updatedAt: "2 hours ago",
      domain: "devops-master.buildmyportfolio.com",
    },
  ]);

  const filteredItems = items.filter((item) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "published" && item.status === "Published") ||
      (activeTab === "draft" && item.status === "Draft");
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleDuplicate = (id: string) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;
    const newItem = {
      ...target,
      id: `p-${Date.now()}`,
      title: `${target.title} (Copy)`,
      status: "Draft" as const,
      updatedAt: "Just now",
    };
    setItems([newItem, ...items]);
    toast.success("Portfolio duplicated successfully!");
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    toast.success("Portfolio removed!");
  };

  return (
    <div className="space-y-6 text-left select-none">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <FolderKanban className="h-6 w-6 text-primary" /> My Portfolios
          </h1>
          <p className="text-xs text-muted-foreground font-medium">
            Manage, edit, preview, and deploy your personal portfolio websites.
          </p>
        </div>

        <Link
          href="/dashboard/create"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-extrabold text-xs shadow-md hover:opacity-95 transition-opacity flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Create New Portfolio
        </Link>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 text-xs font-bold">
          {(["all", "published", "draft"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1.5 rounded-xl capitalize transition-colors cursor-pointer",
                activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name..."
              className="rounded-xl border border-border/60 bg-background/80 pl-9 pr-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary/45 w-44"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-background border border-border/60">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn("p-1.5 rounded-lg transition-colors cursor-pointer", viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground")}
              title="Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn("p-1.5 rounded-lg transition-colors cursor-pointer", viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground")}
              title="List View"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-4 hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider",
                      item.status === "Published"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    )}
                  >
                    {item.status}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">{item.updatedAt}</span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">{item.domain}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewItem({ id: item.id, title: item.title, domain: item.domain })}
                    className="p-2 rounded-xl border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    title="Preview Sandbox"
                  >
                    <Eye className="h-4 w-4 text-primary" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicate(item.id)}
                    className="p-2 rounded-xl border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    title="Duplicate"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl border border-border/60 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <Link
                  href="/dashboard/create"
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:opacity-90 transition-opacity"
                >
                  Edit in Wizard
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="rounded-3xl border border-border/60 bg-card/70 overflow-hidden shadow-sm backdrop-blur-2xl">
          <div className="divide-y divide-border/40">
            {filteredItems.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-extrabold text-foreground">{item.title}</h4>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase",
                        item.status === "Published" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                      )}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono">{item.domain}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewItem({ id: item.id, title: item.title, domain: item.domain })}
                    className="p-1.5 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Preview"
                  >
                    <Eye className="h-3.5 w-3.5 text-primary" />
                  </button>
                  <Link
                    href="/dashboard/create"
                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:opacity-90"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <PortfolioPreviewModal
          isOpen={!!previewItem}
          onClose={() => setPreviewItem(null)}
          portfolioId={previewItem.id}
          portfolioTitle={previewItem.title}
        />
      )}
    </div>
  );
}
