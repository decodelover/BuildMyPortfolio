"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Palette, ShieldAlert, Laptop, Eye, Check, X, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const themesList = [
  {
    id: "minimalist",
    name: "Modern Minimalist",
    desc: "Clean layouts with subtle cues and high typographic priority.",
    plan: "FREE",
    badgeColor: "bg-secondary text-muted-foreground",
    bgColor: "bg-slate-50 dark:bg-slate-900/50",
    textClass: "font-sans",
  },
  {
    id: "cyberpunk",
    name: "Neon Cyberpunk",
    desc: "High contrast borders, retro grids, and glowing terminal panels.",
    plan: "PRO",
    badgeColor: "bg-primary/10 border-primary/20 text-primary",
    bgColor: "bg-zinc-950 border-cyan-500/20",
    textClass: "font-mono text-cyan-400",
  },
  {
    id: "brutalist",
    name: "Neo-Brutalist",
    desc: "Heavy black borders, stark primary colors, and structural layout grids.",
    plan: "PRO",
    badgeColor: "bg-primary/10 border-primary/20 text-primary",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20 border-black dark:border-white",
    textClass: "font-black tracking-tight",
  },
  {
    id: "creative",
    name: "Playful Creative",
    desc: "Soft colors, organic shapes, and fluid micro-animations.",
    plan: "ELITE",
    badgeColor: "bg-accent/10 border-accent/20 text-accent",
    bgColor: "bg-amber-50/50 dark:bg-amber-950/20",
    textClass: "font-serif",
  },
];

export default function ThemesPage() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const handleUseTheme = (themeId: string, plan: string) => {
    if (plan !== "FREE") {
      toast.info(`Theme requires a ${plan} subscription to configure. Manage your plan in the Billing tab.`);
      return;
    }
    toast.success(`Success! Configured layout baseline to ${themeId}.`);
  };

  const previewData = themesList.find((t) => t.id === selectedTheme);

  return (
    <div className="space-y-8 text-left max-w-5xl">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight">Theme Catalog</h1>
        <p className="text-sm text-muted-foreground">Select or preview responsive stylesheets for your hosted developer portfolio.</p>
      </div>

      {/* Themes layout grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {themesList.map((theme) => (
          <div
            key={theme.id}
            className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col justify-between hover:border-primary/45 transition-colors"
          >
            {/* Visual template mock card */}
            <div className={cn("h-40 flex flex-col justify-between p-6 border-b border-border text-left relative", theme.bgColor)}>
              <span className="text-[10px] font-mono tracking-widest uppercase opacity-45">TEMPLATE MOCKUP</span>
              <div>
                <h4 className={cn("text-lg font-bold truncate", theme.textClass)}>{theme.name}</h4>
                <p className="text-[10px] text-muted-foreground mt-1 max-w-[280px] leading-relaxed truncate">{theme.desc}</p>
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                {theme.plan !== "FREE" && <Lock className="h-3 w-3 text-muted-foreground shrink-0" />}
                <span className={cn("rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase", theme.badgeColor)}>
                  {theme.plan}
                </span>
              </div>
            </div>

            {/* Actions area */}
            <div className="px-6 py-4 bg-muted/10 flex justify-between items-center text-xs font-semibold">
              <button
                onClick={() => setSelectedTheme(theme.id)}
                className="inline-flex items-center gap-1.5 hover:text-primary transition-colors text-muted-foreground"
              >
                <Eye className="h-4 w-4" />
                Live Preview
              </button>
              
              <button
                onClick={() => handleUseTheme(theme.id, theme.plan)}
                className="rounded-lg bg-secondary border border-border px-3.5 py-1.5 hover:bg-muted transition-colors text-foreground"
              >
                Use Theme
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed overlay preview modal */}
      <AnimatePresence>
        {selectedTheme && previewData && (
          <>
            <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setSelectedTheme(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-border pb-3">
                <div className="space-y-0.5">
                  <h3 className="font-extrabold text-sm text-foreground">{previewData.name}</h3>
                  <p className="text-[10px] text-muted-foreground">Preview mock display</p>
                </div>
                <button onClick={() => setSelectedTheme(null)} className="rounded-lg p-1 hover:bg-muted">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Rendering canvas emulator */}
              <div className={cn("rounded-xl border border-border p-6 min-h-[220px] flex flex-col justify-between text-left", previewData.bgColor)}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/80 pb-2">
                    <span className={cn("text-xs font-bold", previewData.textClass)}>Alex Carter</span>
                    <div className="flex gap-2 text-[8px] text-muted-foreground font-semibold uppercase">
                      <span>Work</span>
                      <span>Bio</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className={cn("text-base font-bold", previewData.textClass)}>Creative Software Engineer</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed max-w-sm">
                      {previewData.desc} Highly optimized for edge scale.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[8px] font-mono text-muted-foreground pt-4 border-t border-border/80">
                  <span>Powered by BuildMyPortfolio</span>
                  <span className="font-bold text-foreground">Explore projects →</span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs font-semibold">
                <span className="text-[10px] text-muted-foreground">Theme Level: {previewData.plan}</span>
                <button
                  onClick={() => {
                    setSelectedTheme(null);
                    handleUseTheme(previewData.id, previewData.plan);
                  }}
                  className="rounded-lg bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/95 shadow transition-colors"
                >
                  Configure Layout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
