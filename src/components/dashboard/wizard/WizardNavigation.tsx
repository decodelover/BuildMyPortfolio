"use client";

import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { stepsList } from "./stepsConfig";
import { ChevronLeft, ChevronRight, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { createWebsiteGenerationPlan } from "@/lib/ai/website-architect";

export function WizardNavigation() {
  const router = useRouter();
  const {
    builderId,
    userId,
    currentStep,
    completedSteps,
    setCurrentStep,
    markStepCompleted,
    markStepIncomplete,
    websiteData,
    loading,
    saveBuilderDraft,
    completeBuilderDraft,
    validationState,
    aiBlueprint,
  } = useWebsiteBuilderStore();

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === stepsList.length;
  const isStepCompleted = completedSteps.includes(currentStep);

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    // Validate current step before moving forward
    const isValid = validationState[currentStep];
    if (isValid === false) {
      toast.error("Please fill out all required fields correctly before moving forward.");
      return;
    }

    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleToggleComplete = () => {
    if (isStepCompleted) {
      markStepIncomplete(currentStep);
      toast.info(`Step ${currentStep} marked as incomplete.`);
    } else {
      markStepCompleted(currentStep);
      toast.success(`Step ${currentStep} marked as completed!`);
    }
  };

  const handleFinalize = async () => {
    if (!userId || !builderId) return;

    // Check if at least some steps are completed
    if (completedSteps.length < 5) {
      toast.warning("We recommend completing more sections before generating your website layout, but you can proceed.");
    }

    toast.info("Scaffolding your portfolio layout and architect plan...", { duration: 3000 });

    try {
      // 1. Force final save of the wizard draft
      await saveBuilderDraft(true);
      await completeBuilderDraft();

      // 2. Generate Website Architect Plan deterministically
      const architectResult = await createWebsiteGenerationPlan({
        builderId,
        userId,
        websiteData,
        aiBlueprint,
      });

      const { planId, validationResult } = architectResult;

      if (!validationResult.isValid) {
        toast.warning(`Architect plan generated with ${validationResult.errors.length} validation issues. Status: draft.`);
      } else if (validationResult.warnings.length > 0) {
        toast.info(`Architect plan generated with ${validationResult.warnings.length} suggestions.`);
      }

      // 3. Add document to Firestore 'portfolios' collection (connecting the wizard result & plan to live portfolios)
      const personalInfo = websiteData.personalInfo || {};
      const portfolioTitle = personalInfo.fullName 
        ? `${personalInfo.fullName}'s Professional Website`
        : "My Professional AI Website";

      await addDoc(collection(db, "portfolios"), {
        userId,
        name: portfolioTitle,
        theme: websiteData.websitePreferences?.theme || "minimalist",
        profession: personalInfo.profession || "Technology Professional",
        status: "draft",
        domain: `${portfolioTitle.toLowerCase().replace(/[^a-z0-9]/g, "")}-${Math.floor(1000 + Math.random() * 9000)}.buildmyportfolio.com`,
        planId, // Attach the newly generated Architect Plan ID!
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        wizardData: websiteData, // Copy wizard details over
      });

      toast.success("AI Developer portfolio and Architect Plan generated successfully!");
      router.push("/dashboard/portfolios");
    } catch (err) {
      console.error("AI Portfolio generation failure:", err);
      toast.error("Unable to generate website layout. Please try again.");
    }
  };

  return (
    <footer className="sticky bottom-0 z-30 border-t border-border bg-background/85 px-4 py-3.5 backdrop-blur-md sm:px-6 flex items-center justify-between">
      {/* Previous Button */}
      <button
        onClick={handlePrev}
        disabled={isFirstStep}
        className={cn(
          "flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer",
          isFirstStep && "opacity-40 cursor-not-allowed"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </button>

      {/* Completion Toggle */}
      <button
        onClick={handleToggleComplete}
        className={cn(
          "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-300 cursor-pointer shadow-sm",
          isStepCompleted
            ? "bg-accent/15 border-accent text-accent hover:bg-accent/25"
            : "bg-background border-border text-muted-foreground hover:border-primary/45 hover:text-foreground"
        )}
      >
        <CheckCircle2 className={cn("h-4.5 w-4.5 transition-transform", isStepCompleted && "scale-110")} />
        <span className="hidden sm:inline">
          {isStepCompleted ? "Completed" : "Mark Step Complete"}
        </span>
        <span className="sm:hidden">
          {isStepCompleted ? "Done" : "Complete"}
        </span>
      </button>

      {/* Next / Finalize Button */}
      {isLastStep ? (
        <button
          onClick={handleFinalize}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] transition-all cursor-pointer"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 text-accent-foreground animate-pulse" />
          )}
          Generate Website
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/95 hover:scale-[1.01] transition-all cursor-pointer"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </footer>
  );
}
export default WizardNavigation;
