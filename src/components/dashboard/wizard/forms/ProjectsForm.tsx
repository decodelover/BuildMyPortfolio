"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { projectsSchema, ProjectsListData, ProjectData } from "./formSchemas";
import { FileUploadProgress } from "./FileUploadProgress";
import { Plus, Trash2, Copy, ChevronUp, ChevronDown, FolderKanban, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ProjectsForm() {
  const updateWebsiteData = useWebsiteBuilderStore((state) => state.updateWebsiteData);
  const setValidationState = useWebsiteBuilderStore((state) => state.setValidationState);
  const stepKey = "projects";
  const defaultValues = useWebsiteBuilderStore.getState().websiteData[stepKey] || { projects: [] };

  const {
    register,
    control,
    watch,
    getValues,
    setValue,
    formState: { errors, isValid },
  } = useForm<ProjectsListData>({
    resolver: zodResolver(projectsSchema),
    defaultValues: {
      projects: defaultValues.projects || [],
    },
    mode: "onChange",
  });

  const { fields, append, remove, move, insert } = useFieldArray({
    control,
    name: "projects",
  });

  const [deletedProject, setDeletedProject] = useState<{ index: number; data: ProjectData } | null>(null);

  const watchedValues = watch();

  // Keep validation state in sync in real-time
  useEffect(() => {
    setValidationState(5, isValid);
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
      name: "",
      summary: "",
      description: "",
      challenge: "",
      solution: "",
      results: "",
      technologies: "",
      githubUrl: "",
      liveUrl: "",
      coverImage: "",
      images: [],
      clientName: "",
      industry: "",
      completionDate: "",
      isFeatured: false,
      teamSize: "",
      role: "",
    });
  };

  const handleDelete = (index: number) => {
    const list = getValues("projects");
    const item = list[index];
    setDeletedProject({ index, data: item });
    remove(index);
    toast("Project deleted", {
      action: {
        label: "Undo",
        onClick: () => {
          setDeletedProject((prev) => {
            if (prev) {
              insert(prev.index, prev.data);
              toast.success("Project deletion undone!");
            }
            return null;
          });
        },
      },
    });
  };

  const handleDuplicate = (index: number) => {
    const list = getValues("projects");
    const item = list[index];
    append({
      ...item,
      name: `${item.name} (Copy)`,
    });
    toast.success("Project duplicated successfully!");
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      move(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    const list = getValues("projects");
    if (index < list.length - 1) {
      move(index, index + 1);
    }
  };

  const handleRemoveGalleryImage = (projectIndex: number, imgIndex: number) => {
    const list = getValues("projects");
    const images = list[projectIndex].images || [];
    const newImages = images.filter((_, idx) => idx !== imgIndex);
    setValue(`projects.${projectIndex}.images`, newImages, { shouldValidate: true });
    toast.info("Gallery image removed.");
  };

  return (
    <div className="space-y-6 text-left text-xs font-semibold">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">Project Catalog</h3>
          <p className="text-[10px] text-muted-foreground font-medium">Add portfolio projects, case studies, or architectural designs you built.</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/95 transition-all shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Project
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center flex flex-col items-center justify-center bg-card/20 space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground border border-border">
            <FolderKanban className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-foreground">No Projects Added Yet</h4>
            <p className="text-[10px] text-muted-foreground max-w-xs leading-relaxed font-medium">
              Click the "Add Project" button to document your professional portfolio, details, cover images and live links.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold hover:bg-muted transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Your First Project
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {fields.map((field, index) => {
            const projectGallery = watchedValues.projects?.[index]?.images || [];

            return (
              <div
                key={field.id}
                className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm relative overflow-hidden group hover:border-primary/25 transition-colors"
              >
                {/* Accordion/Card Header */}
                <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                    Project #{index + 1}
                  </span>

                  {/* Operations Toolbar */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className={cn(
                        "p-1.5 border border-border rounded-lg bg-background hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors",
                        index === 0 && "opacity-35 cursor-not-allowed"
                      )}
                      title="Move Project Up"
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
                      title="Move Project Down"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicate(index)}
                      className="p-1.5 border border-border rounded-lg bg-background hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                      title="Duplicate Project"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="p-1.5 border border-destructive/20 rounded-lg bg-destructive/5 hover:bg-destructive/15 text-destructive cursor-pointer transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Project Name */}
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase text-[9px]">Project Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. AI Portfolio Edge Compiler"
                      {...register(`projects.${index}.name` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                    {errors.projects?.[index]?.name && (
                      <p className="text-[10px] text-destructive mt-0.5">{errors.projects[index].name.message}</p>
                    )}
                  </div>

                  {/* Short Summary */}
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase text-[9px]">Short Summary *</label>
                    <input
                      type="text"
                      placeholder="Provide a quick tagline/catchy overview (max 120 chars)..."
                      {...register(`projects.${index}.summary` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                    {errors.projects?.[index]?.summary && (
                      <p className="text-[10px] text-destructive mt-0.5">{errors.projects[index].summary.message}</p>
                    )}
                  </div>

                  {/* Full Description */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-muted-foreground uppercase text-[9px]">Full Description</label>
                    <textarea
                      placeholder="Explain the project outline, tech features, core objectives, and work process..."
                      rows={3}
                      {...register(`projects.${index}.description` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                  </div>

                  {/* Challenge */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-muted-foreground uppercase text-[9px]">The Challenge</label>
                    <textarea
                      placeholder="What was the problem? What issues did you set out to solve..."
                      rows={2}
                      {...register(`projects.${index}.challenge` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                  </div>

                  {/* Solution */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-muted-foreground uppercase text-[9px]">The Solution</label>
                    <textarea
                      placeholder="How did you solve it? What engineering architectures did you implement..."
                      rows={2}
                      {...register(`projects.${index}.solution` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                  </div>

                  {/* Results */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-muted-foreground uppercase text-[9px]">The Results & Impact</label>
                    <textarea
                      placeholder="What were the outcomes? e.g. Reduced bundle sizes by 40%, loaded pages 2s faster..."
                      rows={2}
                      {...register(`projects.${index}.results` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                  </div>

                  {/* Technologies */}
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase text-[9px]">Technologies (Comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Next.js, WebGL, Node.js, GCP"
                      {...register(`projects.${index}.technologies` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                  </div>

                  {/* GitHub URL */}
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase text-[9px]">GitHub Repository Link</label>
                    <input
                      type="text"
                      placeholder="e.g. https://github.com/username/project"
                      {...register(`projects.${index}.githubUrl` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                    {errors.projects?.[index]?.githubUrl && (
                      <p className="text-[10px] text-destructive mt-0.5">{errors.projects[index].githubUrl.message}</p>
                    )}
                  </div>

                  {/* Live URL */}
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase text-[9px]">Live Website URL</label>
                    <input
                      type="text"
                      placeholder="e.g. https://myproject.com"
                      {...register(`projects.${index}.liveUrl` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                    {errors.projects?.[index]?.liveUrl && (
                      <p className="text-[10px] text-destructive mt-0.5">{errors.projects[index].liveUrl.message}</p>
                    )}
                  </div>

                  {/* Client Name */}
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase text-[9px]">Client Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Google DeepMind / Freelance Client"
                      {...register(`projects.${index}.clientName` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                  </div>

                  {/* Industry */}
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase text-[9px]">Industry</label>
                    <input
                      type="text"
                      placeholder="e.g. FinTech / HealthCare"
                      {...register(`projects.${index}.industry` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                  </div>

                  {/* Completion Date */}
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase text-[9px]">Completion Date</label>
                    <input
                      type="date"
                      {...register(`projects.${index}.completionDate` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                  </div>

                  {/* Team Size */}
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase text-[9px]">Team Size</label>
                    <input
                      type="text"
                      placeholder="e.g. 5 team members"
                      {...register(`projects.${index}.teamSize` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase text-[9px]">Your Role / Capacity</label>
                    <input
                      type="text"
                      placeholder="e.g. Lead Frontend Architect"
                      {...register(`projects.${index}.role` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                  </div>

                  {/* Featured Checkbox */}
                  <div className="flex items-center gap-2 pt-2 md:col-span-2 text-xs text-foreground">
                    <input
                      type="checkbox"
                      id={`projects.${index}.isFeatured`}
                      {...register(`projects.${index}.isFeatured` as const)}
                      className="rounded border-border text-primary focus:ring-1 focus:ring-primary/45 cursor-pointer h-4 w-4"
                    />
                    <label htmlFor={`projects.${index}.isFeatured`} className="cursor-pointer font-bold">
                      Mark as Featured Project (will highlight on showcase banners)
                    </label>
                  </div>
                </div>

                {/* Cover & Gallery Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-border bg-muted/5 p-3 rounded-xl border border-dashed">
                  {/* Cover Image */}
                  <FileUploadProgress
                    label="Project Cover Image Upload"
                    accept="image/*"
                    folder="projects/covers"
                    value={watchedValues.projects?.[index]?.coverImage || ""}
                    onChange={(url) => setValue(`projects.${index}.coverImage`, url, { shouldValidate: true })}
                  />

                  {/* Gallery Multiple Images */}
                  <div className="space-y-2 text-left text-xs font-semibold">
                    <FileUploadProgress
                      label="Add Gallery Image"
                      accept="image/*"
                      folder="projects/gallery"
                      value=""
                      onChange={(url) => {
                        if (url) {
                          const currentImages = watchedValues.projects?.[index]?.images || [];
                          setValue(`projects.${index}.images`, [...currentImages, url], { shouldValidate: true });
                          toast.success("Gallery image added!");
                        }
                      }}
                    />

                    {/* Gallery Thumbnails List */}
                    {projectGallery.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        <label className="text-muted-foreground uppercase text-[9px] block">Uploaded Gallery ({projectGallery.length})</label>
                        <div className="flex flex-wrap gap-2">
                          {projectGallery.map((imgUrl, imgIdx) => (
                            <div key={imgIdx} className="relative h-12 w-16 border border-border rounded overflow-hidden group shadow-sm bg-secondary">
                              <img src={imgUrl} alt={`Gallery ${imgIdx}`} className="h-full w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryImage(index, imgIdx)}
                                className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
export default ProjectsForm;
