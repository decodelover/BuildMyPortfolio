"use client";

import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { stepsList } from "./stepsConfig";
import { HelpCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// Form Components
import { PersonalInfoForm } from "./forms/PersonalInfoForm";
import { BusinessIdentityForm } from "./forms/BusinessIdentityForm";
import { ProfessionalStoryForm } from "./forms/ProfessionalStoryForm";
import { ServicesForm } from "./forms/ServicesForm";
import { ProjectsForm } from "./forms/ProjectsForm";
import { ExperienceForm } from "./forms/ExperienceForm";
import { EducationForm } from "./forms/EducationForm";
import { SkillsForm } from "./forms/SkillsForm";
import { TestimonialsForm } from "./forms/TestimonialsForm";
import { SocialLinksForm } from "./forms/SocialLinksForm";
import { WebsitePreferencesForm } from "./forms/WebsitePreferencesForm";
import { ExtraPagesForm } from "./forms/ExtraPagesForm";
import { SEOInfoForm } from "./forms/SEOInfoForm";
import { WebsiteReviewForm } from "./forms/WebsiteReviewForm";

interface StepCardProps {
  stepId: number;
}

export function StepCard({ stepId }: StepCardProps) {
  const step = stepsList.find((s) => s.id === stepId) || stepsList[0];
  const Icon = step.icon;

  const renderStepForm = () => {
    switch (stepId) {
      case 1:
        return <PersonalInfoForm />;
      case 2:
        return <BusinessIdentityForm />;
      case 3:
        return <ProfessionalStoryForm />;
      case 4:
        return <ServicesForm />;
      case 5:
        return <ProjectsForm />;
      case 6:
        return <ExperienceForm />;
      case 7:
        return <EducationForm />;
      case 8:
        return <SkillsForm />;
      case 9:
        return <TestimonialsForm />;
      case 10:
        return <SocialLinksForm />;
      case 11:
        return <WebsitePreferencesForm />;
      case 12:
        return <ExtraPagesForm />;
      case 13:
        return <SEOInfoForm />;
      case 14:
        return <WebsiteReviewForm />;
      default:
        return <PersonalInfoForm />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Header Block */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
              <Icon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                Step {step.id} of {stepsList.length}
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                {step.title}
              </h2>
              <p className="text-xs text-muted-foreground font-medium max-w-xl">
                {step.details}
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-xl border border-border">
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
            <span>AI Builder Input</span>
          </div>
        </div>

        {/* Mounted Form Element Area */}
        <div className="mt-8 border-t border-border pt-6">
          {renderStepForm()}
        </div>
      </div>
    </div>
  );
}
export default StepCard;
