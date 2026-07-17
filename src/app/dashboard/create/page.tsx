"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, ArrowRight, ShieldAlert, Laptop, ArrowLeft, Loader2, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

const themeSelections = [
  { id: "minimalist", name: "Modern Minimalist", desc: "Clean typography and spacious grid layouts." },
  { id: "cyberpunk", name: "Neon Cyberpunk", desc: "High contrast borders, retro gridlines, and terminal headers." },
  { id: "brutalist", name: "Neo-Brutalist", desc: "Stark bold borders and vibrant raw color interfaces." },
];

export default function CreatePortfolioPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [portfolioName, setPortfolioName] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("minimalist");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!portfolioName.trim()) {
      toast.error("Please enter a name for your portfolio.");
      return;
    }
    setGenerating(true);
    try {
      // Simulate backend AI generation pipeline trigger
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("AI Generation module is currently being configured. Landing shortly!");
      router.push("/dashboard/portfolios");
    } catch (err) {
      toast.error("Failed to generate portfolio draft.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8 text-left max-w-3xl">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight">Create Portfolio</h1>
        <p className="text-sm text-muted-foreground">guided step-by-step setup builder powered by Google Gemini AI.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-border pb-4 text-xs font-semibold text-muted-foreground">
          <span>Step {step} of 2</span>
          <div className="flex gap-1">
            <span className={cn("h-1.5 w-6 rounded-full", step >= 1 ? "bg-primary" : "bg-secondary")} />
            <span className={cn("h-1.5 w-6 rounded-full", step >= 2 ? "bg-primary" : "bg-secondary")} />
          </div>
        </div>

        {step === 1 ? (
          /* Step 1: Name and Description input */
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-foreground">Name your website project</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Choose a project name for your website. This will show up in your editor lists and header bars.
              </p>
            </div>

            <div className="space-y-2 font-semibold text-xs">
              <label className="text-muted-foreground uppercase text-[10px]">Portfolio Title</label>
              <input
                type="text"
                placeholder="e.g. Sarah's Full-Stack Cloud Portfolio"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/45"
              />
            </div>

            <button
              onClick={() => {
                if (!portfolioName.trim()) {
                  toast.error("Please enter a name for your portfolio.");
                  return;
                }
                setStep(2);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all ml-auto"
            >
              Choose Theme
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          /* Step 2: Theme Selector and Trigger */
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-foreground">Select styling layout preset</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pick a baseline presentation theme. You can swap this at any point inside your dashboard without affecting copy data.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themeSelections.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTheme(t.id)}
                  className={cn(
                    "rounded-xl border p-4 cursor-pointer hover:border-primary/45 transition-all select-none text-left flex flex-col justify-between h-[120px]",
                    selectedTheme === t.id ? "border-primary bg-primary/5 shadow-md scale-[1.01]" : "border-border"
                  )}
                >
                  <h4 className="font-bold text-foreground text-xs">{t.name}</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed mt-1.5">{t.desc}</p>
                  <div className="flex justify-end pt-2">
                    <span className={cn(
                      "h-4 w-4 rounded-full border flex items-center justify-center text-[9px] font-bold text-white",
                      selectedTheme === t.id ? "bg-primary border-primary" : "border-border bg-background"
                    )}>
                      {selectedTheme === t.id && "✓"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border mt-4">
              <button
                onClick={() => setStep(1)}
                disabled={generating}
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Go Back
              </button>

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    AI Scaffolding Page...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-3.5 w-3.5 text-accent animate-pulse" />
                    Generate Website Draft
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
