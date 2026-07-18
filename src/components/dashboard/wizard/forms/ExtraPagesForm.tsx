"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { extraPagesSchema, ExtraPagesData } from "./formSchemas";
import { BookOpen, HelpCircle, Image, FileText, MessageSquare, Wrench, FolderGit2, CreditCard, Shield, FileCheck, Mail, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExtraPagesForm() {
  const updateWebsiteData = useWebsiteBuilderStore((state) => state.updateWebsiteData);
  const setValidationState = useWebsiteBuilderStore((state) => state.setValidationState);
  const stepKey = "extraPages";
  const defaultValues = useWebsiteBuilderStore.getState().websiteData[stepKey] || {};

  const {
    register,
    watch,
    setValue,
    formState: { isValid },
  } = useForm<ExtraPagesData>({
    resolver: zodResolver(extraPagesSchema),
    defaultValues: {
      blog: defaultValues.blog || false,
      faq: defaultValues.faq || false,
      gallery: defaultValues.gallery || false,
      resume: defaultValues.resume || false,
      testimonials: defaultValues.testimonials || false,
      services: defaultValues.services || false,
      caseStudies: defaultValues.caseStudies || false,
      pricing: defaultValues.pricing || false,
      privacy: defaultValues.privacy || false,
      terms: defaultValues.terms || false,
      contactForm: defaultValues.contactForm !== undefined ? defaultValues.contactForm : true,
      newsletter: defaultValues.newsletter || false,
    },
    mode: "onChange",
  });

  const watchedValues = watch();

  // Keep validation state in sync in real-time
  useEffect(() => {
    setValidationState(12, isValid);
  }, [isValid, setValidationState]);

  // Keep form data in sync with store
  useEffect(() => {
    const subscription = watch((value) => {
      updateWebsiteData(stepKey, value);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateWebsiteData]);

  const pages = [
    { name: "blog", label: "Blog", icon: BookOpen, desc: "Publish articles, career thoughts, or tech news tutorials." },
    { name: "faq", label: "FAQ Page", icon: HelpCircle, desc: "List frequently asked questions and short responses." },
    { name: "gallery", label: "Media Gallery", icon: Image, desc: "Upload screenshots, team photos, or workspace blueprints." },
    { name: "resume", label: "Resume Page", icon: FileText, desc: "Interactive online resume version ready to download." },
    { name: "testimonials", label: "Testimonials Page", icon: MessageSquare, desc: "Showcase client reviews and rating quotes." },
    { name: "services", label: "Services Page", icon: Wrench, desc: "Provide details of your freelance rates and packages." },
    { name: "caseStudies", label: "Case Studies", icon: FolderGit2, desc: "Detailed projects breakdowns (Challenge, Solution, Impact)." },
    { name: "pricing", label: "Pricing Tables", icon: CreditCard, desc: "Highlight service pricing tiers, packages, or rates." },
    { name: "privacy", label: "Privacy Policy", icon: Shield, desc: "Standard text outlining user data rules." },
    { name: "terms", label: "Terms of Service", icon: FileCheck, desc: "Detailed legal guidelines for website clients." },
    { name: "contactForm", label: "Contact Form", icon: Mail, desc: "Direct messaging grid with spam filters." },
    { name: "newsletter", label: "Newsletter Opt-in", icon: Send, desc: "Allow users to subscribe to email lists." },
  ] as const;

  return (
    <div className="space-y-6 text-left text-xs font-semibold">
      <div>
        <p className="text-[10px] text-muted-foreground font-medium pb-2">Toggle the switches below to select which pages or sub-sections are enabled on your final website layout.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {pages.map((p) => {
          const Icon = p.icon;
          const isEnabled = watchedValues[p.name];

          return (
            <button
              key={p.name}
              type="button"
              onClick={() => setValue(p.name, !isEnabled, { shouldValidate: true })}
              className={cn(
                "rounded-2xl border p-4 text-left transition-all h-32 flex flex-col justify-between cursor-pointer relative overflow-hidden group select-none",
                isEnabled
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/5 text-foreground"
                  : "border-border bg-card hover:border-primary/20 text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "h-6.5 w-6.5 rounded-lg flex items-center justify-center border shrink-0 transition-colors",
                    isEnabled ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-muted-foreground border-border"
                  )}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <h4 className={cn("text-xs font-bold transition-colors", isEnabled ? "text-primary" : "text-foreground")}>
                    {p.label}
                  </h4>
                </div>
                <p className="text-[10px] text-muted-foreground/80 leading-normal font-medium mt-1">
                  {p.desc}
                </p>
              </div>

              {/* Custom switch indicator */}
              <div className="flex justify-end pt-2">
                <div className={cn(
                  "w-7.5 h-4.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer",
                  isEnabled ? "bg-primary" : "bg-muted"
                )}>
                  <div className={cn(
                    "bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-200",
                    isEnabled ? "translate-x-3" : "translate-x-0"
                  )} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
export default ExtraPagesForm;
