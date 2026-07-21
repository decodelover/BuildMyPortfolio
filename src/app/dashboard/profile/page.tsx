"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2, User, Mail, Shield, Globe, Image as ImageIcon, MapPin, Briefcase, Sparkles, CheckCircle2 } from "lucide-react";
import { uploadUserFile } from "@/lib/firebase/storage";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required.").min(3, "Name must be at least 3 characters."),
  username: z.string().min(1, "Username is required.").min(3, "Username must be at least 3 characters.").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain alphanumeric characters and underscores."),
  profession: z.string().nullable().optional(),
  bio: z.string().max(250, "Bio cannot exceed 250 characters.").nullable().optional(),
  country: z.string().nullable().optional(),
  socialLinks: z.object({
    github: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
    twitter: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
    linkedin: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
    website: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  }).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      username: "",
      profession: "",
      bio: "",
      country: "",
      socialLinks: {
        github: "",
        twitter: "",
        linkedin: "",
        website: "",
      },
    },
  });

  const watchName = watch("fullName");
  const watchUsername = watch("username");
  const watchProfession = watch("profession");
  const watchBio = watch("bio");
  const watchCountry = watch("country");

  useEffect(() => {
    if (user) {
      setValue("fullName", user.fullName || "");
      setValue("username", user.username || "");
      setValue("profession", user.profession || "");
      setValue("bio", user.bio || "");
      setValue("country", user.country || "");
      setValue("socialLinks.github", user.socialLinks?.github || "");
      setValue("socialLinks.twitter", user.socialLinks?.twitter || "");
      setValue("socialLinks.linkedin", user.socialLinks?.linkedin || "");
      setValue("socialLinks.website", user.socialLinks?.website || "");
    }
  }, [user, setValue]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image file size must be less than 3MB.");
      return;
    }

    setUploading(true);
    try {
      const publicUrl = await uploadUserFile(user.uid, file, "profile");
      await updateUser({ photoURL: publicUrl });
      toast.success("Profile avatar updated successfully!");
    } catch (err) {
      console.error("Avatar upload failed:", err);
      toast.error("Failed to upload avatar image.");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setSaving(true);
    try {
      await updateUser({
        fullName: data.fullName,
        username: data.username,
        profession: data.profession || null,
        bio: data.bio || null,
        country: data.country || null,
        socialLinks: {
          github: data.socialLinks?.github || undefined,
          twitter: data.socialLinks?.twitter || undefined,
          linkedin: data.socialLinks?.linkedin || undefined,
          website: data.socialLinks?.website || undefined,
        },
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Failed to update profile values.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-border/60 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          <User className="h-7 w-7 text-primary" /> Profile Settings
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your developer identity, profile avatar, and social connectivity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Avatar selector card & Live Card Preview */}
        <div className="lg:col-span-4 space-y-6">
          {/* Avatar Upload Panel */}
          <div className="rounded-3xl border border-border/60 bg-card/70 p-6 flex flex-col items-center justify-center text-center shadow-sm backdrop-blur-2xl space-y-5">
            <div className="relative h-28 w-28 rounded-full border-2 border-primary/40 overflow-hidden bg-muted flex items-center justify-center group shadow-md">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-muted-foreground" />
              )}
              
              {uploading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                </div>
              )}

              {!uploading && (
                <label className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] text-foreground font-bold cursor-pointer transition-opacity">
                  <ImageIcon className="h-4 w-4 mb-1 text-primary" />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-foreground truncate max-w-[180px]">{user?.fullName || "Developer"}</h4>
              <p className="text-xs text-muted-foreground font-mono truncate max-w-[180px]">@{user?.username || "username"}</p>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="rounded-3xl border border-border/60 bg-gradient-to-tr from-card via-card/80 to-primary/10 p-6 shadow-sm backdrop-blur-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-border/40 pb-2 text-[10px] font-extrabold tracking-wider text-muted-foreground uppercase">
              <span>Live Card Preview</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-3">
              <div className="flex gap-3 items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 overflow-hidden shrink-0 flex items-center justify-center">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Preview Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="text-left space-y-0.5 min-w-0">
                  <h4 className="font-extrabold text-foreground text-xs truncate">{watchName || "Your Name"}</h4>
                  <p className="text-[10px] text-muted-foreground font-mono truncate">@{watchUsername || "username"}</p>
                </div>
              </div>

              {watchProfession && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary">
                  <Briefcase className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{watchProfession}</span>
                </div>
              )}
              {watchCountry && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{watchCountry}</span>
                </div>
              )}

              <p className="text-[11px] text-muted-foreground leading-relaxed border-t border-border/40 pt-2.5">
                {watchBio || "Add your bio details to show recruiter summaries."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Profile Form */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-border/60 bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-2xl space-y-6">
            <h3 className="text-sm font-bold text-foreground">Edit Account Profile</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-muted-foreground uppercase text-[10px]">Full Name *</label>
                <input
                  type="text"
                  {...register("fullName")}
                  className="w-full rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                />
                {errors.fullName && <p className="text-[10px] text-destructive">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground uppercase text-[10px]">Username *</label>
                <input
                  type="text"
                  {...register("username")}
                  className="w-full rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                />
                {errors.username && <p className="text-[10px] text-destructive">{errors.username.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground uppercase text-[10px]">Profession</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Software Engineer"
                  {...register("profession")}
                  className="w-full rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground uppercase text-[10px]">Country</label>
                <input
                  type="text"
                  placeholder="e.g. United States"
                  {...register("country")}
                  className="w-full rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-muted-foreground uppercase text-[10px]">Bio</label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of your technical focus..."
                  {...register("bio")}
                  className="w-full rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                />
              </div>
            </div>

            <div className="border-t border-border/40 pt-5 space-y-4">
              <h4 className="text-xs font-bold text-foreground">Social Links</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <input
                  type="url"
                  placeholder="GitHub URL"
                  {...register("socialLinks.github")}
                  className="w-full rounded-xl border border-border/60 bg-background/60 px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                />
                <input
                  type="url"
                  placeholder="LinkedIn URL"
                  {...register("socialLinks.linkedin")}
                  className="w-full rounded-xl border border-border/60 bg-background/60 px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold shadow-md hover:opacity-95 transition-opacity cursor-pointer flex items-center gap-2"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
