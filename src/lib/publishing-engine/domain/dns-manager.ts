import { DNSRecord } from "../types";
import { PublishingConfig } from "../config/publishing-config";

export class DNSManager {
  public static generateVerificationRecords(domain: string): DNSRecord[] {
    const isSubdomain = domain.split(".").length > 2;

    const records: DNSRecord[] = [];

    if (isSubdomain) {
      records.push({
        type: "CNAME",
        name: domain,
        value: PublishingConfig.dnsTargets.cname,
        status: "unverified"
      });
    } else {
      records.push({
        type: "A",
        name: "@",
        value: PublishingConfig.dnsTargets.ipA,
        status: "unverified"
      });
      records.push({
        type: "CNAME",
        name: "www",
        value: PublishingConfig.dnsTargets.cname,
        status: "unverified"
      });
    }

    records.push({
      type: "TXT",
      name: `_buildmyportfolio-challenge.${domain}`,
      value: `bmp-verify-${domain.replace(/[^a-zA-Z0-9]/g, "")}-${Date.now().toString(36)}`,
      status: "unverified"
    });

    return records;
  }
}
