import { SubscriptionPlan, PlanId } from "../types";

export const PLAN_DEFINITIONS: Record<string, SubscriptionPlan> = {
  FREE: {
    planId: "FREE",
    name: "Free",
    description: "Essential tools for students, job seekers, and single portfolio creation.",
    monthlyPriceUsd: 0,
    yearlyPriceUsd: 0,
    currency: "USD",
    features: [
      "1 Published Portfolio Site",
      "50 Monthly AI Generation Credits",
      "2 Monthly Resume Exports",
      "100 MB Media Storage",
      "Basic Portfolio Templates",
      "Community Support",
      "BuildMyPortfolio Branding",
      "Basic Analytics",
      "Basic Resume Builder",
    ],
    limits: {
      portfoliosCount: 1,
      aiCreditsPerMonth: 50,
      storageMb: 100,
      customDomainsCount: 0,
      publishingCountPerMonth: 2,
      resumeExportsPerMonth: 2,
      teamMembersCount: 1,
      apiAccess: false,
      premiumThemes: false,
      removeWatermark: false,
      customBranding: false,
      analyticsAccess: "basic",
      prioritySupport: "community",
    },
  },
  PRO: {
    planId: "PRO",
    name: "Pro",
    description: "Designed for active engineers, creators, and freelancers showcasing work.",
    monthlyPriceUsd: 39,
    yearlyPriceUsd: 390,
    currency: "USD",
    isPopular: true,
    features: [
      "5 Active Portfolios",
      "500 Monthly AI Generation Credits",
      "20 Monthly Resume Exports",
      "1 Custom Domain Connection",
      "5,000 MB (5 GB) Storage",
      "All Premium Templates Included",
      "Advanced Portfolio Customization",
      "Advanced Resume Builder",
      "Portfolio Version History",
      "SEO Optimization & Analytics",
      "Remove BuildMyPortfolio Branding",
      "Priority Email Support",
    ],
    limits: {
      portfoliosCount: 5,
      aiCreditsPerMonth: 500,
      storageMb: 5000,
      customDomainsCount: 1,
      publishingCountPerMonth: 20,
      resumeExportsPerMonth: 20,
      teamMembersCount: 1,
      apiAccess: false,
      premiumThemes: true,
      removeWatermark: true,
      customBranding: true,
      analyticsAccess: "advanced",
      prioritySupport: "email",
    },
  },
  BUSINESS: {
    planId: "BUSINESS",
    name: "Business",
    description: "For agency teams, studios, and high-volume creators managing clients.",
    monthlyPriceUsd: 79,
    yearlyPriceUsd: 790,
    currency: "USD",
    features: [
      "25 Active Portfolios",
      "2,500 Monthly AI Generation Credits",
      "Unlimited Resume Exports",
      "5 Custom Domain Connections",
      "25,000 MB (25 GB) Storage",
      "Team Workspaces (Up to 5 Members)",
      "Agency Dashboard & Client Management",
      "White Label Custom Branding",
      "Priority AI Generation Queue",
      "Enterprise Realtime Analytics",
      "API Access for Workflows",
      "24/7 Dedicated Priority Support",
    ],
    limits: {
      portfoliosCount: 25,
      aiCreditsPerMonth: 2500,
      storageMb: 25000,
      customDomainsCount: 5,
      publishingCountPerMonth: 100,
      resumeExportsPerMonth: 999,
      teamMembersCount: 5,
      apiAccess: true,
      premiumThemes: true,
      removeWatermark: true,
      customBranding: true,
      analyticsAccess: "enterprise",
      prioritySupport: "dedicated_24_7",
    },
  },
};

// Alias mappings for case insensitivity and legacy IDs
PLAN_DEFINITIONS.free = PLAN_DEFINITIONS.FREE;
PLAN_DEFINITIONS.pro = PLAN_DEFINITIONS.PRO;
PLAN_DEFINITIONS.starter = PLAN_DEFINITIONS.PRO;
PLAN_DEFINITIONS.professional = PLAN_DEFINITIONS.PRO;
PLAN_DEFINITIONS.business = PLAN_DEFINITIONS.BUSINESS;
PLAN_DEFINITIONS.enterprise = PLAN_DEFINITIONS.BUSINESS;

export class PlanDefinitions {
  public static getAllPlans(): SubscriptionPlan[] {
    return [PLAN_DEFINITIONS.FREE, PLAN_DEFINITIONS.PRO, PLAN_DEFINITIONS.BUSINESS];
  }

  public static getPlan(planId: PlanId | string): SubscriptionPlan {
    const normalizedKey = String(planId || "FREE").toUpperCase();
    const plan = PLAN_DEFINITIONS[normalizedKey] || PLAN_DEFINITIONS[String(planId).toLowerCase()] || PLAN_DEFINITIONS.FREE;
    return plan;
  }
}
