import { SubscriptionPlan } from "../types";

export class BillingConfig {
  public static readonly engineVersion = "1.0.0";

  public static readonly trialDurationDays = 14;

  public static readonly gracePeriodDays = 3;

  public static readonly defaultCurrency = "USD";

  public static readonly defaultTaxRatePercentage = 0; // Standard 0% VAT fallback

  public static readonly plans: SubscriptionPlan[] = [
    {
      planId: "free",
      name: "Free Tier",
      description: "Ideal for student portfolios and quick resume sites.",
      monthlyPriceUsd: 0,
      yearlyPriceUsd: 0,
      currency: "USD",
      limits: {
        portfoliosCount: 1,
        aiCreditsPerMonth: 50,
        storageMb: 100,
        customDomainsCount: 0,
        publishingCountPerMonth: 2,
        teamMembersCount: 1,
        apiAccess: false,
        premiumThemes: false,
        removeWatermark: false
      }
    },
    {
      planId: "starter",
      name: "Starter",
      description: "For freelancers and creative professionals starting out.",
      monthlyPriceUsd: 9,
      yearlyPriceUsd: 90,
      currency: "USD",
      limits: {
        portfoliosCount: 3,
        aiCreditsPerMonth: 500,
        storageMb: 2048, // 2GB
        customDomainsCount: 1,
        publishingCountPerMonth: 10,
        teamMembersCount: 1,
        apiAccess: false,
        premiumThemes: true,
        removeWatermark: true
      }
    },
    {
      planId: "professional",
      name: "Professional",
      description: "For established engineers, designers, and consultants.",
      monthlyPriceUsd: 29,
      yearlyPriceUsd: 290,
      currency: "USD",
      isPopular: true,
      limits: {
        portfoliosCount: 10,
        aiCreditsPerMonth: 2500,
        storageMb: 10240, // 10GB
        customDomainsCount: 3,
        publishingCountPerMonth: 50,
        teamMembersCount: 3,
        apiAccess: false,
        premiumThemes: true,
        removeWatermark: true
      }
    },
    {
      planId: "business",
      name: "Business",
      description: "For agency teams, studios, and high-volume creators.",
      monthlyPriceUsd: 79,
      yearlyPriceUsd: 790,
      currency: "USD",
      limits: {
        portfoliosCount: 25,
        aiCreditsPerMonth: 10000,
        storageMb: 51200, // 50GB
        customDomainsCount: 10,
        publishingCountPerMonth: 200,
        teamMembersCount: 10,
        apiAccess: true,
        premiumThemes: true,
        removeWatermark: true
      }
    },
    {
      planId: "enterprise",
      name: "Enterprise",
      description: "Custom scalability, unlimited portfolios, and dedicated SLA.",
      monthlyPriceUsd: 199,
      yearlyPriceUsd: 1990,
      currency: "USD",
      limits: {
        portfoliosCount: 999,
        aiCreditsPerMonth: 50000,
        storageMb: 512000, // 500GB
        customDomainsCount: 99,
        publishingCountPerMonth: 9999,
        teamMembersCount: 99,
        apiAccess: true,
        premiumThemes: true,
        removeWatermark: true
      }
    }
  ];
}
