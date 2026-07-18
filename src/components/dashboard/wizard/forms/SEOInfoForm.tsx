"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { seoInfoSchema, SEOInfoData } from "./formSchemas";
import { FileUploadProgress } from "./FileUploadProgress";

export function SEOInfoForm() {
  const updateWebsiteData = useWebsiteBuilderStore((state) => state.updateWebsiteData);
  const setValidationState = useWebsiteBuilderStore((state) => state.setValidationState);
  const stepKey = "seoInfo";
  const defaultValues = useWebsiteBuilderStore.getState().websiteData[stepKey] || {};

  const {
    register,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<SEOInfoData>({
    resolver: zodResolver(seoInfoSchema),
    defaultValues: {
      metaTitle: defaultValues.metaTitle || "",
      metaDescription: defaultValues.metaDescription || "",
      metaKeywords: defaultValues.metaKeywords || "",
      targetCountry: defaultValues.targetCountry || "",
      targetAudience: defaultValues.targetAudience || "",
      ogImageUrl: defaultValues.ogImageUrl || "",
      faviconUrl: defaultValues.faviconUrl || "",
      googleAnalyticsId: defaultValues.googleAnalyticsId || "",
      googleConsoleId: defaultValues.googleConsoleId || "",
    },
    mode: "onChange",
  });

  const watchedValues = watch();

  // Keep validation state in sync in real-time
  useEffect(() => {
    setValidationState(13, isValid);
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
        {/* Meta Title */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">SEO Meta Title</label>
          <input
            type="text"
            placeholder="e.g. Jane Doe - Portfolio | Principal Cloud Consultant"
            {...register("metaTitle")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>

        {/* Target Country */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Target SEO Country</label>
          <input
            type="text"
            placeholder="e.g. Global / United States"
            {...register("targetCountry")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>

        {/* Target Audience */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-muted-foreground uppercase text-[10px]">Target Audience</label>
          <input
            type="text"
            placeholder="e.g. Tech recruiters, Startup CEOs, VC partners"
            {...register("targetAudience")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>

        {/* SEO Description */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-muted-foreground uppercase text-[10px]">SEO Meta Description</label>
          <textarea
            placeholder="Write a concise site summary description. This maps to the HTML description tag shown in Google search results..."
            rows={3}
            {...register("metaDescription")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>

        {/* Meta Keywords */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-muted-foreground uppercase text-[10px]">Meta Keywords (Comma-separated)</label>
          <input
            type="text"
            placeholder="e.g. portfolio, backend developer, serverless developer"
            {...register("metaKeywords")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>

        {/* Google Analytics ID */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Google Analytics Measurement ID (Optional)</label>
          <input
            type="text"
            placeholder="e.g. G-XXXXXXX"
            {...register("googleAnalyticsId")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>

        {/* Google Console Verification ID */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Google Search Console Verification Code (Optional)</label>
          <input
            type="text"
            placeholder="e.g. google-site-verification=xxxxxx"
            {...register("googleConsoleId")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
          />
        </div>
      </div>

      {/* SEO Uploads (Favicon & Open Graph Image) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-border">
        {/* Favicon Upload */}
        <FileUploadProgress
          label="Favicon File (.ico, .png)"
          accept="image/x-icon,image/png"
          folder="seo/favicons"
          value={watchedValues.faviconUrl || ""}
          onChange={(url) => setValue("faviconUrl", url, { shouldValidate: true })}
        />

        {/* Open Graph Image */}
        <FileUploadProgress
          label="Social Share Image (OG Image - 1200x630)"
          accept="image/*"
          folder="seo/og_images"
          value={watchedValues.ogImageUrl || ""}
          onChange={(url) => setValue("ogImageUrl", url, { shouldValidate: true })}
        />
      </div>
    </div>
  );
}
export default SEOInfoForm;
