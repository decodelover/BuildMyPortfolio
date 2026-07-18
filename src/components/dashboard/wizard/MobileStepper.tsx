"use client";

import { useState } from "react";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { stepsList } from "./stepsConfig";
import { ChevronDown, Check, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function MobileStepper() {
  const { currentStep, completedSteps, setCurrentStep } = useWebsiteBuilderStore();
  const [isOpen, setIsOpen] = useState(false);

  const activeStep = stepsList.find((s) => s.id === currentStep) || stepsList[0];

  return (
    <div className="md:hidden border-b border-border bg-card/95 backdrop-blur-md sticky top-14 z-20">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-left focus:outline-none cursor-pointer group"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
              Step {currentStep} of {stepsList.length}
            </span>
            <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
              {activeStep.title}
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </span>
          </div>
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 border border-border rounded-lg bg-background hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
          aria-label="Toggle step selection menu"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {/* Progress line underneath */}
      <div className="h-1 bg-secondary w-full relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
          style={{ width: `${(currentStep / stepsList.length) * 100}%` }}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click blocker backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 top-[110px] bg-black/45 z-40"
            />
            {/* Dropdown list */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 bg-card border-b border-border shadow-xl z-50 max-h-[300px] overflow-y-auto"
            >
              <div className="p-2 space-y-1">
                {stepsList.map((step) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = completedSteps.includes(step.id);

                  return (
                    <button
                      key={step.id}
                      onClick={() => {
                        setCurrentStep(step.id);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-xs transition-colors text-left cursor-pointer",
                        isActive
                          ? "bg-primary/10 text-primary font-bold"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-5 w-5 rounded-full flex items-center justify-center border text-[10px] font-bold shrink-0",
                            isActive
                              ? "bg-primary border-primary text-primary-foreground"
                              : isCompleted
                              ? "bg-accent/15 border-accent text-accent"
                              : "border-border"
                          )}
                        >
                          {isCompleted ? <Check className="h-3 w-3 stroke-[2.5]" /> : step.id}
                        </div>
                        <span className={cn("font-semibold", isActive && "text-foreground")}>
                          {step.title}
                        </span>
                      </div>
                      
                      <span className="text-[10px] text-muted-foreground">
                        {isCompleted ? "Done" : step.id === currentStep ? "Active" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
export default MobileStepper;
