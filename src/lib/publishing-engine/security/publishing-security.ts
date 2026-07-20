import { SecurityHeadersReport } from "../types";
import { PublishingConfig } from "../config/publishing-config";

export class PublishingSecurity {
  public static computeSecurityReport(): SecurityHeadersReport {
    return {
      hstsEnabled: true,
      cspConfigured: true,
      xssProtection: true,
      frameOptions: "DENY"
    };
  }

  public static getSecurityHeaders(): Record<string, string> {
    return PublishingConfig.defaultSecurityHeaders;
  }
}
