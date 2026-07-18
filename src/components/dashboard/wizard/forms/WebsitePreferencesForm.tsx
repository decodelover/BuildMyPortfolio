"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { websitePreferencesSchema, WebsitePreferencesData } from "./formSchemas";
import { Sun, Moon, Laptop, Type, Palette, LayoutGrid, Award, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function WebsitePreferencesForm() {
  const updateWebsiteData = useWebsiteBuilderStore((state) => state.updateWebsiteData);
  const setValidationState = useWebsiteBuilderStore((state) => state.setValidationState);
  const stepKey = "websitePreferences";
  const defaultValues = useWebsiteBuilderStore.getState().websiteData[stepKey] || {};

  const {
    register,
    watch,
    setValue,
    formState: { isValid },
  } = useForm<WebsitePreferencesData>({
    resolver: zodResolver(websitePreferencesSchema),
    defaultValues: {
      theme: defaultValues.theme || "minimal",
      navigationStyle: defaultValues.navigationStyle || "Top Navbar",
      headerLayout: defaultValues.headerLayout || "Centered Hero",
      footerLayout: defaultValues.footerLayout || "Simple Copyright",
      animationStyle: defaultValues.animationStyle || "Fade In",
      borderRadius: defaultValues.borderRadius || "Medium (8px)",
      colorPalette: defaultValues.colorPalette || "Nordic Minimalist (Gray scale)",
      typography: defaultValues.typography || "Sans-serif (Inter)",
      defaultTheme: defaultValues.defaultTheme || "System",
    },
    mode: "onChange",
  });

  const watchedValues = watch();

  // Keep validation state in sync in real-time
  useEffect(() => {
    setValidationState(11, isValid);
  }, [isValid, setValidationState]);

  // Keep form data in sync with store
  useEffect(() => {
    const subscription = watch((value) => {
      updateWebsiteData(stepKey, value);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateWebsiteData]);

  const themes = [
    { id: "agency", label: "Agency", desc: "Bold typography, solid grid borders, high contrast layouts." },
    { id: "corporate", label: "Corporate", desc: "Traditional dark blue structure, clean header rows, trustworthy." },
    { id: "minimal", label: "Minimalist", desc: "Spacious layout, light backgrounds, ultra thin borders." },
    { id: "startup", label: "Startup Tech", desc: "Linear gradient grids, tech features lists, subtle shadows." },
    { id: "luxury", label: "Luxury Elegant", desc: "Serif headings, gold/bronze highlights, dark luxury shades." },
    { id: "developer", label: "Dark Developer", desc: "Terminal design grids, neon accents, dark gray code frames." },
    { id: "creative", label: "Creative Portfolio", desc: "Asymmetric grid frames, high impacts, neon outlines." },
    { id: "enterprise", label: "Enterprise Grid", desc: "Solid columns, multi-card listings, heavy professional look." },
  ] as const;

  const colorPalettes = [
    { label: "Nordic Minimalist (Gray scale)", colors: ["bg-zinc-800", "bg-zinc-500", "bg-zinc-200"] },
    { label: "Ocean Breeze (Blue/Teal)", colors: ["bg-blue-600", "bg-teal-500", "bg-sky-200"] },
    { label: "Midnight Neon (Dark purple/pink)", colors: ["bg-purple-600", "bg-pink-500", "bg-rose-300"] },
    { label: "Forest Green", colors: ["bg-emerald-700", "bg-green-500", "bg-amber-100"] },
    { label: "Classic Dark Mode", colors: ["bg-slate-900", "bg-slate-700", "bg-slate-300"] },
  ];

  const borderRadii = [
    { label: "None", preview: "rounded-none" },
    { label: "Small (4px)", preview: "rounded-sm" },
    { label: "Medium (8px)", preview: "rounded-lg" },
    { label: "Large (16px)", preview: "rounded-2xl" },
    { label: "Full Round", preview: "rounded-full" },
  ];

  const typographies = [
    { label: "Sans-serif (Inter)", preview: "font-sans" },
    { label: "Serif (Playfair Display)", preview: "font-serif" },
    { label: "Mono (Fira Code)", preview: "font-mono" },
    { label: "Modern (Outfit)", preview: "font-sans tracking-wide" },
  ];

  return (
    <div className="space-y-6 text-left text-xs font-semibold">
      {/* Website Style (Theme Select Cards) */}
      <div className="space-y-3">
        <label className="text-muted-foreground uppercase text-[10px] flex items-center gap-1.5">
          <LayoutGrid className="h-4 w-4" /> Choose Website Style Theme
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {themes.map((t) => {
            const isSelected = watchedValues.theme === t.id;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setValue("theme", t.id, { shouldValidate: true })}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-all h-36 flex flex-col justify-between cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                )}
              >
                <div className="space-y-1">
                  <h4 className={cn("text-xs font-bold", isSelected ? "text-primary" : "text-foreground")}>
                    {t.label}
                  </h4>
                  <p className="text-[10px] text-muted-foreground/80 leading-normal font-medium mt-1">
                    {t.desc}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[8px] font-mono text-muted-foreground/60 uppercase">
                    Preset grid
                  </span>
                  <span
                    className={cn(
                      "h-4 w-4 rounded-full border flex items-center justify-center text-[9px] font-bold text-white",
                      isSelected ? "bg-primary border-primary" : "border-border bg-background"
                    )}
                  >
                    {isSelected && "✓"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Select Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-border">
        {/* Navigation Style */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Navigation Style</label>
          <select
            {...register("navigationStyle")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45 cursor-pointer"
          >
            <option value="Top Navbar">Top Navbar</option>
            <option value="Side Navbar">Side Navbar</option>
            <option value="Minimal Toggle">Minimal Toggle</option>
          </select>
        </div>

        {/* Header Layout */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Header Layout</label>
          <select
            {...register("headerLayout")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45 cursor-pointer"
          >
            <option value="Centered Hero">Centered Hero</option>
            <option value="Left-aligned Hero with Image">Left-aligned Hero with Image</option>
            <option value="Split Screen">Split Screen</option>
          </select>
        </div>

        {/* Footer Layout */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px]">Footer Layout</label>
          <select
            {...register("footerLayout")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45 cursor-pointer"
          >
            <option value="Simple Copyright">Simple Copyright</option>
            <option value="Multi-column Links">Multi-column Links</option>
            <option value="Call-to-Action Grid">Call-to-Action Grid</option>
          </select>
        </div>
      </div>

      {/* Typography, Color Palette, and Borders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
        {/* Color Palette Choice */}
        <div className="space-y-3">
          <label className="text-muted-foreground uppercase text-[10px] flex items-center gap-1.5">
            <Palette className="h-4 w-4" /> Color Palette Preset
          </label>
          <div className="space-y-2">
            {colorPalettes.map((cp) => {
              const isSelected = watchedValues.colorPalette === cp.label;

              return (
                <button
                  key={cp.label}
                  type="button"
                  onClick={() => setValue("colorPalette", cp.label, { shouldValidate: true })}
                  className={cn(
                    "w-full flex items-center justify-between border rounded-xl p-3 text-left transition-all cursor-pointer",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:bg-muted"
                  )}
                >
                  <span className="text-xs font-semibold">{cp.label}</span>
                  <div className="flex gap-1">
                    {cp.colors.map((c, i) => (
                      <span key={i} className={cn("h-4 w-4 rounded-full border border-border/20 shadow-sm", c)} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Borders and Fonts */}
        <div className="space-y-5">
          {/* Border Radius Choice */}
          <div className="space-y-2.5">
            <label className="text-muted-foreground uppercase text-[10px] flex items-center gap-1.5">
              <Award className="h-4 w-4" /> Border Radius Style
            </label>
            <div className="flex flex-wrap gap-2">
              {borderRadii.map((br) => {
                const isSelected = watchedValues.borderRadius === br.label;

                return (
                  <button
                    key={br.label}
                    type="button"
                    onClick={() => setValue("borderRadius", br.label, { shouldValidate: true })}
                    className={cn(
                      "flex items-center gap-2 border rounded-xl px-3 py-2 transition-all cursor-pointer font-bold",
                      isSelected ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted text-muted-foreground"
                    )}
                  >
                    <span className={cn("h-4 w-4 border border-primary shrink-0 bg-background shadow-inner", br.preview)} />
                    <span>{br.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography Choice */}
          <div className="space-y-2.5">
            <label className="text-muted-foreground uppercase text-[10px] flex items-center gap-1.5">
              <Type className="h-4 w-4" /> Typography Font Face
            </label>
            <div className="grid grid-cols-2 gap-2">
              {typographies.map((font) => {
                const isSelected = watchedValues.typography === font.label;

                return (
                  <button
                    key={font.label}
                    type="button"
                    onClick={() => setValue("typography", font.label, { shouldValidate: true })}
                    className={cn(
                      "flex flex-col border rounded-xl p-3 text-left transition-all cursor-pointer",
                      isSelected ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted text-muted-foreground"
                    )}
                  >
                    <span className={cn("text-sm font-bold", font.preview)}>Aa</span>
                    <span className="text-[10px] font-bold mt-1.5 truncate">{font.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Theme Light/Dark Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
        {/* Animation Selection */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground uppercase text-[10px] flex items-center gap-1.5">
            <Zap className="h-4 w-4" /> Animation Style
          </label>
          <select
            {...register("animationStyle")}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45 cursor-pointer"
          >
            <option value="None">None (Instant Load)</option>
            <option value="Fade In">Fade In</option>
            <option value="Slide Up">Slide Up</option>
            <option value="Staggered Entrance">Staggered Entrance</option>
            <option value="Elastic bounce">Elastic bounce</option>
          </select>
        </div>

        {/* Default Theme Selector */}
        <div className="space-y-2.5">
          <label className="text-muted-foreground uppercase text-[10px]">Default Color Mode</label>
          <div className="flex gap-2">
            {[
              { id: "Light", label: "Light Mode", icon: Sun },
              { id: "Dark", label: "Dark Mode", icon: Moon },
              { id: "System", label: "System Sync", icon: Laptop },
            ].map((themeOpt) => {
              const Icon = themeOpt.icon;
              const isSelected = watchedValues.defaultTheme === themeOpt.id;

              return (
                <button
                  key={themeOpt.id}
                  type="button"
                  onClick={() => setValue("defaultTheme", themeOpt.id, { shouldValidate: true })}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 border rounded-xl py-3 text-xs font-bold cursor-pointer transition-all",
                    isSelected ? "bg-primary border-primary text-primary-foreground shadow-md" : "border-border hover:bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{themeOpt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
export default WebsitePreferencesForm;
