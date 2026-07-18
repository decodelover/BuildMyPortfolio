"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { stepsList } from "../stepsConfig";
import {
  personalInfoSchema,
  businessIdentitySchema,
  professionalStorySchema,
  servicesSchema,
  projectsSchema,
  experienceSchema,
  educationSchema,
  skillsSchema,
  testimonialsSchema,
  socialLinksSchema,
  websitePreferencesSchema,
  extraPagesSchema,
  seoInfoSchema,
} from "./formSchemas";
import { CheckCircle2, AlertTriangle, ChevronRight, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

// Map step ID to its corresponding schema
const stepSchemas: Record<number, any> = {
  1: personalInfoSchema,
  2: businessIdentitySchema,
  3: professionalStorySchema,
  4: servicesSchema,
  5: projectsSchema,
  6: experienceSchema,
  7: educationSchema,
  8: skillsSchema,
  9: testimonialsSchema,
  10: socialLinksSchema,
  11: websitePreferencesSchema,
  12: extraPagesSchema,
  13: seoInfoSchema,
};

export function WebsiteReviewForm() {
  const { websiteData, setValidationState, setCurrentStep } = useWebsiteBuilderStore();

  // Audit results calculated in-memory using Zod
  const auditResults = stepsList.slice(0, 13).map((step) => {
    const data = websiteData[step.key] || {};
    const schema = stepSchemas[step.id];

    let isValid = false;
    let errors: string[] = [];

    if (schema) {
      const parseResult = schema.safeParse(data);
      isValid = parseResult.success;
      if (!parseResult.success) {
        // Extract formatted validation errors
        errors = parseResult.error.errors.map((err: z.ZodIssue) => {
          const field = err.path.join(".");
          return `${field}: ${err.message}`;
        });
      }
    }

    return {
      id: step.id,
      title: step.title,
      key: step.key,
      isValid,
      errors,
      dataSummary: getDataSummary(step.id, data),
    };
  });

  // Maintain overall validation state of step 14 as true since it's just a review dashboard
  useEffect(() => {
    setValidationState(14, true);
  }, [setValidationState]);

  // Helper to construct brief summaries of section contents
  function getDataSummary(stepId: number, data: any): string {
    if (!data || Object.keys(data).length === 0) return "No information filled out yet.";

    switch (stepId) {
      case 1:
        return data.fullName ? `Name: ${data.fullName} (${data.profession || "No Title"})` : "Personal details empty.";
      case 2:
        return data.brandName ? `Brand: ${data.brandName} | Web Title: ${data.websiteTitle}` : "Identity details empty.";
      case 3:
        return data.aboutMe ? `${data.aboutMe.slice(0, 60)}...` : "Bio story empty.";
      case 4:
        const servicesCount = data.services?.length || 0;
        return servicesCount > 0 ? `${servicesCount} service offering(s) configured.` : "No services added.";
      case 5:
        const projectsCount = data.projects?.length || 0;
        return projectsCount > 0 ? `${projectsCount} portfolio project(s) added.` : "No projects added.";
      case 6:
        const jobsCount = data.experience?.length || 0;
        return jobsCount > 0 ? `${jobsCount} work experience timeline point(s).` : "No work history listed.";
      case 7:
        const edu = data.education?.length || 0;
        const cert = data.certifications?.length || 0;
        return `${edu} academic degrees, ${cert} certifications added.`;
      case 8:
        // Sum up total skills across all categories
        let skillsCount = 0;
        Object.keys(data).forEach((cat) => {
          if (Array.isArray(data[cat])) {
            skillsCount += data[cat].length;
          }
        });
        return skillsCount > 0 ? `${skillsCount} skill capability tag(s) categorised.` : "No skills added.";
      case 9:
        const tCount = data.testimonials?.length || 0;
        return tCount > 0 ? `${tCount} manual testimonial(s) listed.` : "No testimonials added.";
      case 10:
        // Count non-empty social links
        const socialCount = Object.values(data).filter((v) => !!v).length;
        return socialCount > 0 ? `${socialCount} social profile channel(s) connected.` : "No profiles linked.";
      case 11:
        return `Theme: ${data.theme || "minimal"} | Menu: ${data.navigationStyle || "default"}`;
      case 12:
        const enabledPages = Object.keys(data).filter((k) => data[k] === true);
        return enabledPages.length > 0 ? `Sub-pages enabled: ${enabledPages.join(", ")}` : "Only landing page active.";
      case 13:
        return data.metaTitle ? `SEO title: ${data.metaTitle}` : "SEO metadata empty.";
      default:
        return "Metadata logged.";
    }
  }

  return (
    <div className="space-y-6 text-left text-xs font-semibold">
      <div>
        <h3 className="text-sm font-bold text-foreground">Final Website Audit</h3>
        <p className="text-[10px] text-muted-foreground font-medium pb-2">
          Verify your section details. If a section shows validation errors, you can click it to jump back and correct fields.
        </p>
      </div>

      {/* Audit Checklist Card Grid */}
      <div className="grid grid-cols-1 gap-3">
        {auditResults.map((audit) => (
          <div
            key={audit.id}
            className={cn(
              "rounded-2xl border bg-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm transition-all hover:border-primary/20",
              audit.isValid ? "border-border" : "border-destructive/20 bg-destructive/5"
            )}
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {audit.isValid ? (
                  <CheckCircle2 className="h-4.5 w-4.5 text-accent shrink-0" />
                ) : (
                  <AlertTriangle className="h-4.5 w-4.5 text-destructive shrink-0" />
                )}
                <h4 className="text-xs font-extrabold text-foreground truncate">
                  {audit.id}. {audit.title}
                </h4>
              </div>

              {/* Summary Description */}
              <p className="text-[10px] text-muted-foreground/80 font-medium truncate pl-6.5">
                {audit.dataSummary}
              </p>

              {/* Zod Validation Errors List */}
              {audit.errors.length > 0 && (
                <div className="pl-6.5 pt-1 space-y-1">
                  {audit.errors.slice(0, 3).map((err, i) => (
                    <p key={i} className="text-[9px] text-destructive/80 font-mono">
                      ⚠ {err}
                    </p>
                  ))}
                  {audit.errors.length > 3 && (
                    <p className="text-[9px] text-destructive/60 font-mono pl-3">
                      ...and {audit.errors.length - 3} more errors.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Jump Action */}
            <button
              onClick={() => setCurrentStep(audit.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[10px] font-bold shrink-0 cursor-pointer transition-all hover:bg-muted self-start md:self-auto",
                audit.isValid ? "text-muted-foreground" : "text-destructive border-destructive/20 bg-destructive/10"
              )}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Review Section</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default WebsiteReviewForm;
