"use client";

import React, { useEffect, useState } from "react";
import { KnowledgeBaseArticle } from "@/types/admin-support";
import { HelpCircle, BookOpen, ThumbsUp, Eye, Search, Plus, RefreshCw } from "lucide-react";

export function KnowledgeBaseManager() {
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeBaseArticle | null>(null);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/support/kb");
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const filtered = articles.filter(
    (a) => selectedCategory === "ALL" || a.category === selectedCategory
  );

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" /> Centralized Knowledge Base &amp; Help Desk Manager
          </h3>
          <p className="text-xs text-muted-foreground">Manage help articles, tutorials, FAQs, and self-service documentation.</p>
        </div>

        <button onClick={fetchArticles} className="p-2 rounded-xl bg-secondary border border-border">
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold">
        {["ALL", "CUSTOM_DOMAIN", "AI_GENERATION", "BILLING", "PORTFOLIO_BUILDER"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            {cat.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((art) => (
          <div key={art.id} className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3 flex flex-col justify-between text-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
                  {art.category}
                </span>
                <span className="text-[11px] text-muted-foreground font-semibold">{art.viewsCount.toLocaleString()} views</span>
              </div>
              <h4 className="text-sm font-bold text-foreground">{art.title}</h4>
              <p className="text-muted-foreground leading-relaxed">{art.summary}</p>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">By {art.authorName}</span>
              <button
                onClick={() => setSelectedArticle(art)}
                className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <Eye className="w-3.5 h-3.5" /> Read Article
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
