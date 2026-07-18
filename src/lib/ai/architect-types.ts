export type WebsitePlanStatus = "draft" | "planned" | "ready_for_generation";

export interface ColorPalette {
  primary: string;      // Primary brand hex code
  secondary: string;    // Secondary brand hex code
  accent: string;       // Accent brand hex code
  background: string;   // Page background hex code
  cardBg: string;       // Component card background hex code
  border: string;       // Component border hex code
  textPrimary: string;  // Main copy text hex code
  textSecondary: string;// Secondary copy text hex code
}

export interface TypographyConfig {
  headingsFont: string; // E.g., 'Inter', 'Outfit', 'Playfair Display'
  bodyFont: string;     // E.g., 'Inter', 'Roboto'
  monoFont: string;     // E.g., 'Fira Code'
  headingScale: string; // E.g., 'minor-third', 'major-third'
  baseFontSize: string; // E.g., '16px'
}

export interface BrandingConfig {
  brandName: string;
  websiteTitle: string;
  websiteTagline?: string;
  selectedThemeId: string;
  borderRadius: string;  // E.g., '0px', '4px', '8px', '16px', '9999px'
  logoPlacement: "left" | "center" | "hidden";
  toneDescriptors: string[]; // E.g., ['Professional', 'Tech-focused']
}

export interface SEOMetadataPlan {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogType: "website" | "profile";
  structuredDataHint: "Person" | "LocalBusiness" | "Organization";
}

export interface ContentGenerationRequirement {
  sectionKey: string;
  promptIntent: string;       // Purpose of the section
  targetWordCount: number;
  toneDirective: string;
  inputVariablesUsed: string[]; // Which wizard fields this section requires
}

export interface PlanSection {
  id: string;
  type: string;                 // E.g. 'hero', 'about', 'services', 'projects', 'experience', 'testimonials', 'contact'
  componentSuggestion: string;  // E.g. 'hero-split', 'projects-grid-featured'
  title: string;
  subtitle?: string;
  orderWeight: number;
  contentRequirement?: ContentGenerationRequirement;
}

export interface ResponsiveStrategy {
  mobileFirst: boolean;
  stackingBreakpoints: string[]; // E.g. ['sm', 'md']
  columnLayouts: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export interface PlanPage {
  name: string;
  slug: string;
  priority: "essential" | "recommended" | "optional";
  description: string;
  sections: PlanSection[];
  seoPlan: SEOMetadataPlan;
  responsiveStrategy: ResponsiveStrategy;
}

export interface NavigationConfig {
  navigationStyle: string; // E.g. 'Top Navbar', 'Side Navbar'
  menuItems: Array<{
    label: string;
    path: string;
    icon?: string;
  }>;
  ctaButton?: {
    label: string;
    actionType: "scroll_to_contact" | "external_link";
    target: string;
  };
  sticky: boolean;
}

export interface PromptTemplate {
  templateId: string;
  sectionType: string;
  systemPrompt: string;
  userPromptTemplate: string;
  variablesMap: Record<string, string>; // Maps template variables to wizard data path
}

export interface WebsiteGenerationPlan {
  planId: string;
  builderId: string;
  userId: string;
  status: WebsitePlanStatus;
  branding: BrandingConfig;
  palette: ColorPalette;
  typography: TypographyConfig;
  pages: PlanPage[];
  navigation: NavigationConfig;
  promptTemplates: PromptTemplate[];
  createdAt: Date | any;
  updatedAt: Date | any;
}

export interface PlanValidationResult {
  isValid: boolean;
  completenessScore: number; // 0 to 100
  errors: string[];
  warnings: string[];
}
