import { CustomDomainConfig, SSLStatus } from "../types";

export class SSLManager {
  public static checkSSLStatus(domainConfig: CustomDomainConfig): SSLStatus {
    if (!domainConfig.isCustom) return "active";

    const allDnsVerified = domainConfig.dnsRecords.every((r) => r.status === "verified");
    return allDnsVerified ? "active" : "pending_dns";
  }
}
