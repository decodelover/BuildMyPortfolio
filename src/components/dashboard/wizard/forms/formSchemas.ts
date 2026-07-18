import { z } from "zod";

// Step 1: Personal Info
export const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  headline: z.string().min(1, "Professional Headline is required"),
  profession: z.string().min(1, "Profession is required"),
  specialization: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  state: z.string().optional(),
  city: z.string().optional(),
  timezone: z.string().optional(),
  yearsOfExperience: z.union([z.string(), z.number()]).optional(),
  currentCompany: z.string().optional(),
  employmentStatus: z.string().optional(),
  availability: z.string().optional(),
  spokenLanguages: z.string().optional(),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  photoUrl: z.string().optional(),
  resumeUrl: z.string().optional(),
});

export type PersonalInfoData = z.infer<typeof personalInfoSchema>;

// Step 2: Business Identity
export const businessIdentitySchema = z.object({
  brandName: z.string().min(1, "Personal Brand Name is required"),
  agencyName: z.string().optional(),
  websiteTitle: z.string().min(1, "Website Title is required"),
  websiteTagline: z.string().optional(),
  missionStatement: z.string().optional(),
  visionStatement: z.string().optional(),
  coreValues: z.string().optional(),
  personalMotto: z.string().optional(),
  elevatorPitch: z.string().optional(),
});

export type BusinessIdentityData = z.infer<typeof businessIdentitySchema>;

// Step 3: Professional Story
export const professionalStorySchema = z.object({
  aboutMe: z.string().min(10, "About Me section must be at least 10 characters"),
  journey: z.string().optional(),
  careerStory: z.string().optional(),
  passion: z.string().optional(),
  strengths: z.string().optional(),
  philosophy: z.string().optional(),
  goals: z.string().optional(),
  funFacts: z.string().optional(),
});

export type ProfessionalStoryData = z.infer<typeof professionalStorySchema>;

// Step 4: Services
export const serviceSchema = z.object({
  name: z.string().min(1, "Service Name is required"),
  category: z.string().optional(),
  shortDesc: z.string().min(1, "Short Description is required"),
  detailedDesc: z.string().optional(),
  deliverables: z.string().optional(),
  timeline: z.string().optional(),
  startingPrice: z.union([z.string(), z.number()]).optional(),
  technologies: z.string().optional(),
  isFeatured: z.boolean(),
});

export const servicesSchema = z.object({
  services: z.array(serviceSchema),
});

export type ServiceData = z.infer<typeof serviceSchema>;
export type ServicesListData = z.infer<typeof servicesSchema>;

// Step 5: Projects
export const projectSchema = z.object({
  name: z.string().min(1, "Project Name is required"),
  summary: z.string().min(1, "Short Summary is required"),
  description: z.string().optional(),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  results: z.string().optional(),
  technologies: z.string().optional(),
  githubUrl: z.union([z.string().url("Invalid URL"), z.string().length(0)]).optional(),
  liveUrl: z.union([z.string().url("Invalid URL"), z.string().length(0)]).optional(),
  coverImage: z.string().optional(),
  images: z.array(z.string()),
  clientName: z.string().optional(),
  industry: z.string().optional(),
  completionDate: z.string().optional(),
  isFeatured: z.boolean(),
  teamSize: z.union([z.string(), z.number()]).optional(),
  role: z.string().optional(),
});

export const projectsSchema = z.object({
  projects: z.array(projectSchema),
});

export type ProjectData = z.infer<typeof projectSchema>;
export type ProjectsListData = z.infer<typeof projectsSchema>;

// Step 6: Work Experience
export const experienceItemSchema = z.object({
  company: z.string().min(1, "Company Name is required"),
  position: z.string().min(1, "Position is required"),
  employmentType: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start Date is required"),
  endDate: z.string().optional(),
  currentlyWorking: z.boolean(),
  responsibilities: z.string().optional(),
  achievements: z.string().optional(),
  technologies: z.string().optional(),
});

export const experienceSchema = z.object({
  experience: z.array(experienceItemSchema),
});

export type ExperienceItemData = z.infer<typeof experienceItemSchema>;
export type ExperienceListData = z.infer<typeof experienceSchema>;

// Step 7: Education & Certifications
export const educationItemSchema = z.object({
  school: z.string().min(1, "School Name is required"),
  degree: z.string().min(1, "Degree/Field is required"),
  field: z.string().optional(),
  graduationDate: z.string().optional(),
});

export const certificationItemSchema = z.object({
  name: z.string().min(1, "Certification Name is required"),
  issuer: z.string().min(1, "Issuer Name is required"),
  date: z.string().optional(),
  url: z.union([z.string().url("Invalid URL"), z.string().length(0)]).optional(),
  certificatePdfUrl: z.string().optional(),
});

export const awardItemSchema = z.object({
  title: z.string().min(1, "Award Title is required"),
  organization: z.string().optional(),
  date: z.string().optional(),
});

export const bootcampItemSchema = z.object({
  name: z.string().min(1, "Bootcamp Name is required"),
  provider: z.string().optional(),
  date: z.string().optional(),
});

export const courseItemSchema = z.object({
  name: z.string().min(1, "Course Name is required"),
  provider: z.string().optional(),
});

export const membershipItemSchema = z.object({
  organization: z.string().min(1, "Organization Name is required"),
  role: z.string().optional(),
});

export const educationSchema = z.object({
  education: z.array(educationItemSchema),
  certifications: z.array(certificationItemSchema),
  awards: z.array(awardItemSchema),
  bootcamps: z.array(bootcampItemSchema),
  courses: z.array(courseItemSchema),
  memberships: z.array(membershipItemSchema),
});

export type EducationItemData = z.infer<typeof educationItemSchema>;
export type CertificationItemData = z.infer<typeof certificationItemSchema>;
export type EducationListData = z.infer<typeof educationSchema>;

// Step 8: Skills & Technologies
export const skillItemSchema = z.object({
  name: z.string().min(1, "Skill Name is required"),
  yearsExperience: z.union([z.string(), z.number()]).optional(),
  level: z.enum(["Beginner", "Intermediate", "Expert"]),
  isFeatured: z.boolean(),
});

export const skillsSchema = z.object({
  frontend: z.array(skillItemSchema),
  backend: z.array(skillItemSchema),
  mobile: z.array(skillItemSchema),
  cloud: z.array(skillItemSchema),
  devops: z.array(skillItemSchema),
  databases: z.array(skillItemSchema),
  programmingLanguages: z.array(skillItemSchema),
  frameworks: z.array(skillItemSchema),
  libraries: z.array(skillItemSchema),
  testing: z.array(skillItemSchema),
  uiux: z.array(skillItemSchema),
  ai: z.array(skillItemSchema),
  machineLearning: z.array(skillItemSchema),
  cybersecurity: z.array(skillItemSchema),
  tools: z.array(skillItemSchema),
  softSkills: z.array(skillItemSchema),
});

export type SkillItemData = z.infer<typeof skillItemSchema>;
export type SkillsListData = z.infer<typeof skillsSchema>;

// Step 9: Testimonials
export const testimonialItemSchema = z.object({
  clientName: z.string().min(1, "Client Name is required"),
  company: z.string().optional(),
  position: z.string().optional(),
  review: z.string().min(1, "Review text is required"),
  rating: z.number().min(1).max(5),
  photoUrl: z.string().optional(),
});

export const testimonialsSchema = z.object({
  testimonials: z.array(testimonialItemSchema),
});

export type TestimonialItemData = z.infer<typeof testimonialItemSchema>;
export type TestimonialsListData = z.infer<typeof testimonialsSchema>;

// Step 10: Social Links
export const socialLinksSchema = z.object({
  github: z.union([z.string().url("Invalid URL"), z.string().length(0)]).optional(),
  linkedin: z.union([z.string().url("Invalid URL"), z.string().length(0)]).optional(),
  twitter: z.union([z.string().url("Invalid URL"), z.string().length(0)]).optional(),
  facebook: z.union([z.string().url("Invalid URL"), z.string().length(0)]).optional(),
  instagram: z.union([z.string().url("Invalid URL"), z.string().length(0)]).optional(),
  youtube: z.union([z.string().url("Invalid URL"), z.string().length(0)]).optional(),
  behance: z.union([z.string().url("Invalid URL"), z.string().length(0)]).optional(),
  dribbble: z.union([z.string().url("Invalid URL"), z.string().length(0)]).optional(),
  hashnode: z.union([z.string().url("Invalid URL"), z.string().length(0)]).optional(),
  devto: z.union([z.string().url("Invalid URL"), z.string().length(0)]).optional(),
  medium: z.union([z.string().url("Invalid URL"), z.string().length(0)]).optional(),
  stackOverflow: z.union([z.string().url("Invalid URL"), z.string().length(0)]).optional(),
  discord: z.union([z.string().url("Invalid URL"), z.string().length(0)]).optional(),
  telegram: z.union([z.string().url("Invalid URL"), z.string().length(0)]).optional(),
  whatsapp: z.string().optional(),
  portfolio: z.union([z.string().url("Invalid URL"), z.string().length(0)]).optional(),
  calendly: z.union([z.string().url("Invalid URL"), z.string().length(0)]).optional(),
});

export type SocialLinksData = z.infer<typeof socialLinksSchema>;

// Step 11: Website Preferences
export const websitePreferencesSchema = z.object({
  theme: z.string(),
  navigationStyle: z.string(),
  headerLayout: z.string(),
  footerLayout: z.string(),
  animationStyle: z.string(),
  borderRadius: z.string(),
  colorPalette: z.string(),
  typography: z.string(),
  defaultTheme: z.string(),
});

export type WebsitePreferencesData = z.infer<typeof websitePreferencesSchema>;

// Step 12: Extra Website Pages
export const extraPagesSchema = z.object({
  blog: z.boolean(),
  faq: z.boolean(),
  gallery: z.boolean(),
  resume: z.boolean(),
  testimonials: z.boolean(),
  services: z.boolean(),
  caseStudies: z.boolean(),
  pricing: z.boolean(),
  privacy: z.boolean(),
  terms: z.boolean(),
  contactForm: z.boolean(),
  newsletter: z.boolean(),
});

export type ExtraPagesData = z.infer<typeof extraPagesSchema>;

// Step 13: SEO Information
export const seoInfoSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  targetCountry: z.string().optional(),
  targetAudience: z.string().optional(),
  ogImageUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
  googleConsoleId: z.string().optional(),
});

export type SEOInfoData = z.infer<typeof seoInfoSchema>;

// Step 14: Website Review (schema matches the final review state)
export const websiteReviewSchema = z.object({});
export type WebsiteReviewData = z.infer<typeof websiteReviewSchema>;
