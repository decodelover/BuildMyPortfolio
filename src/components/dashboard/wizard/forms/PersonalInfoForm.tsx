"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { personalInfoSchema, PersonalInfoData } from "./formSchemas";
import { FileUploadProgress } from "./FileUploadProgress";

export function PersonalInfoForm() {
  const updateWebsiteData = useWebsiteBuilderStore((state) => state.updateWebsiteData);
  const setValidationState = useWebsiteBuilderStore((state) => state.setValidationState);
  const stepKey = "personalInfo";
  const defaultValues = useWebsiteBuilderStore.getState().websiteData[stepKey] || {};

  const {
    register,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: defaultValues.fullName || "",
      headline: defaultValues.headline || "",
      profession: defaultValues.profession || "",
      specialization: defaultValues.specialization || "",
      country: defaultValues.country || "",
      state: defaultValues.state || "",
      city: defaultValues.city || "",
      timezone: defaultValues.timezone || "",
      yearsOfExperience: defaultValues.yearsOfExperience || "",
      currentCompany: defaultValues.currentCompany || "",
      employmentStatus: defaultValues.employmentStatus || "",
      availability: defaultValues.availability || "",
      spokenLanguages: defaultValues.spokenLanguages || "",
      email: defaultValues.email || "",
      phone: defaultValues.phone || "",
      whatsapp: defaultValues.whatsapp || "",
      photoUrl: defaultValues.photoUrl || "",
      resumeUrl: defaultValues.resumeUrl || "",
    },
    mode: "onChange",
  });

  const watchedValues = watch();

  // Keep validation state in sync in real-time
  useEffect(() => {
    setValidationState(1, isValid);
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
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Full Name *</label>
          <input
            type="text"
            placeholder="e.g. Jane Doe"
            {...register("fullName")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
          {errors.fullName && <p className="text-[10px] text-destructive mt-0.5">{errors.fullName.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Email Address *</label>
          <input
            type="email"
            placeholder="e.g. janedoe@example.com"
            {...register("email")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
          {errors.email && <p className="text-[10px] text-destructive mt-0.5">{errors.email.message}</p>}
        </div>

        {/* Profession */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Profession *</label>
          <input
            type="text"
            placeholder="e.g. Full-Stack Developer"
            {...register("profession")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
          {errors.profession && <p className="text-[10px] text-destructive mt-0.5">{errors.profession.message}</p>}
        </div>

        {/* Professional Headline */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Professional Headline *</label>
          <input
            type="text"
            placeholder="e.g. Crafting scalable cloud architectures and interactive web designs"
            {...register("headline")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
          {errors.headline && <p className="text-[10px] text-destructive mt-0.5">{errors.headline.message}</p>}
        </div>

        {/* Specialization */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Specialization</label>
          <input
            type="text"
            placeholder="e.g. Cloud Security & UI/UX"
            {...register("specialization")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>

        {/* Years of Experience */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Years of Experience</label>
          <input
            type="text"
            placeholder="e.g. 5"
            {...register("yearsOfExperience")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>

        {/* Country */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Country *</label>
          <input
            type="text"
            placeholder="e.g. United States"
            {...register("country")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
          {errors.country && <p className="text-[10px] text-destructive mt-0.5">{errors.country.message}</p>}
        </div>

        {/* State / Province */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">State / Province</label>
          <input
            type="text"
            placeholder="e.g. California"
            {...register("state")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>

        {/* City */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">City</label>
          <input
            type="text"
            placeholder="e.g. San Francisco"
            {...register("city")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>

        {/* Timezone */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Timezone</label>
          <input
            type="text"
            placeholder="e.g. GMT-7 (PDT)"
            {...register("timezone")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>

        {/* Current Company */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Current Company</label>
          <input
            type="text"
            placeholder="e.g. Tech Solutions Inc."
            {...register("currentCompany")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>

        {/* Employment Status */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Employment Status</label>
          <select
            {...register("employmentStatus")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          >
            <option value="">Select status...</option>
            <option value="Freelancer">Freelancer</option>
            <option value="Full-Time Employed">Full-Time Employed</option>
            <option value="Contractor">Contractor</option>
            <option value="Open to Work">Open to Work</option>
          </select>
        </div>

        {/* Availability */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Availability</label>
          <select
            {...register("availability")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          >
            <option value="">Select availability...</option>
            <option value="Immediate starting">Immediate starting</option>
            <option value="2 Weeks notice">2 Weeks notice</option>
            <option value="Part-time only">Part-time only</option>
            <option value="Not looking">Not looking</option>
          </select>
        </div>

        {/* Spoken Languages */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Spoken Languages</label>
          <input
            type="text"
            placeholder="e.g. English (Fluent), Spanish (Conversational)"
            {...register("spokenLanguages")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Phone Number</label>
          <input
            type="tel"
            placeholder="e.g. +1 555-0199"
            {...register("phone")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>

        {/* WhatsApp */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">WhatsApp Chat Link</label>
          <input
            type="text"
            placeholder="e.g. https://wa.me/15550199"
            {...register("whatsapp")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>
      </div>

      {/* File Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-border">
        {/* Profile Photo */}
        <FileUploadProgress
          label="Profile Photo Upload"
          accept="image/*"
          folder="photos"
          value={watchedValues.photoUrl || ""}
          onChange={(url) => setValue("photoUrl", url, { shouldValidate: true })}
        />

        {/* Resume PDF */}
        <FileUploadProgress
          label="Resume PDF Upload"
          accept=".pdf"
          folder="resumes"
          value={watchedValues.resumeUrl || ""}
          onChange={(url) => setValue("resumeUrl", url, { shouldValidate: true })}
        />
      </div>
    </div>
  );
}
export default PersonalInfoForm;
