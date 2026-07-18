"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { educationSchema, EducationListData } from "./formSchemas";
import { FileUploadProgress } from "./FileUploadProgress";
import { Plus, Trash2, GraduationCap, Award, BadgeCheck, BookOpen, Users, Compass } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type SubSection = "education" | "certifications" | "awards" | "bootcamps" | "courses" | "memberships";

export function EducationForm() {
  const updateWebsiteData = useWebsiteBuilderStore((state) => state.updateWebsiteData);
  const setValidationState = useWebsiteBuilderStore((state) => state.setValidationState);
  const stepKey = "education";
  const defaultValues = useWebsiteBuilderStore.getState().websiteData[stepKey] || {
    education: [],
    certifications: [],
    awards: [],
    bootcamps: [],
    courses: [],
    memberships: [],
  };

  const [activeTab, setActiveTab] = useState<SubSection>("education");

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<EducationListData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education: defaultValues.education || [],
      certifications: defaultValues.certifications || [],
      awards: defaultValues.awards || [],
      bootcamps: defaultValues.bootcamps || [],
      courses: defaultValues.courses || [],
      memberships: defaultValues.memberships || [],
    },
    mode: "onChange",
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control,
    name: "education",
  });

  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({
    control,
    name: "certifications",
  });

  const { fields: awardFields, append: appendAward, remove: removeAward } = useFieldArray({
    control,
    name: "awards",
  });

  const { fields: bootcampFields, append: appendBootcamp, remove: removeBootcamp } = useFieldArray({
    control,
    name: "bootcamps",
  });

  const { fields: courseFields, append: appendCourse, remove: removeCourse } = useFieldArray({
    control,
    name: "courses",
  });

  const { fields: membershipFields, append: appendMembership, remove: removeMembership } = useFieldArray({
    control,
    name: "memberships",
  });

  const watchedValues = watch();

  // Keep validation state in sync in real-time
  useEffect(() => {
    setValidationState(7, isValid);
  }, [isValid, setValidationState]);

  // Keep form data in sync with store
  useEffect(() => {
    const subscription = watch((value) => {
      updateWebsiteData(stepKey, value);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateWebsiteData]);

  const tabs: { key: SubSection; label: string; icon: any }[] = [
    { key: "education", label: "Academics", icon: GraduationCap },
    { key: "certifications", label: "Certifications", icon: BadgeCheck },
    { key: "awards", label: "Honors & Awards", icon: Award },
    { key: "bootcamps", label: "Bootcamps", icon: Compass },
    { key: "courses", label: "Courses", icon: BookOpen },
    { key: "memberships", label: "Memberships", icon: Users },
  ];

  return (
    <div className="space-y-6 text-left text-xs font-semibold">
      {/* Category Tabs Header */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          const count = watchedValues[t.key]?.length || 0;

          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-xs transition-all cursor-pointer font-bold border",
                isActive
                  ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/10"
                  : "bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{t.label}</span>
              {count > 0 && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[9px] font-mono leading-none",
                    isActive ? "bg-white text-primary" : "bg-muted-foreground/15 text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="pt-2">
        {/* Education (Academics) */}
        {activeTab === "education" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <h4 className="text-sm font-bold text-foreground">Academic History</h4>
              <button
                type="button"
                onClick={() => appendEdu({ school: "", degree: "", field: "", graduationDate: "" })}
                className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-lg px-2.5 py-1.5 text-xs font-bold hover:bg-secondary/85 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Academic Degree
              </button>
            </div>

            {eduFields.length === 0 ? (
              <p className="text-muted-foreground text-[10px] text-center py-6 font-medium">No degrees added. Click the button to add one.</p>
            ) : (
              <div className="space-y-4">
                {eduFields.map((field, index) => (
                  <div key={field.id} className="rounded-xl border border-border bg-card p-4 space-y-3 relative shadow-sm">
                    <button
                      type="button"
                      onClick={() => removeEdu(index)}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-muted-foreground uppercase text-[9px]">School / University *</label>
                        <input
                          type="text"
                          placeholder="e.g. Stanford University"
                          {...register(`education.${index}.school` as const)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                        />
                        {errors.education?.[index]?.school && (
                          <p className="text-[10px] text-destructive mt-0.5">{errors.education[index].school.message}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-muted-foreground uppercase text-[9px]">Degree / Major *</label>
                        <input
                          type="text"
                          placeholder="e.g. Bachelor of Science"
                          {...register(`education.${index}.degree` as const)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                        />
                        {errors.education?.[index]?.degree && (
                          <p className="text-[10px] text-destructive mt-0.5">{errors.education[index].degree.message}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-muted-foreground uppercase text-[9px]">Field of Study</label>
                        <input
                          type="text"
                          placeholder="e.g. Computer Science"
                          {...register(`education.${index}.field` as const)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-muted-foreground uppercase text-[9px]">Graduation Date</label>
                        <input
                          type="date"
                          {...register(`education.${index}.graduationDate` as const)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Certifications */}
        {activeTab === "certifications" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <h4 className="text-sm font-bold text-foreground">Certifications & Licensing</h4>
              <button
                type="button"
                onClick={() => appendCert({ name: "", issuer: "", date: "", url: "", certificatePdfUrl: "" })}
                className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-lg px-2.5 py-1.5 text-xs font-bold hover:bg-secondary/85 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Certification
              </button>
            </div>

            {certFields.length === 0 ? (
              <p className="text-muted-foreground text-[10px] text-center py-6 font-medium">No certifications listed. Click add to document one.</p>
            ) : (
              <div className="space-y-4">
                {certFields.map((field, index) => (
                  <div key={field.id} className="rounded-xl border border-border bg-card p-4 space-y-4 relative shadow-sm">
                    <button
                      type="button"
                      onClick={() => removeCert(index)}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-muted-foreground uppercase text-[9px]">Certification Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. AWS Certified Solutions Architect"
                          {...register(`certifications.${index}.name` as const)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                        />
                        {errors.certifications?.[index]?.name && (
                          <p className="text-[10px] text-destructive mt-0.5">{errors.certifications[index].name.message}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-muted-foreground uppercase text-[9px]">Issuing Organization *</label>
                        <input
                          type="text"
                          placeholder="e.g. Amazon Web Services (AWS)"
                          {...register(`certifications.${index}.issuer` as const)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                        />
                        {errors.certifications?.[index]?.issuer && (
                          <p className="text-[10px] text-destructive mt-0.5">{errors.certifications[index].issuer.message}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-muted-foreground uppercase text-[9px]">Issue Date</label>
                        <input
                          type="date"
                          {...register(`certifications.${index}.date` as const)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-muted-foreground uppercase text-[9px]">Verification URL</label>
                        <input
                          type="text"
                          placeholder="e.g. https://credly.com/verify/abc"
                          {...register(`certifications.${index}.url` as const)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                        />
                        {errors.certifications?.[index]?.url && (
                          <p className="text-[10px] text-destructive mt-0.5">{errors.certifications[index].url.message}</p>
                        )}
                      </div>
                    </div>
                    {/* PDF upload field */}
                    <div className="pt-2 border-t border-border">
                      <FileUploadProgress
                        label="Upload Certificate Copy (PDF or Image)"
                        accept=".pdf,image/*"
                        folder="education/certificates"
                        value={watchedValues.certifications?.[index]?.certificatePdfUrl || ""}
                        onChange={(url) => setValue(`certifications.${index}.certificatePdfUrl`, url, { shouldValidate: true })}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Awards */}
        {activeTab === "awards" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <h4 className="text-sm font-bold text-foreground">Awards & Honors</h4>
              <button
                type="button"
                onClick={() => appendAward({ title: "", organization: "", date: "" })}
                className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-lg px-2.5 py-1.5 text-xs font-bold hover:bg-secondary/85 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Award
              </button>
            </div>

            {awardFields.length === 0 ? (
              <p className="text-muted-foreground text-[10px] text-center py-6 font-medium">No awards added. Click add to showcase any professional honors.</p>
            ) : (
              <div className="space-y-4">
                {awardFields.map((field, index) => (
                  <div key={field.id} className="rounded-xl border border-border bg-card p-4 space-y-3 relative shadow-sm">
                    <button
                      type="button"
                      onClick={() => removeAward(index)}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-muted-foreground uppercase text-[9px]">Award Title *</label>
                        <input
                          type="text"
                          placeholder="e.g. Employee of the Year / Hackathon 1st Place"
                          {...register(`awards.${index}.title` as const)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                        />
                        {errors.awards?.[index]?.title && (
                          <p className="text-[10px] text-destructive mt-0.5">{errors.awards[index].title.message}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-muted-foreground uppercase text-[9px]">Issuing Organization</label>
                        <input
                          type="text"
                          placeholder="e.g. Acme Tech Inc."
                          {...register(`awards.${index}.organization` as const)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-muted-foreground uppercase text-[9px]">Date Received</label>
                        <input
                          type="date"
                          {...register(`awards.${index}.date` as const)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bootcamps */}
        {activeTab === "bootcamps" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <h4 className="text-sm font-bold text-foreground">Bootcamp Programs</h4>
              <button
                type="button"
                onClick={() => appendBootcamp({ name: "", provider: "", date: "" })}
                className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-lg px-2.5 py-1.5 text-xs font-bold hover:bg-secondary/85 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Bootcamp
              </button>
            </div>

            {bootcampFields.length === 0 ? (
              <p className="text-muted-foreground text-[10px] text-center py-6 font-medium">No bootcamp entries. Add intensive learning programs here.</p>
            ) : (
              <div className="space-y-4">
                {bootcampFields.map((field, index) => (
                  <div key={field.id} className="rounded-xl border border-border bg-card p-4 space-y-3 relative shadow-sm">
                    <button
                      type="button"
                      onClick={() => removeBootcamp(index)}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-muted-foreground uppercase text-[9px]">Program Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. 12-Week Immersive Software Engineering Bootcamp"
                          {...register(`bootcamps.${index}.name` as const)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                        />
                        {errors.bootcamps?.[index]?.name && (
                          <p className="text-[10px] text-destructive mt-0.5">{errors.bootcamps[index].name.message}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-muted-foreground uppercase text-[9px]">Provider / Institution</label>
                        <input
                          type="text"
                          placeholder="e.g. General Assembly / Y-Combinator"
                          {...register(`bootcamps.${index}.provider` as const)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-muted-foreground uppercase text-[9px]">Completion Date</label>
                        <input
                          type="date"
                          {...register(`bootcamps.${index}.date` as const)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Courses */}
        {activeTab === "courses" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <h4 className="text-sm font-bold text-foreground">Continuous Courses</h4>
              <button
                type="button"
                onClick={() => appendCourse({ name: "", provider: "" })}
                className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-lg px-2.5 py-1.5 text-xs font-bold hover:bg-secondary/85 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Course
              </button>
            </div>

            {courseFields.length === 0 ? (
              <p className="text-muted-foreground text-[10px] text-center py-6 font-medium">No courses listed. Add online courses or specific class units.</p>
            ) : (
              <div className="space-y-4">
                {courseFields.map((field, index) => (
                  <div key={field.id} className="rounded-xl border border-border bg-card p-4 space-y-3 relative shadow-sm">
                    <button
                      type="button"
                      onClick={() => removeCourse(index)}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-muted-foreground uppercase text-[9px]">Course Title *</label>
                        <input
                          type="text"
                          placeholder="e.g. Next.js Foundations"
                          {...register(`courses.${index}.name` as const)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                        />
                        {errors.courses?.[index]?.name && (
                          <p className="text-[10px] text-destructive mt-0.5">{errors.courses[index].name.message}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-muted-foreground uppercase text-[9px]">Provider</label>
                        <input
                          type="text"
                          placeholder="e.g. Udemy / Coursera"
                          {...register(`courses.${index}.provider` as const)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Memberships */}
        {activeTab === "memberships" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <h4 className="text-sm font-bold text-foreground">Professional Memberships</h4>
              <button
                type="button"
                onClick={() => appendMembership({ organization: "", role: "" })}
                className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-lg px-2.5 py-1.5 text-xs font-bold hover:bg-secondary/85 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Membership
              </button>
            </div>

            {membershipFields.length === 0 ? (
              <p className="text-muted-foreground text-[10px] text-center py-6 font-medium">No memberships added. List any organizations or engineering guilds.</p>
            ) : (
              <div className="space-y-4">
                {membershipFields.map((field, index) => (
                  <div key={field.id} className="rounded-xl border border-border bg-card p-4 space-y-3 relative shadow-sm">
                    <button
                      type="button"
                      onClick={() => removeMembership(index)}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-muted-foreground uppercase text-[9px]">Organization *</label>
                        <input
                          type="text"
                          placeholder="e.g. Association for Computing Machinery (ACM)"
                          {...register(`memberships.${index}.organization` as const)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                        />
                        {errors.memberships?.[index]?.organization && (
                          <p className="text-[10px] text-destructive mt-0.5">{errors.memberships[index].organization.message}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-muted-foreground uppercase text-[9px]">Your Role / Status</label>
                        <input
                          type="text"
                          placeholder="e.g. Member / Committee Leader"
                          {...register(`memberships.${index}.role` as const)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default EducationForm;
