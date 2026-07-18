"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { testimonialsSchema, TestimonialsListData, TestimonialItemData } from "./formSchemas";
import { FileUploadProgress } from "./FileUploadProgress";
import { Plus, Trash2, Copy, ChevronUp, ChevronDown, MessageSquare, Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function TestimonialsForm() {
  const updateWebsiteData = useWebsiteBuilderStore((state) => state.updateWebsiteData);
  const setValidationState = useWebsiteBuilderStore((state) => state.setValidationState);
  const stepKey = "testimonials";
  const defaultValues = useWebsiteBuilderStore.getState().websiteData[stepKey] || { testimonials: [] };

  const {
    register,
    control,
    watch,
    getValues,
    setValue,
    formState: { errors, isValid },
  } = useForm<TestimonialsListData>({
    resolver: zodResolver(testimonialsSchema),
    defaultValues: {
      testimonials: defaultValues.testimonials || [],
    },
    mode: "onChange",
  });

  const { fields, append, remove, move, insert } = useFieldArray({
    control,
    name: "testimonials",
  });

  const [deletedTestimonial, setDeletedTestimonial] = useState<{ index: number; data: TestimonialItemData } | null>(null);

  const watchedValues = watch();

  // Keep validation state in sync in real-time
  useEffect(() => {
    setValidationState(9, isValid);
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
      clientName: "",
      company: "",
      position: "",
      review: "",
      rating: 5,
      photoUrl: "",
    });
  };

  const handleDelete = (index: number) => {
    const list = getValues("testimonials");
    const item = list[index];
    setDeletedTestimonial({ index, data: item });
    remove(index);
    toast("Testimonial deleted", {
      action: {
        label: "Undo",
        onClick: () => {
          setDeletedTestimonial((prev) => {
            if (prev) {
              insert(prev.index, prev.data);
              toast.success("Testimonial deletion undone!");
            }
            return null;
          });
        },
      },
    });
  };

  const handleDuplicate = (index: number) => {
    const list = getValues("testimonials");
    const item = list[index];
    append({
      ...item,
      clientName: `${item.clientName} (Copy)`,
    });
    toast.success("Testimonial duplicated!");
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      move(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    const list = getValues("testimonials");
    if (index < list.length - 1) {
      move(index, index + 1);
    }
  };

  return (
    <div className="space-y-6 text-left text-xs font-semibold">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">Client Testimonials</h3>
          <p className="text-[10px] text-muted-foreground font-medium">Add reviews, endorsements or references from clients and team leaders.</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/95 transition-all shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Testimonial
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center flex flex-col items-center justify-center bg-card/20 space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground border border-border">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-foreground">No Testimonials Added</h4>
            <p className="text-[10px] text-muted-foreground max-w-xs leading-relaxed font-medium">
              Click "Add Testimonial" to enter client reviews, professional feedback, stars, and client photos.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold hover:bg-muted transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Your First Testimonial
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {fields.map((field, index) => {
            const currentRating = watchedValues.testimonials?.[index]?.rating || 5;

            return (
              <div
                key={field.id}
                className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm relative overflow-hidden group hover:border-primary/25 transition-colors"
              >
                {/* Operations Toolbar */}
                <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                    Testimonial #{index + 1}
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

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Client Name */}
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase text-[9px]">Client Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      {...register(`testimonials.${index}.clientName` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                    {errors.testimonials?.[index]?.clientName && (
                      <p className="text-[10px] text-destructive mt-0.5">{errors.testimonials[index].clientName.message}</p>
                    )}
                  </div>

                  {/* Rating star select */}
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase text-[9px]">Rating *</label>
                    <div className="flex items-center gap-1 py-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setValue(`testimonials.${index}.rating`, star, { shouldValidate: true })}
                          className="focus:outline-none cursor-pointer p-0.5 group"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star
                            className={cn(
                              "h-5 w-5 transition-colors",
                              star <= currentRating
                                ? "text-amber-400 fill-amber-400"
                                : "text-border hover:text-amber-200"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Company */}
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase text-[9px]">Company / Organization</label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Tech Solutions"
                      {...register(`testimonials.${index}.company` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                  </div>

                  {/* Position */}
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground uppercase text-[9px]">Position / Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Director of Engineering / Project Manager"
                      {...register(`testimonials.${index}.position` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                  </div>

                  {/* Review Text */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-muted-foreground uppercase text-[9px]">Review / Feedback *</label>
                    <textarea
                      placeholder="Paste the recommendation or feedback statement..."
                      rows={3}
                      {...register(`testimonials.${index}.review` as const)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                    {errors.testimonials?.[index]?.review && (
                      <p className="text-[10px] text-destructive mt-0.5">{errors.testimonials[index].review.message}</p>
                    )}
                  </div>
                </div>

                {/* Photo Upload Area */}
                <div className="pt-3 border-t border-border">
                  <FileUploadProgress
                    label="Client Profile Picture Upload"
                    accept="image/*"
                    folder="testimonials/clients"
                    value={watchedValues.testimonials?.[index]?.photoUrl || ""}
                    onChange={(url) => setValue(`testimonials.${index}.photoUrl`, url, { shouldValidate: true })}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default TestimonialsForm;
