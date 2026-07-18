"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { servicesSchema, ServicesListData, ServiceData } from "./formSchemas";
import { Plus, Trash2, Copy, ChevronUp, ChevronDown, Sparkles, Undo } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ServicesForm() {
  const updateWebsiteData = useWebsiteBuilderStore((state) => state.updateWebsiteData);
  const setValidationState = useWebsiteBuilderStore((state) => state.setValidationState);
  const stepKey = "services";
  const defaultValues = useWebsiteBuilderStore.getState().websiteData[stepKey] || { services: [] };

  const {
    register,
    control,
    watch,
    getValues,
    setValue,
    formState: { errors, isValid },
  } = useForm<ServicesListData>({
    resolver: zodResolver(servicesSchema),
    defaultValues: {
      services: defaultValues.services || [],
    },
    mode: "onChange",
  });

  const { fields, append, remove, move, insert } = useFieldArray({
    control,
    name: "services",
  });

  const [deletedService, setDeletedService] = useState<{ index: number; data: ServiceData } | null>(null);

  const watchedValues = watch();

  // Keep validation state in sync in real-time
  useEffect(() => {
    // If list is empty, let it be valid (it's optional to add services, but if added, they must validate)
    setValidationState(4, isValid);
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
      category: "",
      shortDesc: "",
      detailedDesc: "",
      deliverables: "",
      timeline: "",
      startingPrice: "",
      technologies: "",
      isFeatured: false,
    });
  };

  const handleDelete = (index: number) => {
    const list = getValues("services");
    const item = list[index];
    setDeletedService({ index, data: item });
    remove(index);
    toast("Service deleted", {
      action: {
        label: "Undo",
        onClick: () => {
          setDeletedService((prev) => {
            if (prev) {
              insert(prev.index, prev.data);
              toast.success("Service deletion undone!");
            }
            return null;
          });
        },
      },
    });
  };

  const handleDuplicate = (index: number) => {
    const list = getValues("services");
    const item = list[index];
    append({
      ...item,
      name: `${item.name} (Copy)`,
    });
    toast.success("Service duplicated successfully!");
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      move(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    const list = getValues("services");
    if (index < list.length - 1) {
      move(index, index + 1);
    }
  };

  return (
    <div className="space-y-6 text-left text-xs font-semibold">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">Service Listings</h3>
          <p className="text-[10px] text-muted-foreground font-medium">List all the freelancing, design or consulting offerings you provide.</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/95 transition-all shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center flex flex-col items-center justify-center bg-card/20 space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground border border-border">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-foreground">No Services Listed Yet</h4>
            <p className="text-[10px] text-muted-foreground max-w-xs leading-relaxed font-medium">
              Click the "Add Service" button to showcase the services, consulting plans, or freelance packages you offer.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold hover:bg-muted transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Your First Service
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm relative overflow-hidden group hover:border-primary/25 transition-colors"
            >
              {/* Accordion/Card Header */}
              <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                  Service #{index + 1}
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
                    title="Move Service Up"
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
                    title="Move Service Down"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicate(index)}
                    className="p-1.5 border border-border rounded-lg bg-background hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Duplicate Service"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    className="p-1.5 border border-destructive/20 rounded-lg bg-destructive/5 hover:bg-destructive/15 text-destructive cursor-pointer transition-colors"
                    title="Delete Service"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Service Input Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Service Name */}
                <div className="space-y-1.5">
                  <label className="text-muted-foreground uppercase text-[9px]">Service Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Next.js SaaS Web Development"
                    {...register(`services.${index}.name` as const)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                  />
                  {errors.services?.[index]?.name && (
                    <p className="text-[10px] text-destructive mt-0.5">{errors.services[index].name.message}</p>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-muted-foreground uppercase text-[9px]">Service Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Web Engineering / Cloud Consulting"
                    {...register(`services.${index}.category` as const)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                  />
                </div>

                {/* Short Description */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-muted-foreground uppercase text-[9px]">Short Description *</label>
                  <input
                    type="text"
                    placeholder="Provide a quick tagline/summary describing what you deliver (max 100 characters)..."
                    {...register(`services.${index}.shortDesc` as const)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                  />
                  {errors.services?.[index]?.shortDesc && (
                    <p className="text-[10px] text-destructive mt-0.5">{errors.services[index].shortDesc.message}</p>
                  )}
                </div>

                {/* Detailed Description */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-muted-foreground uppercase text-[9px]">Detailed Description</label>
                  <textarea
                    placeholder="Provide a full paragraph breakdown of how you deliver this service, standard deliverables, and the work cycle..."
                    rows={3}
                    {...register(`services.${index}.detailedDesc` as const)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                  />
                </div>

                {/* Deliverables */}
                <div className="space-y-1.5">
                  <label className="text-muted-foreground uppercase text-[9px]">Key Deliverables</label>
                  <input
                    type="text"
                    placeholder="e.g. Full source code, Vercel staging deployment, Figma designs"
                    {...register(`services.${index}.deliverables` as const)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                  />
                </div>

                {/* Estimated Timeline */}
                <div className="space-y-1.5">
                  <label className="text-muted-foreground uppercase text-[9px]">Estimated Timeline</label>
                  <input
                    type="text"
                    placeholder="e.g. 2-4 weeks / 5 business days"
                    {...register(`services.${index}.timeline` as const)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                  />
                </div>

                {/* Starting Price */}
                <div className="space-y-1.5">
                  <label className="text-muted-foreground uppercase text-[9px]">Starting Price (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. $1,500 / $50 per hour"
                    {...register(`services.${index}.startingPrice` as const)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                  />
                </div>

                {/* Technologies Used */}
                <div className="space-y-1.5">
                  <label className="text-muted-foreground uppercase text-[9px]">Technologies Used</label>
                  <input
                    type="text"
                    placeholder="e.g. Next.js, Stripe, PostgreSQL"
                    {...register(`services.${index}.technologies` as const)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                  />
                </div>

                {/* Featured Service */}
                <div className="flex items-center gap-2 pt-2 md:col-span-2 text-xs text-foreground">
                  <input
                    type="checkbox"
                    id={`services.${index}.isFeatured`}
                    {...register(`services.${index}.isFeatured` as const)}
                    className="rounded border-border text-primary focus:ring-1 focus:ring-primary/45 cursor-pointer h-4 w-4"
                  />
                  <label htmlFor={`services.${index}.isFeatured`} className="cursor-pointer font-bold">
                    Mark as Featured Service (prominently showcase on landing page grids)
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default ServicesForm;
