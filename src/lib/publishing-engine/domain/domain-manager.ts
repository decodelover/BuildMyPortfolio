import { CustomDomainConfig } from "../types";
import { DNSManager } from "./dns-manager";
import { PublishingConfig } from "../config/publishing-config";

export class DomainManager {
  public static resolveDomainConfig(builderId: string, customDomainInput?: string): CustomDomainConfig {
    if (!customDomainInput) {
      const subdomain = `${builderId}.${PublishingConfig.baseDomain}`;
      return {
        domain: subdomain,
        isCustom: false,
        dnsRecords: [],
        sslStatus: "active",
        enforceHttps: true,
        redirectWww: false,
        verifiedAt: new Date().toISOString()
      };
    }

    const cleanDomain = customDomainInput.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
    const dnsRecords = DNSManager.generateVerificationRecords(cleanDomain);

    return {
      domain: cleanDomain,
      isCustom: true,
      dnsRecords,
      sslStatus: "pending_dns",
      enforceHttps: true,
      redirectWww: true
    };
  }

  public static verifyCustomDomain(domainConfig: CustomDomainConfig): CustomDomainConfig {
    if (!domainConfig.isCustom) return domainConfig;

    const verifiedRecords = domainConfig.dnsRecords.map((rec) => ({
      ...rec,
      status: "verified" as const
    }));

    return {
      ...domainConfig,
      dnsRecords: verifiedRecords,
      sslStatus: "active",
      verifiedAt: new Date().toISOString()
    };
  }
}
