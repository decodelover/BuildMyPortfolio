import {
  User,
  Briefcase,
  BookOpen,
  Sparkles,
  FolderKanban,
  History,
  GraduationCap,
  Cpu,
  MessageSquare,
  Share2,
  Palette,
  Layers,
  Search,
  CheckSquare,
  LucideIcon,
} from "lucide-react";

export interface StepDefinition {
  id: number;
  key: string;
  title: string;
  shortDesc: string;
  icon: LucideIcon;
  details: string;
}

export const stepsList: StepDefinition[] = [
  {
    id: 1,
    key: "personalInfo",
    title: "Personal Information",
    shortDesc: "Name, bio & photo",
    icon: User,
    details: "Provide your public contact details, a professional summary bio, and avatar/photo representing your brand.",
  },
  {
    id: 2,
    key: "businessIdentity",
    title: "Business Identity",
    shortDesc: "Brand name & logo",
    icon: Briefcase,
    details: "Enter your legal or freelance business name, tagline, logo files, and address structure.",
  },
  {
    id: 3,
    key: "professionalStory",
    title: "Professional Story",
    shortDesc: "Your background",
    icon: BookOpen,
    details: "Tell your unique journey, career mission statement, and core values to engage visitors.",
  },
  {
    id: 4,
    key: "services",
    title: "Services",
    shortDesc: "What you offer",
    icon: Sparkles,
    details: "List your service offerings, packages, pricing tiers, and service delivery methods.",
  },
  {
    id: 5,
    key: "projects",
    title: "Projects",
    shortDesc: "Portfolio showcase",
    icon: FolderKanban,
    details: "Add detailed project descriptions, technology tags, image screenshots, and external links.",
  },
  {
    id: 6,
    key: "experience",
    title: "Experience",
    shortDesc: "Work history",
    icon: History,
    details: "Outline your chronological professional career path, positions, achievements, and companies.",
  },
  {
    id: 7,
    key: "education",
    title: "Education",
    shortDesc: "Academics",
    icon: GraduationCap,
    details: "Document your academic degrees, certifications, continuous courses, and bootcamps.",
  },
  {
    id: 8,
    key: "skills",
    title: "Skills",
    shortDesc: "Core capabilities",
    icon: Cpu,
    details: "Group your expertise into technical domains, tools, libraries, and soft skills.",
  },
  {
    id: 9,
    key: "testimonials",
    title: "Testimonials",
    shortDesc: "Client reviews",
    icon: MessageSquare,
    details: "Display endorsements, recommendations from colleagues, and positive feedback from clients.",
  },
  {
    id: 10,
    key: "socialLinks",
    title: "Social Links",
    shortDesc: "Digital profiles",
    icon: Share2,
    details: "Connect your profiles (GitHub, LinkedIn, Twitter, etc.) to link your digital footprints.",
  },
  {
    id: 11,
    key: "websitePreferences",
    title: "Website Preferences",
    shortDesc: "Themes & colors",
    icon: Palette,
    details: "Configure the color scheme, typography family, navigation layouts, and dark mode controls.",
  },
  {
    id: 12,
    key: "extraPages",
    title: "Extra Pages",
    shortDesc: "Additional sections",
    icon: Layers,
    details: "Prepare configuration for auxiliary pages like FAQ, Terms of Service, or custom text segments.",
  },
  {
    id: 13,
    key: "seoInfo",
    title: "SEO Information",
    shortDesc: "Search visibility",
    icon: Search,
    details: "Define site title formats, meta keywords, page meta descriptions, and analytics tracking IDs.",
  },
  {
    id: 14,
    key: "websiteReview",
    title: "Website Review",
    shortDesc: "Review & finalize",
    icon: CheckSquare,
    details: "Audit completed steps, view structural layout analysis, and build your draft website layout.",
  },
];
