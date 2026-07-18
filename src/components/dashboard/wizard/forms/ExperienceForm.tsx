"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { experienceSchema, ExperienceListData, ExperienceItemData } from "./formSchemas";
import { Plus, Trash2, Copy, ChevronUp, ChevronDown, Briefcase, History } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ExperienceForm() {
  const updateWebsiteData = useWebsiteBuilderStore((state) => state.updateWebsiteData);
  const setValidationState = useWebsiteBuilderStore((state) => state.setValidationState);
  const stepKey = "experience";
  const defaultValues = useWebsiteBuilderStore.getState().websiteData[stepKey] || { experience: [] };

  const {
    register,
    control,
    watch,
    getValues,
    setValue,
    formState: { errors, isValid },
  } = useForm<ExperienceListData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      experience: defaultValues.experience || [],
    },
    mode: "onChange",
  });

  const { fields, append, remove, move, insert } = useFieldArray({
    control,
    name: "experience",
  });

  const [deletedExperience, setDeletedExperience] = useState<{ index: number; data: ExperienceItemData } | null>(null);

  const watchedValues = watch();

  // Keep validation state in sync in real-time
  useEffect(() => {
    setValidationState(6, isValid);
  }, [isValid, setValidationState]);

  // Keep form data in sync with store
  useEffect(() => {
    const subscription = watch((value) => {
      updateWebsiteData(stepKey, value);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateWebsiteData]);

  const handleAdd = () => {
    append({
      company: "",
      position: "",
      employmentType: "",
      location: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      responsibilities: "",
      achievements: "",
      technologies: "",
    });
  };

  const handleDelete = (index: number) => {
    const list = getValues("experience");
    const item = list[index];
    setDeletedExperience({ index, data: item });
    remove(index);
    toast("Experience deleted", {
      action: {
        label: "Undo",
        onClick: () => {
          setDeletedExperience((prev) => {
            if (prev) {
              insert(prev.index, prev.data);
              toast.success("Experience deletion undone!");
            }
            return null;
          });
        },
      },
    });
  };

  const handleDuplicate = (index: number) => {
    const list = getValues("experience");
    const item = list[index];
    append({
      ...item,
      company: `${item.company} (Copy)`,
    });
    toast.success("Experience entry duplicated!");
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      move(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    const list = getValues("experience");
    if (index < list.length - 1) {
      move(index, index + 1);
    }
  };

  return (
    <div className="space-y-6 text-left text-xs font-semibold">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">Professional Timeline</h3>
          <p className="text-[10px] text-muted-foreground font-medium">Outline your work history, career roles, and technologies used.</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/95 transition-all shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Experience
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center flex flex-col items-center justify-center bg-card/20 space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground border border-border">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-foreground">No Work History Yet</h4>
            <p className="text-[10px] text-muted-foreground max-w-xs leading-relaxed font-medium">
              Click the "Add Experience" button to list your employment history, client positions, and achievements.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold hover:bg-muted transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Your First Experience
          </button>
        </div>
      ) : (
        <div className="relative pl-6 border-l-2 border-dashed border-border ml-2 space-y-6 pt-2">
          {fields.map((field, index) => {
            const isCurrentlyWorking = watchedValues.experience?.[index]?.currentlyWorking;

            return (
              <div
                key={field.id}
                className="relative rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm group hover:border-primary/25 transition-colors"
              >
                {/* Timeline Bullet Anchor */}
                <div className="absolute -left-[35px] top-7 h-4 w-4 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>

                {/* Operations Toolbar */}
                <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                    Experience #{index + 1}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className={cn(
                        "p-1.5 border border-border rounded-lg bg-background hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors",
                        index === 0 && "opacity-35 cursor-not-allowed"
                      )}
                      title="Move Up"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === fields.length - 1}
                      className={cn(
                        "p-1.5 border border-border rounded-lg bg-background hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors",
                        index === fields.length - 1 && "opacity-35 cursor-not-allowed"
                      )}
                      title="Move Down"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicate(index)}
                      className="p-1.5 border border-border rounded-lg bg-background hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="p-1.5 border border-destructive/20 rounded-lg bg-destructive/5 hover:bg-destructive/15 text-destructive cursor-pointer transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Company Name */}
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase text-[9px]">Company / Organization *</label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Tech Corporation"
                      {...register(`experience.${index}.company` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                    {errors.experience?.[index]?.company && (
                      <p className="text-[10px] text-destructive mt-0.5">{errors.experience[index].company.message}</p>
                    )}
                  </div>

                  {/* Position */}
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase text-[9px]">Position / Role *</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Full-Stack Engineer"
                      {...register(`experience.${index}.position` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                    {errors.experience?.[index]?.position && (
                      <p className="text-[10px] text-destructive mt-0.5">{errors.experience[index].position.message}</p>
                    )}
                  </div>

                  {/* Employment Type */}
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase text-[9px]">Employment Type</label>
                    <select
                      {...register(`experience.${index}.employmentType` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    >
                      <option value="">Select type...</option>
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase text-[9px]">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Remote / New York, NY"
                      {...register(`experience.${index}.location` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                  </div>

                  {/* Start Date */}
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase text-[9px]">Start Date *</label>
                    <input
                      type="date"
                      {...register(`experience.${index}.startDate` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                    {errors.experience?.[index]?.startDate && (
                      <p className="text-[10px] text-destructive mt-0.5">{errors.experience[index].startDate.message}</p>
                    )}
                  </div>

                  {/* End Date */}
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase text-[9px]">End Date</label>
                    <input
                      type="date"
                      disabled={isCurrentlyWorking}
                      {...register(`experience.${index}.endDate` as const)}
                      className={cn(
                        "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45",
                        isCurrentlyWorking && "opacity-40 cursor-not-allowed bg-muted/20"
                      )}
                    />
                  </div>

                  {/* Currently Working Toggle */}
                  <div className="flex items-center gap-2 pt-2 md:col-span-2 text-xs text-foreground">
                    <input
                      type="checkbox"
                      id={`experience.${index}.currentlyWorking`}
                      {...register(`experience.${index}.currentlyWorking` as const)}
                      className="rounded border-border text-primary focus:ring-1 focus:ring-primary/45 cursor-pointer h-4 w-4"
                      onChange={(e) => {
                        setValue(`experience.${index}.currentlyWorking`, e.target.checked, { shouldValidate: true });
                        if (e.target.checked) {
                          setValue(`experience.${index}.endDate`, "");
                        }
                      }}
                    />
                    <label htmlFor={`experience.${index}.currentlyWorking`} className="cursor-pointer font-bold">
                      I am currently working in this role
                    </label>
                  </div>

                  {/* Responsibilities */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-muted-foreground uppercase text-[9px]">Key Responsibilities</label>
                    <textarea
                      placeholder="List your key duties, roles, and day-to-day contributions..."
                      rows={3}
                      {...register(`experience.${index}.responsibilities` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                  </div>

                  {/* Achievements */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-muted-foreground uppercase text-[9px]">Key Achievements & Outcomes</label>
                    <textarea
                      placeholder="Detail quantifiable results (e.g., led team of 4 engineers, deployed 3 core serverless services, sped up pages by 30%)..."
                      rows={2}
                      {...register(`experience.${index}.achievements` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                  </div>

                  {/* Technologies Used */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-muted-foreground uppercase text-[9px]">Technologies Used (Comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. AWS, GraphQL, Docker, Next.js"
                      {...register(`experience.${index}.technologies` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default ExperienceForm;
