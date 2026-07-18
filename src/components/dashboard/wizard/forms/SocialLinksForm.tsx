"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { socialLinksSchema, SocialLinksData } from "./formSchemas";
import {
  Globe,
  MessageCircle,
  Calendar,
  Send,
  Hash,
  Terminal,
} from "lucide-react";

// Production-ready custom brand SVG icons to bypass lucide-react version variations
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" rx="1" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

const BehanceIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M8.22 5.38c1.37 0 2.45.31 3.23.92.79.62 1.18 1.49 1.18 2.62 0 1-.31 1.83-.93 2.5a3.84 3.84 0 0 1-2.48 1.25v.06c1.1.2 1.95.66 2.55 1.38.6.72.9 1.63.9 2.72 0 1.24-.44 2.22-1.31 2.94-.88.72-2.09 1.08-3.64 1.08H2V5.38h6.22zm-.25 6.07c.72 0 1.24-.13 1.56-.4.32-.27.48-.68.48-1.24 0-.54-.15-.94-.46-1.18-.3-.24-.8-.36-1.47-.36H4.86v3.18H7.97zm.37 6.43c.78 0 1.37-.15 1.76-.45.39-.3.58-.78.58-1.42 0-.62-.2-1.07-.6-1.36-.39-.28-.99-.42-1.8-.42H4.86v3.65h3.48zM22 13.92h-7.66c.07.78.33 1.38.77 1.8.44.43.99.64 1.64.64.9 0 1.52-.37 1.87-1.12h3.08c-.28 1.06-.9 1.93-1.87 2.62-.97.69-2.13 1.04-3.5 1.04-1.92 0-3.4-.6-4.43-1.82-1.03-1.22-1.54-2.88-1.54-5s.51-3.79 1.54-5.01c1.03-1.22 2.5-1.83 4.43-1.83 1.86 0 3.28.58 4.25 1.75 1 .17 1.48 2.76 1.48 4.79v1.17zm-3.08-2c0-.66-.2-1.18-.58-1.55-.38-.37-.87-.56-1.47-.56-.63 0-1.13.2-1.5.58-.37.38-.6.9-.67 1.53h4.22zM14.6 7.64h6v1.36h-6V7.64z"/>
  </svg>
);

const DribbbleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.49-11.05 1-11.6 8.56" />
  </svg>
);

export function SocialLinksForm() {
  const updateWebsiteData = useWebsiteBuilderStore((state) => state.updateWebsiteData);
  const setValidationState = useWebsiteBuilderStore((state) => state.setValidationState);
  const stepKey = "socialLinks";
  const defaultValues = useWebsiteBuilderStore.getState().websiteData[stepKey] || {};

  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useForm<SocialLinksData>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      github: defaultValues.github || "",
      linkedin: defaultValues.linkedin || "",
      twitter: defaultValues.twitter || "",
      facebook: defaultValues.facebook || "",
      instagram: defaultValues.instagram || "",
      youtube: defaultValues.youtube || "",
      behance: defaultValues.behance || "",
      dribbble: defaultValues.dribbble || "",
      hashnode: defaultValues.hashnode || "",
      devto: defaultValues.devto || "",
      medium: defaultValues.medium || "",
      stackOverflow: defaultValues.stackOverflow || "",
      discord: defaultValues.discord || "",
      telegram: defaultValues.telegram || "",
      whatsapp: defaultValues.whatsapp || "",
      portfolio: defaultValues.portfolio || "",
      calendly: defaultValues.calendly || "",
    },
    mode: "onChange",
  });

  const watchedValues = watch();

  // Keep validation state in sync in real-time
  useEffect(() => {
    setValidationState(10, isValid);
  }, [isValid, setValidationState]);

  // Keep form data in sync with store
  useEffect(() => {
    const subscription = watch((value) => {
      updateWebsiteData(stepKey, value);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateWebsiteData]);

  const socialFields = [
    { name: "github", label: "GitHub", icon: GithubIcon, placeholder: "https://github.com/username" },
    { name: "linkedin", label: "LinkedIn", icon: LinkedinIcon, placeholder: "https://linkedin.com/in/username" },
    { name: "twitter", label: "X (Twitter)", icon: TwitterIcon, placeholder: "https://x.com/username" },
    { name: "whatsapp", label: "WhatsApp Chat Link", icon: MessageCircle, placeholder: "https://wa.me/phone_number" },
    { name: "portfolio", label: "Personal Portfolio Link", icon: Globe, placeholder: "https://mywebsite.com" },
    { name: "calendly", label: "Calendly Booking Link", icon: Calendar, placeholder: "https://calendly.com/username" },
    { name: "behance", label: "Behance Profile", icon: BehanceIcon, placeholder: "https://behance.net/username" },
    { name: "dribbble", label: "Dribbble Profile", icon: DribbbleIcon, placeholder: "https://dribbble.com/username" },
    { name: "instagram", label: "Instagram", icon: InstagramIcon, placeholder: "https://instagram.com/username" },
    { name: "facebook", label: "Facebook", icon: FacebookIcon, placeholder: "https://facebook.com/username" },
    { name: "youtube", label: "YouTube Channel", icon: YoutubeIcon, placeholder: "https://youtube.com/@channel" },
    { name: "hashnode", label: "Hashnode Blog", icon: Hash, placeholder: "https://hashnode.dev/@username" },
    { name: "devto", label: "Dev.to Profile", icon: Terminal, placeholder: "https://dev.to/username" },
    { name: "medium", label: "Medium Profile", icon: Globe, placeholder: "https://medium.com/@username" },
    { name: "stackOverflow", label: "Stack Overflow", icon: Terminal, placeholder: "https://stackoverflow.com/users/id" },
    { name: "discord", label: "Discord Server Invite", icon: MessageCircle, placeholder: "https://discord.gg/invite" },
    { name: "telegram", label: "Telegram Chat", icon: Send, placeholder: "https://t.me/username" },
  ] as const;

  return (
    <div className="space-y-6 text-left text-xs font-semibold">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {socialFields.map((field) => {
          const Icon = field.icon;
          const err = errors[field.name as keyof typeof errors];

          return (
            <div key={field.name} className="space-y-1.5">
              <label className="text-muted-foreground uppercase text-[10px] flex items-center gap-1.5">
                <Icon className="h-4 w-4 text-muted-foreground/80 shrink-0" />
                {field.label}
              </label>
              <input
                type="text"
                placeholder={field.placeholder}
                {...register(field.name)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
              />
              {err && <p className="text-[10px] text-destructive mt-0.5">{err.message}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default SocialLinksForm;
