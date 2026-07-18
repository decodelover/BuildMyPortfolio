"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { useAuthStore } from "@/store/useAuthStore";
import { auth } from "@/lib/firebase/client";
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
import {
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Eye,
  Sparkles,
  Loader2,
  BookOpen,
  Palette,
  Search,
  Layers,
  ArrowRight,
  RefreshCw,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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
  const {
    builderId,
    websiteData,
    setValidationState,
    setCurrentStep,
    aiBlueprint,
    blueprintLoading,
    blueprintError,
    setAIBlueprint,
    setBlueprintLoading,
    setBlueprintError,
  } = useWebsiteBuilderStore();

  const authUser = useAuthStore((state) => state.user);

  // Safely check if the blueprint exists and contains valid structural fields before attempting dashboard render
  const isBlueprintValid = !!(
    aiBlueprint &&
    typeof aiBlueprint === "object" &&
    aiBlueprint.overallScore !== undefined &&
    Array.isArray(aiBlueprint.recommendedPages)
  );

  // Audit results calculated in-memory using Zod
  // Guard: only run after websiteData is available (it starts as {} on mount)
  const auditResults = stepsList.slice(0, 13).map((step) => {
    const data = (websiteData && websiteData[step.key]) ? websiteData[step.key] : {};
    const schema = stepSchemas[step.id];

    let isValid = false;
    let errors: string[] = [];

    if (schema) {
      try {
        const parseResult = schema.safeParse(data);
        isValid = parseResult.success;
        if (!parseResult.success) {
          // Extract formatted validation errors — guard against empty error arrays
          const zodErrors = parseResult.error?.errors;
          errors = Array.isArray(zodErrors)
            ? zodErrors.map((err: z.ZodIssue) => {
                const field = err.path.join(".");
                return `${field}: ${err.message}`;
              })
            : [];
        }
      } catch {
        // Silently skip schema parse errors for incomplete data on mount
        isValid = false;
        errors = [];
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

  // Handle AI Blueprint Generation
  const handleGenerateBlueprint = async () => {
    if (!builderId) {
      toast.error("Website builder session not fully initialized. Please refresh the page.");
      return;
    }

    if (authUser && authUser.aiCredits !== undefined && authUser.aiCredits < 1) {
      toast.error("Insufficient AI credits. Please upgrade your plan.");
      return;
    }

    setBlueprintLoading(true);
    setBlueprintError(null);
    toast.info("AI Analysis started. Compiling your sections...");

    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        throw new Error("User session has expired. Please re-authenticate.");
      }
      
      const token = await firebaseUser.getIdToken();
      
      const response = await fetch("/api/ai/blueprint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          builderId,
          websiteData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate website blueprint");
      }

      setAIBlueprint(data.blueprint);
      
      // Update credits in Auth Store
      if (authUser && data.creditsRemaining !== undefined) {
        useAuthStore.setState({
          user: {
            ...authUser,
            aiCredits: data.creditsRemaining,
          },
        });
      }

      toast.success("AI Website Blueprint compiled successfully!");
    } catch (err: any) {
      console.error(err);
      setBlueprintError(err.message || "An unexpected error occurred during analysis.");
      toast.error(err.message || "Failed to compile AI website blueprint.");
    } finally {
      setBlueprintLoading(false);
    }
  };

  return (
    <div className="space-y-10 text-left text-xs font-semibold">
      
      {/* SECTION B: AI WEBSITE BLUEPRINT ENGINE (New Upgrade) */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm overflow-hidden relative">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-border">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-primary text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-accent" />
              <span>AI Architect Analysis</span>
            </div>
            <h3 className="text-base font-extrabold text-foreground">AI Website Blueprint</h3>
            <p className="text-[10px] text-muted-foreground/80 font-medium max-w-xl">
              Deduce psychological target audiences, optimal landing page flows, core design guidelines, and search engine optimization configurations based on your inputs.
            </p>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
            {authUser && authUser.aiCredits !== undefined && (
              <div className="flex items-center gap-1 bg-muted/80 border border-border px-3 py-1.5 rounded-xl">
                <Zap className="h-3.5 w-3.5 text-accent fill-accent animate-pulse" />
                <span className="text-[10px] font-bold text-muted-foreground">
                  Credits Remaining: <strong className="text-foreground">{authUser.aiCredits}</strong>
                </span>
              </div>
            )}

            {!isBlueprintValid && !blueprintLoading && (
              <button
                onClick={handleGenerateBlueprint}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary to-accent text-primary-foreground font-black uppercase text-[10px] tracking-wide px-4 py-2.5 rounded-xl shadow-md shadow-primary/15 hover:shadow-primary/25 cursor-pointer transform hover:-translate-y-0.5 transition-all"
              >
                <Sparkles className="h-3.5 w-3.5 text-accent-foreground" />
                Generate Blueprint (1 Credit)
              </button>
            )}

            {isBlueprintValid && !blueprintLoading && (
              <button
                onClick={handleGenerateBlueprint}
                className="inline-flex items-center gap-1 bg-muted hover:bg-muted/80 text-foreground font-bold px-3 py-2 rounded-lg border border-border cursor-pointer transition-all text-[10px]"
                title="Regenerate website blueprint"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Re-Analyze (1 Cr)
              </button>
            )}
          </div>
        </div>

        <div className="relative z-10 mt-6 min-h-[120px]">
          <AnimatePresence mode="wait">
            
            {/* 1. Loading Skeleton Screen */}
            {blueprintLoading && (
              <motion.div
                key="loading-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 bg-muted/30 p-4 rounded-2xl border border-dashed border-border animate-pulse">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 w-1/4 bg-muted rounded" />
                    <div className="h-2 w-2/3 bg-muted rounded" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="h-28 bg-muted/20 border border-border/60 rounded-2xl animate-pulse p-4 space-y-3">
                    <div className="h-3 w-1/3 bg-muted rounded" />
                    <div className="h-2.5 w-full bg-muted rounded" />
                    <div className="h-2.5 w-2/3 bg-muted rounded" />
                  </div>
                  <div className="h-28 bg-muted/20 border border-border/60 rounded-2xl animate-pulse p-4 space-y-3">
                    <div className="h-3 w-1/3 bg-muted rounded" />
                    <div className="h-2.5 w-full bg-muted rounded" />
                    <div className="h-2.5 w-2/3 bg-muted rounded" />
                  </div>
                  <div className="h-28 bg-muted/20 border border-border/60 rounded-2xl animate-pulse p-4 space-y-3">
                    <div className="h-3 w-1/3 bg-muted rounded" />
                    <div className="h-2.5 w-full bg-muted rounded" />
                    <div className="h-2.5 w-2/3 bg-muted rounded" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. Error Message */}
            {blueprintError && !blueprintLoading && (
              <motion.div
                key="error-boundary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 border border-destructive/20 bg-destructive/5 rounded-2xl p-4"
              >
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                <div className="space-y-1 flex-1">
                  <h4 className="text-xs font-bold text-destructive">Failed to compile AI website blueprint</h4>
                  <p className="text-[10px] text-muted-foreground/90 font-medium">
                    {blueprintError}
                  </p>
                  <button
                    onClick={handleGenerateBlueprint}
                    className="inline-flex items-center gap-1 mt-2 text-destructive border border-destructive/20 hover:bg-destructive/10 px-2.5 py-1.5 rounded-lg text-[9px] font-bold transition-all cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Retry Generation
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. Empty State (Prompt user to generate) */}
            {!isBlueprintValid && !blueprintLoading && !blueprintError && (
              <motion.div
                key="empty-dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground space-y-2 border border-dashed border-border rounded-2xl bg-muted/15"
              >
                <Sparkles className="h-8 w-8 text-primary/45 animate-pulse" />
                <div className="space-y-1 max-w-sm">
                  <h4 className="text-xs font-bold text-foreground">AI Portfolio Analysis Ready</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Click the button above to run Gemini analysis on your inputs. We will construct a personalized structure blueprint and design strategy.
                  </p>
                </div>
              </motion.div>
            )}

            {/* 4. Active Blueprint Dashboard */}
            {isBlueprintValid && aiBlueprint && !blueprintLoading && !blueprintError && (
              <motion.div
                key="blueprint-details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Executive Score & Branding Block */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  
                  {/* Gauge Completeness Score */}
                  <div className="border border-border bg-card p-5 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center space-y-2">
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Portfolio Score</span>
                    
                    <div className="relative flex items-center justify-center h-20 w-20">
                      {/* Circular ring background */}
                      <svg className="absolute h-full w-full transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="34"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="transparent"
                          className="text-muted/20"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="34"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 34}
                          strokeDashoffset={2 * Math.PI * 34 * (1 - (aiBlueprint.overallScore ?? 0) / 100)}
                          className="text-primary transition-all duration-1000"
                        />
                      </svg>
                      <span className="text-xl font-black text-foreground">{aiBlueprint.overallScore ?? 0}%</span>
                    </div>

                    <span className="text-[10px] font-extrabold text-foreground">
                      {(aiBlueprint.overallScore ?? 0) >= 80 ? "Copy-Ready" : (aiBlueprint.overallScore ?? 0) >= 50 ? "Needs Polish" : "Draft Level"}
                    </span>
                  </div>

                  {/* Summary Text block */}
                  <div className="border border-border bg-card p-5 rounded-2xl shadow-sm md:col-span-3 flex flex-col justify-center space-y-1.5">
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Brand Positioning Summary</span>
                    <p className="text-xs text-foreground/90 font-medium leading-relaxed italic">
                      "{aiBlueprint.summary || ""}"
                    </p>
                  </div>
                </div>

                {/* Missing Data Warnings Alerts (if any) */}
                {aiBlueprint.missingDataWarnings && aiBlueprint.missingDataWarnings.length > 0 && (
                  <div className="border border-amber-500/20 bg-amber-500/5 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                      <h4 className="text-xs font-black uppercase tracking-wider">Optimization Opportunities</h4>
                    </div>
                    <ul className="pl-6.5 list-disc space-y-1 text-muted-foreground font-medium">
                      {(aiBlueprint.missingDataWarnings || []).map((w, idx) => (
                        <li key={idx} className="text-[10px] leading-relaxed">{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Main Bento Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Card Left: Recommended Pages */}
                  <div className="border border-border bg-card p-5 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center gap-1.5 text-foreground pb-2 border-b border-border">
                      <Layers className="h-4.5 w-4.5 text-primary" />
                      <h4 className="text-xs font-extrabold uppercase tracking-wider">Recommended Pages</h4>
                    </div>
                    <div className="space-y-2.5">
                      {(aiBlueprint.recommendedPages || []).map((page, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl border border-border bg-muted/10">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-foreground text-xs">{page.name}</span>
                              <span className={cn(
                                "text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border",
                                page.priority === "essential" 
                                  ? "border-destructive/20 bg-destructive/10 text-destructive"
                                  : page.priority === "recommended"
                                  ? "border-primary/20 bg-primary/10 text-primary"
                                  : "border-border bg-muted text-muted-foreground"
                              )}>
                                {page.priority}
                              </span>
                            </div>
                            <span className="font-mono text-[9px] text-muted-foreground block">{page.slug}</span>
                            <p className="text-[10px] text-muted-foreground/80 leading-relaxed font-medium">
                              {page.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Right: Section Ordering */}
                  <div className="border border-border bg-card p-5 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center gap-1.5 text-foreground pb-2 border-b border-border">
                      <BookOpen className="h-4.5 w-4.5 text-primary" />
                      <h4 className="text-xs font-extrabold uppercase tracking-wider">Psychological Landing Page Flow</h4>
                    </div>
                    <div className="space-y-3 relative pl-4 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-[1px] before:bg-border">
                      {(aiBlueprint.sectionOrder || []).map((sec, idx) => (
                        <div key={idx} className="relative space-y-0.5">
                          {/* Dot step marker */}
                          <div className="absolute -left-[16.5px] top-1.5 h-2 w-2 rounded-full border border-primary bg-background" />
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-muted-foreground">{idx + 1}.</span>
                            <span className="text-xs font-extrabold text-foreground">{sec.section}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground/80 leading-relaxed font-medium pl-4">
                            {sec.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Content & Design Guidelines */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Tone & Content Copy Feedback */}
                  <div className="border border-border bg-card p-5 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center gap-1.5 text-foreground pb-2 border-b border-border">
                      <ChevronRight className="h-4.5 w-4.5 text-primary" />
                      <h4 className="text-xs font-extrabold uppercase tracking-wider">Content & Copywriting Tone</h4>
                    </div>
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground font-medium">Recommended Tone Profile:</span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-accent border border-accent/25 bg-accent/5 px-2.5 py-0.5 rounded-full">
                          {aiBlueprint.contentAnalysis?.tone || ""}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-[9px] uppercase tracking-wider text-green-500 block">Copywriting Strengths:</span>
                        <ul className="pl-4.5 list-disc space-y-1 text-muted-foreground font-medium">
                          {(aiBlueprint.contentAnalysis?.strengths || []).map((str, idx) => (
                            <li key={idx} className="text-[10px] leading-relaxed">{str}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[9px] uppercase tracking-wider text-amber-500 block">Copywriting Improvements:</span>
                        <ul className="pl-4.5 list-disc space-y-1 text-muted-foreground font-medium">
                          {(aiBlueprint.contentAnalysis?.improvements || []).map((imp, idx) => (
                            <li key={idx} className="text-[10px] leading-relaxed">{imp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Design Recommendation Layout */}
                  <div className="border border-border bg-card p-5 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center gap-1.5 text-foreground pb-2 border-b border-border">
                      <Palette className="h-4.5 w-4.5 text-primary" />
                      <h4 className="text-xs font-extrabold uppercase tracking-wider">Visual & Layout Recommendations</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1 bg-muted/10 p-2.5 rounded-xl border border-border">
                        <span className="text-[9px] uppercase tracking-wider text-primary">Color Palette Integration:</span>
                        <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                          {aiBlueprint.designRecommendations?.colorSuggestion || ""}
                        </p>
                      </div>

                      <div className="space-y-1 bg-muted/10 p-2.5 rounded-xl border border-border">
                        <span className="text-[9px] uppercase tracking-wider text-primary">Typography Pairing:</span>
                        <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                          {aiBlueprint.designRecommendations?.typographySuggestion || ""}
                        </p>
                      </div>

                      <div className="space-y-1 bg-muted/10 p-2.5 rounded-xl border border-border">
                        <span className="text-[9px] uppercase tracking-wider text-primary">Layout Configuration:</span>
                        <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                          {aiBlueprint.designRecommendations?.layoutSuggestion || ""}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* SEO Configuration Recommendations */}
                <div className="border border-border bg-card p-5 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center gap-1.5 text-foreground pb-2 border-b border-border">
                    <Search className="h-4.5 w-4.5 text-primary" />
                    <h4 className="text-xs font-extrabold uppercase tracking-wider">Search Engine Optimization (SEO) Roadmap</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    
                    <div className="md:col-span-2 space-y-3.5">
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Target Search Title Tag:</span>
                        <div className="rounded-xl border border-border bg-muted/10 p-2.5 font-mono text-[10px] text-foreground select-all">
                          {aiBlueprint.seoRecommendations?.titleSuggestion || ""}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Target Search Meta Description:</span>
                        <p className="rounded-xl border border-border bg-muted/10 p-2.5 text-[10px] text-foreground select-all leading-relaxed font-medium">
                          {aiBlueprint.seoRecommendations?.descriptionSuggestion || ""}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Strategic Keyword Targets:</span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(aiBlueprint.seoRecommendations?.keywords || []).map((kw, idx) => (
                          <span key={idx} className="rounded-lg border border-border bg-muted/40 px-2 py-1 text-[9px] font-bold text-foreground">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* SECTION A: EXISTING CHECKLIST AUDIT (Preserved exactly) */}
      <div className="space-y-4">
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
      
    </div>
  );
}
export default WebsiteReviewForm;
