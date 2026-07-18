"use client";

import { useEffect } from "react";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { WizardHeader } from "./WizardHeader";
import { WizardSidebar } from "./WizardSidebar";
import { DesktopStepper } from "./DesktopStepper";
import { MobileStepper } from "./MobileStepper";
import { WizardNavigation } from "./WizardNavigation";
import { stepsList } from "./stepsConfig";
import { motion, AnimatePresence } from "framer-motion";

interface WizardLayoutProps {
  children: React.ReactNode;
}

export function WizardLayout({ children }: WizardLayoutProps) {
  const { currentStep, setCurrentStep } = useWebsiteBuilderStore();

  // Keyboard navigation event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events if the user is typing in form controls
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.hasAttribute("contenteditable"))
      ) {
        return;
      }

      if (e.key === "ArrowLeft") {
        if (currentStep > 1) {
          setCurrentStep(currentStep - 1);
        }
      } else if (e.key === "ArrowRight") {
        if (currentStep < stepsList.length) {
          setCurrentStep(currentStep + 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, setCurrentStep]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Sticky Top Header */}
      <WizardHeader />

      {/* Steppers */}
      <DesktopStepper />
      <MobileStepper />

      {/* Layout Content Grid */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Side: Vertical Navigation steps */}
        <WizardSidebar />

        {/* Right Side: Scrollable main content pane */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-tr from-background via-card/10 to-background">
          <div className="max-w-4xl mx-auto pb-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Bottom Sticky Action Footer */}
      <WizardNavigation />
    </div>
  );
}
export default WizardLayout;
