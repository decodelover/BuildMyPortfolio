"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Eye, X, Lock, Monitor, Tablet, Smartphone, Palette, Check } from "lucide-react";
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

// Color palette options for customizer
const primaryColors = [
  { name: "Violet", class: "bg-violet-500", text: "text-violet-500", border: "border-violet-500" },
  { name: "Emerald", class: "bg-emerald-500", text: "text-emerald-500", border: "border-emerald-500" },
  { name: "Amber", class: "bg-amber-500", text: "text-amber-500", border: "border-amber-500" },
];

export default function ThemesPage() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  
  // Customizer state
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeColor, setActiveColor] = useState(primaryColors[0]);

  const handleUseTheme = (themeId: string, plan: string) => {
    if (plan !== "FREE") {
      toast.info(`Theme requires a ${plan} subscription to configure. Manage your plan in the Billing tab.`);
      return;
    }
    toast.success(`Success! Configured layout baseline to ${themeId}.`);
  };

  const previewData = themesList.find((t) => t.id === selectedTheme);

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Theme Catalog</h1>
        <p className="text-sm text-muted-foreground font-medium">Select or preview responsive stylesheets for your hosted developer portfolio.</p>
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
                className="inline-flex items-center gap-1.5 hover:text-primary transition-colors text-muted-foreground cursor-pointer"
              >
                <Eye className="h-4 w-4" />
                Live Preview
              </button>
              
              <button
                onClick={() => handleUseTheme(theme.id, theme.plan)}
                className="rounded-lg bg-secondary border border-border px-3.5 py-1.5 hover:bg-muted transition-colors text-foreground cursor-pointer"
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
              className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 w-full max-w-5xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-6 flex flex-col md:flex-row gap-6 h-[85vh] md:h-auto overflow-y-auto md:overflow-visible"
            >
              
              {/* Left Side: Mock preview canvas window */}
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <div className="space-y-0.5">
                    <h3 className="font-extrabold text-sm text-foreground">{previewData.name}</h3>
                    <p className="text-[10px] text-muted-foreground">Interactive responsive simulator canvas</p>
                  </div>
                  
                  {/* Viewport size controls */}
                  <div className="flex items-center gap-1 bg-secondary p-1 rounded-lg border border-border">
                    <button
                      onClick={() => setViewportMode("desktop")}
                      className={cn("rounded p-1 cursor-pointer transition-colors", viewportMode === "desktop" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                      title="Desktop view"
                    >
                      <Monitor className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewportMode("tablet")}
                      className={cn("rounded p-1 cursor-pointer transition-colors", viewportMode === "tablet" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                      title="Tablet view"
                    >
                      <Tablet className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewportMode("mobile")}
                      className={cn("rounded p-1 cursor-pointer transition-colors", viewportMode === "mobile" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                      title="Mobile view"
                    >
                      <Smartphone className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Main preview box emulating sizes */}
                <div className="flex-1 flex items-center justify-center bg-muted/40 p-4 rounded-xl border border-border min-h-[280px]">
                  <motion.div
                    layout
                    className={cn(
                      "w-full rounded-xl border border-border p-6 min-h-[240px] flex flex-col justify-between text-left transition-all duration-300 relative shadow-sm",
                      previewData.bgColor,
                      viewportMode === "desktop" ? "max-w-2xl" : viewportMode === "tablet" ? "max-w-md" : "max-w-xs"
                    )}
                  >
                    <div className="space-y-5">
                      <div className="flex items-center justify-between border-b border-border/60 pb-2">
                        <span className={cn("text-xs font-black", previewData.textClass)}>Alex Carter</span>
                        <div className="flex gap-2.5 text-[9px] text-muted-foreground font-bold uppercase">
                          <span>Projects</span>
                          <span>Bio</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className={cn("text-lg font-black leading-snug", previewData.textClass)}>
                          Creative <span className={activeColor.text}>Software Architect</span>
                        </h4>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Building highly interactive web applications at scale. Scaffolding dynamic modules with AI logic.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[9px] font-mono text-muted-foreground pt-4 border-t border-border/60 mt-4">
                      <span>Powered by BuildMyPortfolio</span>
                      <span className={cn("font-bold hover:underline cursor-pointer", activeColor.text)}>View Projects →</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Right Side: Theme Customizer drawer panel */}
              <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 flex flex-col justify-between text-left shrink-0">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
                      <Palette className="h-4.5 w-4.5 text-primary" />
                      Customizer Settings
                    </h4>
                    <button onClick={() => setSelectedTheme(null)} className="rounded-lg p-1 hover:bg-muted cursor-pointer">
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  {/* Primary color swatches selection */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Primary Accent</span>
                    <div className="flex gap-2">
                      {primaryColors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setActiveColor(color)}
                          className={cn(
                            "h-7 w-7 rounded-full border border-border flex items-center justify-center cursor-pointer transition-transform hover:scale-105",
                            color.class,
                            activeColor.name === color.name ? "ring-2 ring-primary/45 scale-105" : ""
                          )}
                          title={color.name}
                        >
                          {activeColor.name === color.name && <Check className="h-3.5 w-3.5 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Description</span>
                    <p>{previewData.desc}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-border mt-6 space-y-3">
                  <span className="text-[10px] text-muted-foreground block font-bold">Plan Level: {previewData.plan}</span>
                  <button
                    onClick={() => {
                      setSelectedTheme(null);
                      handleUseTheme(previewData.id, previewData.plan);
                    }}
                    className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 text-xs font-semibold shadow hover:bg-primary/95 transition-all cursor-pointer text-center"
                  >
                    Select Theme
                  </button>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
