"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { businessIdentitySchema, BusinessIdentityData } from "./formSchemas";

export function BusinessIdentityForm() {
  const updateWebsiteData = useWebsiteBuilderStore((state) => state.updateWebsiteData);
  const setValidationState = useWebsiteBuilderStore((state) => state.setValidationState);
  const stepKey = "businessIdentity";
  const defaultValues = useWebsiteBuilderStore.getState().websiteData[stepKey] || {};

  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useForm<BusinessIdentityData>({
    resolver: zodResolver(businessIdentitySchema),
    defaultValues: {
      brandName: defaultValues.brandName || "",
      agencyName: defaultValues.agencyName || "",
      websiteTitle: defaultValues.websiteTitle || "",
      websiteTagline: defaultValues.websiteTagline || "",
      missionStatement: defaultValues.missionStatement || "",
      visionStatement: defaultValues.visionStatement || "",
      coreValues: defaultValues.coreValues || "",
      personalMotto: defaultValues.personalMotto || "",
      elevatorPitch: defaultValues.elevatorPitch || "",
    },
    mode: "onChange",
  });

  const watchedValues = watch();

  // Keep validation state in sync in real-time
  useEffect(() => {
    setValidationState(2, isValid);
  }, [isValid, setValidationState]);

  // Keep form data in sync with store
  useEffect(() => {
    const subscription = watch((value) => {
      updateWebsiteData(stepKey, value);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateWebsiteData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left text-xs font-semibold">
        {/* Personal Brand Name */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Personal Brand Name *</label>
          <input
            type="text"
            placeholder="e.g. Jane Doe Freelance"
            {...register("brandName")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
          {errors.brandName && <p className="text-[10px] text-destructive mt-0.5">{errors.brandName.message}</p>}
        </div>

        {/* Agency Name */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Agency / Company Name (Optional)</label>
          <input
            type="text"
            placeholder="e.g. Zenith Tech Agency"
            {...register("agencyName")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>

        {/* Website Title */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Website Title *</label>
          <input
            type="text"
            placeholder="e.g. Jane Doe | Lead Frontend Consultant"
            {...register("websiteTitle")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
          {errors.websiteTitle && <p className="text-[10px] text-destructive mt-0.5">{errors.websiteTitle.message}</p>}
        </div>

        {/* Website Tagline */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Website Tagline</label>
          <input
            type="text"
            placeholder="e.g. Scaling web design to meet modern demand"
            {...register("websiteTagline")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>

        {/* Personal Motto */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Personal Motto</label>
          <input
            type="text"
            placeholder="e.g. Less code, more impact"
            {...register("personalMotto")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>

        {/* Mission Statement */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-muted-foreground uppercase text-[10px]">Mission Statement</label>
          <textarea
            placeholder="Describe your professional mission statement..."
            rows={2}
            {...register("missionStatement")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>

        {/* Vision Statement */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-muted-foreground uppercase text-[10px]">Vision Statement</label>
          <textarea
            placeholder="Describe your professional vision for the future..."
            rows={2}
            {...register("visionStatement")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>

        {/* Core Values */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-muted-foreground uppercase text-[10px]">Core Values</label>
          <textarea
            placeholder="e.g. 1. Transparency, 2. Fast Delivery, 3. Quality Workmanship"
            rows={2}
            {...register("coreValues")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>

        {/* Elevator Pitch */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-muted-foreground uppercase text-[10px]">Elevator Pitch</label>
          <textarea
            placeholder="Give a quick 30-second summary pitch of your skills and unique selling propositions..."
            rows={3}
            {...register("elevatorPitch")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>
      </div>
    </div>
  );
}
export default BusinessIdentityForm;
