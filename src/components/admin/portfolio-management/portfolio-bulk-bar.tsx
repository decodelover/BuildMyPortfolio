"use client";

import React from "react";
import { CheckCircle2, Ban, Trash2, Download, X, Folder, Sparkles, UserCheck } from "lucide-react";

interface PortfolioBulkBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkPublish: () => void;
  onBulkUnpublish: () => void;
  onBulkArchive: () => void;
  onBulkDelete: () => void;
  onBulkRegenerateSEO: () => void;
}

export function PortfolioBulkBar({
  selectedCount,
  onClearSelection,
  onBulkPublish,
  onBulkUnpublish,
  onBulkArchive,
  onBulkDelete,
  onBulkRegenerateSEO,
}: PortfolioBulkBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-foreground text-background px-6 py-3 rounded-2xl shadow-2xl border border-border/40 flex items-center gap-4 animate-in slide-in-from-bottom duration-300 backdrop-blur-md text-xs">
      <div className="flex items-center gap-2 border-r border-background/20 pr-4 font-bold">
        <Folder className="w-4 h-4 text-primary" />
        <span>{selectedCount} Selected</span>
        <button onClick={onClearSelection} className="p-1 hover:bg-background/20 rounded-full ml-1">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onBulkPublish}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all"
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Publish
        </button>

        <button
          onClick={onBulkUnpublish}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600/30 text-amber-300 border border-amber-500/40 font-bold hover:bg-amber-600 hover:text-white transition-all"
        >
          Unpublish
        </button>

        <button
          onClick={onBulkArchive}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background/20 text-background font-semibold hover:bg-background/30 transition-all"
        >
          <Ban className="w-3.5 h-3.5" /> Archive
        </button>

        <button
          onClick={onBulkRegenerateSEO}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Boost SEO
        </button>

        <button
          onClick={onBulkDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold hover:bg-rose-600 hover:text-white transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>
    </div>
  );
}
