import { create } from "zustand";
import {
  PublicationReport,
  PublishingOptions,
  ReleaseVersion,
  CustomDomainConfig
} from "@/lib/publishing-engine/types";
import { PortfolioPublishingEngine } from "@/lib/publishing-engine/engine/portfolio-publishing-engine";
import { DomainManager } from "@/lib/publishing-engine/domain/domain-manager";
import { RollbackManager } from "@/lib/publishing-engine/versioning/rollback-manager";
import { PublishingVersionManager } from "@/lib/publishing-engine/versioning/version-manager";

export interface PublishingEngineStoreState {
  publishingStatus: "idle" | "publishing" | "published" | "failed";
  lastReport: PublicationReport | null;
  releaseHistory: ReleaseVersion[];
  customDomain: CustomDomainConfig | null;
  error: string | null;
  loading: boolean;

  // Actions
  publishPortfolio: (
    builderId: string,
    userId: string,
    planId: string,
    blueprintInput: any,
    options?: PublishingOptions
  ) => Promise<PublicationReport>;

  verifyCustomDomain: (builderId: string, customDomain: string) => CustomDomainConfig;
  rollbackToVersion: (builderId: string, versionId: string) => ReleaseVersion | null;
  resetPublishingStore: () => void;
}

export const usePublishingEngineStore = create<PublishingEngineStoreState>((set, get) => ({
  publishingStatus: "idle",
  lastReport: null,
  releaseHistory: [],
  customDomain: null,
  error: null,
  loading: false,

  publishPortfolio: async (builderId, userId, planId, blueprintInput, options) => {
    set({ publishingStatus: "publishing", loading: true, error: null });

    const report = await PortfolioPublishingEngine.publishPortfolio(
      builderId,
      userId,
      planId,
      blueprintInput,
      options
    );

    if (report.deployment.status === "published") {
      set({
        publishingStatus: "published",
        lastReport: report,
        releaseHistory: PublishingVersionManager.getReleaseHistory(builderId),
        customDomain: report.deployment.customDomain || null,
        loading: false
      });
    } else {
      set({
        publishingStatus: "failed",
        lastReport: report,
        error: report.errors.join("; ") || "Publication failed.",
        loading: false
      });
    }

    return report;
  },

  verifyCustomDomain: (builderId, customDomain) => {
    const initial = DomainManager.resolveDomainConfig(builderId, customDomain);
    const verified = DomainManager.verifyCustomDomain(initial);
    set({ customDomain: verified });
    return verified;
  },

  rollbackToVersion: (builderId, versionId) => {
    try {
      const activeRelease = RollbackManager.rollbackToVersion(builderId, versionId);
      set({
        releaseHistory: PublishingVersionManager.getReleaseHistory(builderId)
      });
      return activeRelease;
    } catch (err: any) {
      set({ error: err.message });
      return null;
    }
  },

  resetPublishingStore: () => {
    set({
      publishingStatus: "idle",
      lastReport: null,
      releaseHistory: [],
      customDomain: null,
      error: null,
      loading: false
    });
  }
}));
