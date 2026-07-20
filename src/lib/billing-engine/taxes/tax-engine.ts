import { BillingConfig } from "../config/billing-config";

export class TaxEngine {
  public static calculateTax(subtotal: number, countryCode: string = "US"): { taxAmount: number; taxRatePercentage: number } {
    let taxRatePercentage = BillingConfig.defaultTaxRatePercentage;

    if (countryCode === "GB" || countryCode === "UK") taxRatePercentage = 20; // 20% UK VAT
    else if (countryCode === "DE" || countryCode === "FR") taxRatePercentage = 19; // 19% EU VAT
    else if (countryCode === "CA") taxRatePercentage = 5; // 5% GST

    const taxAmount = Math.round(((subtotal * taxRatePercentage) / 100) * 100) / 100;
    return { taxAmount, taxRatePercentage };
  }
}
