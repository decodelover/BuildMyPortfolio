"use client";

import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { Cloud, CloudOff, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function SaveStatus() {
  const autosaveState = useWebsiteBuilderStore((state) => state.autosaveState);

  const statusConfig = {
    saving: {
      text: "Saving...",
      icon: <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />,
      className: "bg-primary/5 text-primary border-primary/20",
    },
    saved: {
      text: "Saved to cloud",
      icon: <Cloud className="h-3.5 w-3.5 text-accent" />,
      className: "bg-accent/5 text-accent border-accent/20",
    },
    offline: {
      text: "Offline mode",
      icon: <CloudOff className="h-3.5 w-3.5 text-amber-500" />,
      className: "bg-amber-500/5 text-amber-500 border-amber-500/20",
    },
    error: {
      text: "Sync failed",
      icon: <AlertCircle className="h-3.5 w-3.5 text-destructive" />,
      className: "bg-destructive/5 text-destructive border-destructive/20",
    },
  };

  const current = statusConfig[autosaveState] || statusConfig.saved;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={autosaveState}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        transition={{ duration: 0.15 }}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm transition-all",
          current.className
        )}
      >
        {current.icon}
        <span>{current.text}</span>
      </motion.div>
    </AnimatePresence>
  );
}
export default SaveStatus;
