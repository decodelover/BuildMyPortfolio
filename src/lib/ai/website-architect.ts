import { db } from "@/lib/firebase/firestore";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { WebsiteGenerationPlan, PlanValidationResult } from "./architect-types";
import { resolveTheme, resolveColorPalette, resolveTypography, resolveBranding } from "./theme-engine";
import { buildPageArchitecture, buildNavigationConfig } from "./page-planner";
import { buildPromptTemplates } from "./prompt-templates";
import { validatePlan } from "./plan-validator";

interface ArchitectInput {
  builderId: string;
  userId: string;
  websiteData: Record<string, any>;
  aiBlueprint: any;
}

interface ArchitectOutput {
  planId: string;
  plan: WebsiteGenerationPlan;
  validationResult: PlanValidationResult;
}

/**
 * Orchestrates the creation of a full structured Website Generation Plan based on user wizard inputs
 * and AI Blueprint analysis. Saves the resolved plan to Firestore.
 */
export async function createWebsiteGenerationPlan({
  builderId,
  userId,
  websiteData,
  aiBlueprint
}: ArchitectInput): Promise<ArchitectOutput> {
  const personal = websiteData.personalInfo || {};
  const business = websiteData.businessIdentity || {};
  const prefs = websiteData.websitePreferences || {};

  // 1. Resolve Theme and Visual Settings
  const profession = personal.profession || "Expert";
  const resolvedThemeId = resolveTheme(profession, prefs.theme);
  const branding = resolveBranding(
    resolvedThemeId,
    business.brandName || personal.fullName || "My Brand",
    business.websiteTitle || `${personal.fullName || "My"} Portfolio`,
    business.websiteTagline || personal.headline,
    prefs.borderRadius
  );
  const palette = resolveColorPalette(resolvedThemeId, prefs.colorPalette);
  const typography = resolveTypography(resolvedThemeId, prefs.typography);

  // 2. Resolve Page and Layout Structure
  const pages = buildPageArchitecture(websiteData, aiBlueprint);
  const navigation = buildNavigationConfig(pages, prefs);

  // 3. Generate parameterized future copywriting prompts
  const promptTemplates = buildPromptTemplates();

  // 4. Assemble draft Plan
  const planDraft: Omit<WebsiteGenerationPlan, "planId" | "createdAt" | "updatedAt"> = {
    builderId,
    userId,
    status: "draft", // Starts as draft until validated
    branding,
    palette,
    typography,
    pages,
    navigation,
    promptTemplates
  };

  // 5. Run Validation
  const validationResult = validatePlan(planDraft as WebsiteGenerationPlan);
  
  // Set target state based on validation validity
  const finalStatus = validationResult.isValid ? "planned" : "draft";

  // 6. Persist Plan document to Firestore 'websitePlans' collection
  const planDocData = {
    ...planDraft,
    status: finalStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, "websitePlans"), planDocData);

  return {
    planId: docRef.id,
    plan: {
      ...planDocData,
      planId: docRef.id,
      createdAt: new Date(),
      updatedAt: new Date()
    } as WebsiteGenerationPlan,
    validationResult
  };
}
