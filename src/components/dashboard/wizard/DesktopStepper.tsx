"use client";

import { useRef, useEffect } from "react";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { stepsList } from "./stepsConfig";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function DesktopStepper() {
  const { currentStep, completedSteps, setCurrentStep } = useWebsiteBuilderStore();
  const activeStepRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active step into view inside the horizontal stepper
  useEffect(() => {
    if (activeStepRef.current && containerRef.current) {
      const container = containerRef.current;
      const element = activeStepRef.current;
      
      const containerScrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const elementLeft = element.offsetLeft;
      const elementWidth = element.clientWidth;

      const targetScroll = elementLeft - containerWidth / 2 + elementWidth / 2;
      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  }, [currentStep]);

  return (
    <div
      ref={containerRef}
      className="hidden md:flex items-center gap-4 overflow-x-auto pb-3 pt-1 px-4 scrollbar-none border-b border-border bg-card/50 backdrop-blur-sm sticky top-14 z-20"
      style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
    >
      {stepsList.map((step) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = completedSteps.includes(step.id);

        return (
          <button
            key={step.id}
            ref={isActive ? activeStepRef : null}
            onClick={() => setCurrentStep(step.id)}
            className="flex items-center gap-2 shrink-0 group focus:outline-none cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              {/* Step Circle */}
              <div
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center border text-xs font-bold transition-all duration-300 shadow-sm",
                  isActive
                    ? "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20 scale-105"
                    : isCompleted
                    ? "bg-accent/15 border-accent text-accent group-hover:bg-accent/25"
                    : "bg-background border-border text-muted-foreground group-hover:border-primary/45 group-hover:text-foreground"
                )}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : step.id}
              </div>

              {/* Step Meta */}
              <div className="text-left">
                <p
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider leading-none transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Step {step.id}
                </p>
                <p
                  className={cn(
                    "text-xs font-semibold truncate max-w-[120px] transition-colors",
                    isActive ? "text-foreground font-extrabold" : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {step.title}
                </p>
              </div>
            </div>

            {/* Connection Line */}
            {step.id < stepsList.length && (
              <div
                className={cn(
                  "h-[1px] w-6 ml-2 transition-colors duration-300",
                  isCompleted ? "bg-accent" : "bg-border"
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
export default DesktopStepper;
