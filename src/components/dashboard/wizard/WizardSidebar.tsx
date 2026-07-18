"use client";

import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { stepsList } from "./stepsConfig";
import { WizardProgress } from "./WizardProgress";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function WizardSidebar() {
  const { currentStep, completedSteps, setCurrentStep } = useWebsiteBuilderStore();

  return (
    <aside className="hidden md:flex w-72 flex-col border-r border-border bg-card/45 backdrop-blur-md h-[calc(100vh-3.5rem)] shrink-0 overflow-y-auto">
      {/* Progress tracker at the top of sidebar */}
      <div className="p-5 border-b border-border bg-card/60">
        <WizardProgress />
      </div>

      {/* Steps List */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {stepsList.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.includes(step.id);

          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={cn(
                "w-full flex items-center gap-3.5 rounded-xl p-3 text-left transition-all duration-300 group border focus:outline-none cursor-pointer relative overflow-hidden",
                isActive
                  ? "bg-primary/10 border-primary/25 shadow-sm text-foreground"
                  : "bg-transparent border-transparent hover:bg-muted/60 hover:border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {/* Active Step Glow Background */}
              {isActive && (
                <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary to-accent" />
              )}

              {/* Step Status Icon */}
              <div
                className={cn(
                  "h-7 w-7 rounded-lg flex items-center justify-center border text-xs font-bold shrink-0 transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary scale-105 shadow-md shadow-primary/10"
                    : isCompleted
                    ? "bg-accent/10 border-accent/25 text-accent"
                    : "bg-background border-border text-muted-foreground group-hover:border-primary/45 group-hover:text-foreground"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : <Icon className="h-4 w-4" />}
              </div>

              {/* Title & Mini Description */}
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold text-muted-foreground/80 uppercase tracking-widest leading-none">
                  Step {step.id}
                </p>
                <h4
                  className={cn(
                    "text-xs font-bold leading-tight truncate mt-1 transition-colors",
                    isActive ? "text-foreground font-extrabold" : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {step.title}
                </h4>
                <p className="text-[10px] text-muted-foreground/60 truncate mt-0.5 font-medium group-hover:text-muted-foreground/80 transition-colors">
                  {step.shortDesc}
                </p>
              </div>

              {/* Right indicators */}
              {isCompleted && !isActive && (
                <span className="text-[9px] font-semibold text-accent uppercase tracking-wider bg-accent/10 rounded-full px-1.5 py-0.5">
                  Done
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Workspace footnote */}
      <div className="p-4 border-t border-border bg-card/60 flex items-center justify-between text-[9px] font-mono text-muted-foreground/60">
        <span>V1.0.0-PRO</span>
        <span className="flex items-center gap-1">
          <Star className="h-2.5 w-2.5 text-accent animate-pulse" /> FOCUS ACTIVE
        </span>
      </div>
    </aside>
  );
}
export default WizardSidebar;
