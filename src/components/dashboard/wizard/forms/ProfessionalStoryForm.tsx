"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { professionalStorySchema, ProfessionalStoryData } from "./formSchemas";

export function ProfessionalStoryForm() {
  const updateWebsiteData = useWebsiteBuilderStore((state) => state.updateWebsiteData);
  const setValidationState = useWebsiteBuilderStore((state) => state.setValidationState);
  const stepKey = "professionalStory";
  const defaultValues = useWebsiteBuilderStore.getState().websiteData[stepKey] || {};

  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useForm<ProfessionalStoryData>({
    resolver: zodResolver(professionalStorySchema),
    defaultValues: {
      aboutMe: defaultValues.aboutMe || "",
      journey: defaultValues.journey || "",
      careerStory: defaultValues.careerStory || "",
      passion: defaultValues.passion || "",
      strengths: defaultValues.strengths || "",
      philosophy: defaultValues.philosophy || "",
      goals: defaultValues.goals || "",
      funFacts: defaultValues.funFacts || "",
    },
    mode: "onChange",
  });

  const watchedValues = watch();

  // Keep validation state in sync in real-time
  useEffect(() => {
    setValidationState(3, isValid);
  }, [isValid, setValidationState]);

  // Keep form data in sync with store
  useEffect(() => {
    const subscription = watch((value) => {
      updateWebsiteData(stepKey, value);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateWebsiteData]);

  // Helper to count characters
  const getCharCount = (text = "") => text.length;

  return (
    <div className="space-y-6 text-left text-xs font-semibold">
      {/* About Me */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-muted-foreground uppercase text-[10px]">About Me *</label>
          <span className="text-[10px] text-muted-foreground font-mono">
            {getCharCount(watchedValues.aboutMe)} chars
          </span>
        </div>
        <textarea
          placeholder="Write a concise overview of your background, experience, and what you bring to the table (required, min 10 chars)..."
          rows={4}
          {...register("aboutMe")}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
        />
        {errors.aboutMe && <p className="text-[10px] text-destructive mt-0.5">{errors.aboutMe.message}</p>}
      </div>

      {/* Professional Journey */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-muted-foreground uppercase text-[10px]">Professional Journey</label>
          <span className="text-[10px] text-muted-foreground font-mono">
            {getCharCount(watchedValues.journey)} chars
          </span>
        </div>
        <textarea
          placeholder="Describe your career path, significant moments, and how you got to where you are today..."
          rows={3}
          {...register("journey")}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
        />
      </div>

      {/* Career Story */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-muted-foreground uppercase text-[10px]">Career Story</label>
          <span className="text-[10px] text-muted-foreground font-mono">
            {getCharCount(watchedValues.careerStory)} chars
          </span>
        </div>
        <textarea
          placeholder="Provide a deeper, story-driven perspective on your career evolution..."
          rows={3}
          {...register("careerStory")}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
        />
      </div>

      {/* Passion */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-muted-foreground uppercase text-[10px]">Passion & Motivation</label>
          <span className="text-[10px] text-muted-foreground font-mono">
            {getCharCount(watchedValues.passion)} chars
          </span>
        </div>
        <textarea
          placeholder="What drives you? What aspects of your work keep you motivated..."
          rows={2}
          {...register("passion")}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
        />
      </div>

      {/* Strengths */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-muted-foreground uppercase text-[10px]">Core Strengths</label>
          <span className="text-[10px] text-muted-foreground font-mono">
            {getCharCount(watchedValues.strengths)} chars
          </span>
        </div>
        <textarea
          placeholder="List your key architectural or soft skill strengths (e.g. system design, team management, detail-oriented design)..."
          rows={2}
          {...register("strengths")}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
        />
      </div>

      {/* Work Philosophy */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-muted-foreground uppercase text-[10px]">Work Philosophy</label>
          <span className="text-[10px] text-muted-foreground font-mono">
            {getCharCount(watchedValues.philosophy)} chars
          </span>
        </div>
        <textarea
          placeholder="Explain your approach to problem solving, clean code, and working with stakeholders..."
          rows={2}
          {...register("philosophy")}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
        />
      </div>

      {/* Career Goals */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-muted-foreground uppercase text-[10px]">Career Goals</label>
          <span className="text-[10px] text-muted-foreground font-mono">
            {getCharCount(watchedValues.goals)} chars
          </span>
        </div>
        <textarea
          placeholder="Where do you see yourself in the next 3-5 years? (e.g. leading teams, mastering web3 architectures)..."
          rows={2}
          {...register("goals")}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
        />
      </div>

      {/* Fun Facts */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-muted-foreground uppercase text-[10px]">Fun Facts (Optional)</label>
          <span className="text-[10px] text-muted-foreground font-mono">
            {getCharCount(watchedValues.funFacts)} chars
          </span>
        </div>
        <textarea
          placeholder="Tell visitors some interesting personal details (e.g. coffee enthusiast, marathon runner, open source contributor)..."
          rows={2}
          {...register("funFacts")}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          aria-describedby="fun-facts-desc"
        />
      </div>
    </div>
  );
}
export default ProfessionalStoryForm;
