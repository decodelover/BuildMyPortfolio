import { SubscriptionPlan } from "../types";
import { PLAN_DEFINITIONS } from "../plans/plan-definitions";

export class BillingConfig {
  public static readonly engineVersion = "2.0.0";

  public static readonly trialDurationDays = 14;

  public static readonly gracePeriodDays = 7;

  public static readonly defaultCurrency = "USD";

  public static readonly defaultTaxRatePercentage = 0;

  public static readonly plans: SubscriptionPlan[] = [
    PLAN_DEFINITIONS.FREE,
    PLAN_DEFINITIONS.PRO,
    PLAN_DEFINITIONS.BUSINESS,
  ];
}
