export type DeploymentPlatform = "vercel" | "firebase-hosting" | "static-export";

export type DeploymentEnvironment = "preview" | "production";

export type DeploymentStatus = "pending" | "validating" | "building" | "deploying" | "published" | "failed" | "rolled_back";

export type SSLStatus = "active" | "pending_dns" | "provisioning" | "failed";

export interface DNSRecord {
  type: "CNAME" | "A" | "TXT";
  name: string;
  value: string;
  status: "verified" | "unverified";
}

export interface CustomDomainConfig {
  domain: string;
  isCustom: boolean;
  dnsRecords: DNSRecord[];
  sslStatus: SSLStatus;
  enforceHttps: boolean;
  redirectWww: boolean;
  verifiedAt?: string;
}

export interface DeploymentRecord {
  deploymentId: string;
  builderId: string;
  userId: string;
  planId: string;
  version: string;
  platform: DeploymentPlatform;
  environment: DeploymentEnvironment;
  status: DeploymentStatus;
  url: string;
  customDomain?: CustomDomainConfig;
  durationMs: number;
  deployedAt: string;
}

export interface ReleaseVersion {
  versionId: string;
  builderId: string;
  versionCode: string; // e.g. "v1.0.0"
  deploymentId: string;
  url: string;
  isCurrent: boolean;
  releaseNotes: string;
  createdAt: string;
}

export interface SEOAssetsReport {
  sitemapGenerated: boolean;
  sitemapUrl: string;
  robotsTxtGenerated: boolean;
  robotsTxtUrl: string;
  canonicalUrl: string;
}

export interface SecurityHeadersReport {
  hstsEnabled: boolean;
  cspConfigured: boolean;
  xssProtection: boolean;
  frameOptions: string;
}

export interface PublicationReport {
  publicationId: string;
  builderId: string;
  userId: string;
  deployment: DeploymentRecord;
  version: ReleaseVersion;
  seoAssets: SEOAssetsReport;
  security: SecurityHeadersReport;
  durationMs: number;
  warnings: string[];
  errors: string[];
  publishedAt: string;
}

export interface PublishingOptions {
  platform?: DeploymentPlatform;
  environment?: DeploymentEnvironment;
  customDomain?: string;
  releaseNotes?: string;
}
