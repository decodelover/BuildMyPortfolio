"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Monitor, Tablet, Smartphone, Sparkles, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface PortfolioPreviewModalProps {
  isOpen: boolean;
  portfolioId: string | null;
  portfolioTitle?: string;
  onClose: () => void;
}

export function PortfolioPreviewModal({
  isOpen,
  portfolioId,
  portfolioTitle = "Portfolio Preview",
  onClose,
}: PortfolioPreviewModalProps) {
  const router = useRouter();
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  if (!portfolioId) return null;

  const previewUrl = `/preview/${portfolioId}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-6xl h-[85vh] rounded-3xl border border-border/80 bg-card/95 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-4 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{portfolioTitle}</h3>
                  <p className="text-[10px] text-muted-foreground font-semibold">Live Sandbox Preview</p>
                </div>
              </div>

              {/* Device Mode Switcher */}
              <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-muted/40 border border-border/50">
                <button
                  type="button"
                  onClick={() => setDeviceMode("desktop")}
                  className={cn(
                    "p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer",
                    deviceMode === "desktop" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                  )}
                >
                  <Monitor className="h-3.5 w-3.5" /> Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceMode("tablet")}
                  className={cn(
                    "p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer",
                    deviceMode === "tablet" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                  )}
                >
                  <Tablet className="h-3.5 w-3.5" /> Tablet
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceMode("mobile")}
                  className={cn(
                    "p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer",
                    deviceMode === "mobile" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                  )}
                >
                  <Smartphone className="h-3.5 w-3.5" /> Mobile
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push(`/dashboard/create?builderId=${portfolioId}`);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm hover:opacity-90 transition-opacity"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit Wizard
                </button>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-xl border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="Open full page in new tab"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* Frame Body */}
            <div className="flex-1 bg-muted/30 p-4 sm:p-6 overflow-hidden flex items-center justify-center">
              <div
                className={cn(
                  "h-full bg-background rounded-2xl shadow-xl border border-border/60 overflow-hidden transition-all duration-300",
                  deviceMode === "desktop" && "w-full",
                  deviceMode === "tablet" && "w-[768px] max-w-full",
                  deviceMode === "mobile" && "w-[390px] max-w-full"
                )}
              >
                <iframe
                  src={previewUrl}
                  title="Portfolio Sandbox Preview"
                  className="w-full h-full border-none"
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
