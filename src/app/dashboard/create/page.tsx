"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, ArrowRight, ArrowLeft, Loader2, Wand2, Check, Tag, Laptop, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

const themeSelections = [
  { id: "minimalist", name: "Modern Minimalist", desc: "Clean typography, light backgrounds, spacious elements." },
  { id: "cyberpunk", name: "Neon Cyberpunk", desc: "High contrast borders, neon accents, dark terminal frames." },
  { id: "brutalist", name: "Neo-Brutalist", desc: "Raw stark gridlines, heavy drop-shadows, high-impact titles." },
];

const keywordSuggestions = [
  "Frontend Architect",
  "Cloud Solutions Engineer",
  "Full-Stack Developer",
  "UI/UX Designer",
  "Cybersecurity Analyst",
  "Data Scientist",
];

const scaffoldSteps = [
  "Analyzing developer profile fields...",
  "Running Gemini AI copywriters for Hero text...",
  "Formatting layout section schemas...",
  "Optimizing image media blocks...",
  "Deploying compiled index page to edge database...",
];

export default function CreatePortfolioPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [portfolioName, setPortfolioName] = useState("");
  const [profession, setProfession] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("minimalist");
  
  // Scaffolding progression states
  const [generating, setGenerating] = useState(false);
  const [currentBuildStep, setCurrentBuildStep] = useState(0);

  // Cycle build steps emulator messages while loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (generating) {
      interval = setInterval(() => {
        setCurrentBuildStep((prev) => {
          if (prev < scaffoldSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 1200);
    } else {
      setCurrentBuildStep(0);
    }
    return () => clearInterval(interval);
  }, [generating]);

  const handleGenerate = async () => {
    if (!portfolioName.trim()) {
      toast.error("Please enter a name for your portfolio.");
      return;
    }
    if (!user) return;

    setGenerating(true);
    try {
      // 1. Emulate compile workflow time
      await new Promise((resolve) => setTimeout(resolve, 6000));

      // 2. Add document to Firestore database
      await addDoc(collection(db, "portfolios"), {
        userId: user.uid,
        name: portfolioName,
        theme: selectedTheme,
        profession: profession || null,
        status: "draft",
        domain: `${portfolioName.toLowerCase().replace(/[^a-z0-9]/g, "")}.buildmyportfolio.com`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success("AI Developer portfolio generated successfully!");
      router.push("/dashboard/portfolios");
    } catch (err) {
      console.error("AI Portfolio generation failure:", err);
      toast.error("Unable to generate website layout. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8 text-left max-w-3xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Create AI Portfolio</h1>
        <p className="text-sm text-muted-foreground font-medium">Configure options below to let Google Gemini scaffold your resume pages.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm relative overflow-hidden">
        
        {/* Step Indicator Top Bar */}
        {!generating && (
          <div className="flex items-center justify-between border-b border-border pb-5 text-xs font-semibold text-muted-foreground mb-6">
            <span>Step {step} of 2</span>
            <div className="flex gap-1.5">
              <span className={cn("h-1.5 w-8 rounded-full transition-colors", step >= 1 ? "bg-primary" : "bg-secondary")} />
              <span className={cn("h-1.5 w-8 rounded-full transition-colors", step >= 2 ? "bg-primary" : "bg-secondary")} />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {generating ? (
            /* Scaffolding build log emulator */
            <motion.div
              key="generating-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <Loader2 className="h-8 w-8 animate-spin" />
                <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1 animate-pulse" />
              </div>

              <div className="space-y-2 max-w-sm">
                <h3 className="text-base font-bold text-foreground">Scaffolding Portfolio Layout...</h3>
                <p className="text-xs text-muted-foreground leading-relaxed h-10">
                  {scaffoldSteps[currentBuildStep]}
                </p>
              </div>

              {/* Graphical progress visual line */}
              <div className="w-full max-w-xs bg-secondary h-1.5 rounded-full overflow-hidden border border-border">
                <motion.div
                  className="bg-primary h-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((currentBuildStep + 1) / scaffoldSteps.length) * 100}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>

              {/* Build term log mock lines */}
              <div className="w-full max-w-md rounded-xl bg-zinc-950 p-4 border border-zinc-800 text-left font-mono text-[10px] text-cyan-400 space-y-1.5 shadow-inner">
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <Terminal className="h-3 w-3" />
                  <span>GEMINI-COMPILER-LOG v1.0.0</span>
                </div>
                {scaffoldSteps.slice(0, currentBuildStep + 1).map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-zinc-600 select-none">&gt;</span>
                    <span className={idx === currentBuildStep ? "text-white animate-pulse" : "text-zinc-400"}>
                      {log} {idx < currentBuildStep && " [OK]"}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : step === 1 ? (
            /* Step 1: Info & Tag suggestions */
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-base font-bold text-foreground">General Website Details</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enter a portfolio name and customize your developer title. Tap suggestion pills to automatically inject profession tags.
                </p>
              </div>

              <div className="space-y-4 font-semibold text-xs">
                <div className="space-y-1.5">
                  <label className="text-muted-foreground uppercase text-[10px]">Website Project Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah's Full-Stack Cloud Portfolio"
                    value={portfolioName}
                    onChange={(e) => setPortfolioName(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/45"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground uppercase text-[10px]">Developer Profession</label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Frontend Architect"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/45"
                  />
                </div>

                {/* Pill tag suggesters */}
                <div className="space-y-2">
                  <label className="text-muted-foreground uppercase text-[9px] flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" /> Popular Title Presets
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {keywordSuggestions.map((kw) => (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => setProfession(kw)}
                        className={cn(
                          "rounded-full px-3 py-1 border border-border bg-card text-[10px] font-bold transition-all cursor-pointer",
                          profession === kw ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!portfolioName.trim()) {
                    toast.error("Please enter a name for your portfolio.");
                    return;
                  }
                  setStep(2);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all ml-auto cursor-pointer"
              >
                Choose Style Theme
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ) : (
            /* Step 2: Stylized Theme Selection Grid */
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-base font-bold text-foreground">Select presentation preset stylesheet</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Select a starting layout template. Themes manage layout grids, typography, and accent colors without affecting site logs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {themeSelections.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTheme(t.id)}
                    className={cn(
                      "rounded-xl border p-4 cursor-pointer hover:border-primary/45 transition-all select-none text-left flex flex-col justify-between h-[130px] bg-card",
                      selectedTheme === t.id ? "border-primary bg-primary/5 shadow-md" : "border-border"
                    )}
                  >
                    <h4 className="font-extrabold text-foreground text-xs">{t.name}</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed mt-1.5">{t.desc}</p>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[8px] font-mono text-muted-foreground uppercase">gemini active</span>
                      <span className={cn(
                        "h-4.5 w-4.5 rounded-full border flex items-center justify-center text-[9px] font-bold text-white transition-colors",
                        selectedTheme === t.id ? "bg-primary border-primary" : "border-border bg-background"
                      )}>
                        {selectedTheme === t.id && "✓"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-5 border-t border-border mt-4">
                <button
                  onClick={() => setStep(1)}
                  disabled={generating}
                  className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Go Back
                </button>

                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all cursor-pointer"
                >
                  <Wand2 className="h-3.5 w-3.5 text-accent animate-pulse" />
                  Scaffold Website Draft
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
