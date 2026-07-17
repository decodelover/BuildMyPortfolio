"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2, User, Mail, Shield, Globe, Image as ImageIcon } from "lucide-react";
import { uploadUserFile } from "@/lib/firebase/storage";
import { cn } from "@/lib/utils";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

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

  // Populate form values when user details load
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

    // Validate type and size (max 3MB)
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
    <div className="space-y-8 text-left max-w-4xl">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight">Profile Details</h1>
        <p className="text-sm text-muted-foreground">Manage your developer profile settings and social links.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Avatar selector card */}
        <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-6 flex flex-col items-center justify-center text-center shadow-sm h-fit space-y-6">
          <div className="relative h-28 w-28 rounded-full border-2 border-border overflow-hidden bg-secondary flex items-center justify-center group shadow-md">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <User className="h-10 w-10 text-muted-foreground" />
            )}
            
            {/* Upload Spinner overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              </div>
            )}

            {/* Hover visual label overlay */}
            {!uploading && (
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] text-white font-semibold cursor-pointer transition-opacity">
                <ImageIcon className="h-4 w-4 mb-1" />
                Change Photo
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
            <h4 className="text-sm font-bold text-foreground truncate max-w-[180px]">{user?.fullName}</h4>
            <p className="text-xs text-muted-foreground font-mono truncate max-w-[180px]">@{user?.username}</p>
          </div>

          <div className="border-t border-border w-full pt-4 text-xs text-muted-foreground flex justify-between">
            <span>Email</span>
            <span className="font-semibold text-foreground truncate max-w-[120px]">{user?.email}</span>
          </div>
        </div>

        {/* Right Side: Interactive edit forms container */}
        <div className="lg:col-span-8 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
                <input
                  type="text"
                  disabled={saving}
                  className={cn(
                    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary disabled:opacity-50",
                    errors.fullName && "border-destructive focus:ring-destructive/30"
                  )}
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-xs text-destructive font-medium">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Username</label>
                <input
                  type="text"
                  disabled={saving}
                  className={cn(
                    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary disabled:opacity-50",
                    errors.username && "border-destructive focus:ring-destructive/30"
                  )}
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-xs text-destructive font-medium">{errors.username.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Profession / Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Lead React Architect"
                  disabled={saving}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/45"
                  {...register("profession")}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Country</label>
                <input
                  type="text"
                  placeholder="e.g. United States"
                  disabled={saving}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/45"
                  {...register("country")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Short Bio (Max 250 characters)</label>
              <textarea
                rows={3}
                placeholder="Write a brief intro highlighting your technical skills..."
                disabled={saving}
                className={cn(
                  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/45 resize-none disabled:opacity-50",
                  errors.bio && "border-destructive focus:ring-destructive/30"
                )}
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-xs text-destructive font-medium">{errors.bio.message}</p>
              )}
            </div>

            {/* Social settings segment */}
            <div className="border-t border-border pt-4 space-y-3">
              <h3 className="text-sm font-bold text-foreground">Social Settings</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <GithubIcon className="h-3.5 w-3.5" /> GitHub URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://github.com/yourusername"
                    disabled={saving}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    {...register("socialLinks.github")}
                  />
                  {errors.socialLinks?.github && (
                    <p className="text-[10px] text-destructive">{errors.socialLinks.github.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <LinkedinIcon className="h-3.5 w-3.5" /> LinkedIn URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/yourusername"
                    disabled={saving}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    {...register("socialLinks.linkedin")}
                  />
                  {errors.socialLinks?.linkedin && (
                    <p className="text-[10px] text-destructive">{errors.socialLinks.linkedin.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <TwitterIcon className="h-3.5 w-3.5" /> Twitter URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://twitter.com/yourusername"
                    disabled={saving}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    {...register("socialLinks.twitter")}
                  />
                  {errors.socialLinks?.twitter && (
                    <p className="text-[10px] text-destructive">{errors.socialLinks.twitter.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" /> Personal Website
                  </label>
                  <input
                    type="text"
                    placeholder="https://yourwebsite.com"
                    disabled={saving}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    {...register("socialLinks.website")}
                  />
                  {errors.socialLinks?.website && (
                    <p className="text-[10px] text-destructive">{errors.socialLinks.website.message}</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all disabled:opacity-50 mt-4 ml-auto"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Details...
                </>
              ) : (
                "Save Profile Changes"
              )}
            </button>

          </form>
        </div>

      </div>

    </div>
  );
}
