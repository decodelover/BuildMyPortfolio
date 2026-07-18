import { db } from "@/lib/firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { WebsiteManifest } from "./types";

export class ManifestBuilder {
  
  public static async buildAndPersist(
    manifestId: string,
    userId: string,
    builderId: string,
    planId: string,
    compilerOutputData: any
  ): Promise<WebsiteManifest> {
    const rawManifest = compilerOutputData.manifest;
    if (!rawManifest) {
      throw new Error("Compiler output does not contain website manifest structure.");
    }

    const manifest: WebsiteManifest = {
      ...rawManifest,
      manifestId,
      userId,
      builderId,
      planId,
      metadata: {
        ...rawManifest.metadata,
        compiledAt: new Date().toISOString()
      }
    };

    const manifestRef = doc(db, "websiteManifests", manifestId);
    await setDoc(manifestRef, manifest);

    return manifest;
  }
}
