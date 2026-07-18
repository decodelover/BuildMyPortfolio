import { create } from "zustand";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";

export type DraftStatus = "draft" | "archived" | "completed" | "published";
export type AutosaveStatus = "saved" | "saving" | "offline" | "error";

export interface WebsiteBuilderState {
  builderId: string | null;
  userId: string | null;
  currentStep: number;
  completedSteps: number[];
  draftStatus: DraftStatus;
  completionPercentage: number;
  autosaveState: AutosaveStatus;
  unsavedChanges: boolean;
  validationState: Record<number, boolean>;
  loading: boolean;
  error: string | null;
  websiteData: Record<string, any>;

  // Actions
  setCurrentStep: (step: number) => Promise<void>;
  updateWebsiteData: (stepKey: string, data: any) => void;
  markStepCompleted: (step: number) => void;
  markStepIncomplete: (step: number) => void;
  setAutosaveState: (state: AutosaveStatus) => void;
  setUnsavedChanges: (hasChanges: boolean) => void;
  setValidationState: (step: number, isValid: boolean) => void;
  loadBuilderDraft: (userId: string) => Promise<void>;
  saveBuilderDraft: (forced?: boolean) => Promise<void>;
  archiveBuilderDraft: () => Promise<void>;
  completeBuilderDraft: () => Promise<void>;
  resetStore: () => void;
}

let saveTimeout: NodeJS.Timeout | null = null;

const TOTAL_STEPS = 14;

// Key mapping for each step
export const stepKeys: Record<number, string> = {
  1: "personalInfo",
  2: "businessIdentity",
  3: "professionalStory",
  4: "services",
  5: "projects",
  6: "experience",
  7: "education",
  8: "skills",
  9: "testimonials",
  10: "socialLinks",
  11: "websitePreferences",
  12: "extraPages",
  13: "seoInfo",
  14: "websiteReview",
};

export const useWebsiteBuilderStore = create<WebsiteBuilderState>((set, get) => ({
  builderId: null,
  userId: null,
  currentStep: 1,
  completedSteps: [],
  draftStatus: "draft",
  completionPercentage: 0,
  autosaveState: "saved",
  unsavedChanges: false,
  validationState: {},
  loading: false,
  error: null,
  websiteData: {},

  setCurrentStep: async (step) => {
    if (step < 1 || step > TOTAL_STEPS) return;
    
    // Save current state immediately before shifting step
    if (get().unsavedChanges) {
      if (saveTimeout) clearTimeout(saveTimeout);
      await get().saveBuilderDraft(true);
    }
    
    set({ currentStep: step });
  },

  updateWebsiteData: (stepKey, data) => {
    const currentData = get().websiteData;
    const updatedData = {
      ...currentData,
      [stepKey]: {
        ...currentData[stepKey],
        ...data,
      },
    };

    set({
      websiteData: updatedData,
      unsavedChanges: true,
      autosaveState: "saving",
    });

    // Automatically trigger debounced save
    if (saveTimeout) clearTimeout(saveTimeout);
    
    const isOnline = typeof window !== "undefined" ? window.navigator.onLine : true;
    if (!isOnline) {
      set({ autosaveState: "offline" });
      return;
    }

    saveTimeout = setTimeout(async () => {
      await get().saveBuilderDraft();
    }, 3000);
  },

  markStepCompleted: (step) => {
    const completed = get().completedSteps;
    if (!completed.includes(step)) {
      const updated = [...completed, step].sort((a, b) => a - b);
      const pct = Math.round((updated.length / TOTAL_STEPS) * 100);
      set({
        completedSteps: updated,
        completionPercentage: pct,
        unsavedChanges: true,
        autosaveState: "saving",
      });
      
      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(async () => {
        await get().saveBuilderDraft();
      }, 3000);
    }
  },

  markStepIncomplete: (step) => {
    const completed = get().completedSteps;
    if (completed.includes(step)) {
      const updated = completed.filter((s) => s !== step);
      const pct = Math.round((updated.length / TOTAL_STEPS) * 100);
      set({
        completedSteps: updated,
        completionPercentage: pct,
        unsavedChanges: true,
        autosaveState: "saving",
      });

      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(async () => {
        await get().saveBuilderDraft();
      }, 3000);
    }
  },

  setAutosaveState: (state) => set({ autosaveState: state }),
  
  setUnsavedChanges: (hasChanges) => set({ unsavedChanges: hasChanges }),

  setValidationState: (step, isValid) => {
    set((state) => ({
      validationState: {
        ...state.validationState,
        [step]: isValid,
      },
    }));
  },

  loadBuilderDraft: async (userId) => {
    set({ loading: true, error: null, userId });
    try {
      const q = query(
        collection(db, "websiteBuilders"),
        where("userId", "==", userId),
        where("status", "==", "draft")
      );
      const snapshot = await getDocs(q);
      
      let activeDraft: any = null;
      let activeDraftId: string | null = null;

      if (!snapshot.empty) {
        // Find latest updated draft document in memory to avoid composite index query requirements
        const docs = snapshot.docs.map((d) => ({
          id: d.id,
          data: d.data(),
          updatedAt: (d.data().updatedAt as Timestamp)?.toMillis() || 0,
        }));
        docs.sort((a, b) => b.updatedAt - a.updatedAt);
        activeDraft = docs[0].data;
        activeDraftId = docs[0].id;
      }

      if (activeDraftId && activeDraft) {
        // Restore existing draft
        const pct = Math.round(((activeDraft.completedSteps || []).length / TOTAL_STEPS) * 100);
        set({
          builderId: activeDraftId,
          currentStep: activeDraft.currentStep || 1,
          completedSteps: activeDraft.completedSteps || [],
          draftStatus: activeDraft.status || "draft",
          completionPercentage: pct,
          websiteData: activeDraft.websiteData || {},
          unsavedChanges: false,
          autosaveState: "saved",
          loading: false,
        });
      } else {
        // Create new draft
        const newBuilderRef = doc(collection(db, "websiteBuilders"));
        const newBuilderId = newBuilderRef.id;
        const newDraft = {
          builderId: newBuilderId,
          userId,
          status: "draft" as const,
          currentStep: 1,
          completedSteps: [],
          completionPercentage: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          websiteData: {},
        };

        await setDoc(newBuilderRef, newDraft);

        set({
          builderId: newBuilderId,
          currentStep: 1,
          completedSteps: [],
          draftStatus: "draft",
          completionPercentage: 0,
          websiteData: {},
          unsavedChanges: false,
          autosaveState: "saved",
          loading: false,
        });
      }
    } catch (err: any) {
      console.error("Failed to load website builder draft:", err);
      set({
        error: err.message || "Failed to load builder session. Please check your network.",
        loading: false,
      });
    }
  },

  saveBuilderDraft: async (forced = false) => {
    const { builderId, unsavedChanges, currentStep, completedSteps, websiteData } = get();
    if (!builderId) return;

    const isOnline = typeof window !== "undefined" ? window.navigator.onLine : true;
    if (!isOnline) {
      set({ autosaveState: "offline" });
      return;
    }

    if (!unsavedChanges && !forced) {
      return;
    }

    set({ autosaveState: "saving" });

    try {
      const builderRef = doc(db, "websiteBuilders", builderId);
      const pct = Math.round((completedSteps.length / TOTAL_STEPS) * 100);
      await updateDoc(builderRef, {
        currentStep,
        completedSteps,
        completionPercentage: pct,
        websiteData,
        updatedAt: serverTimestamp(),
      });

      set({
        autosaveState: "saved",
        unsavedChanges: false,
        completionPercentage: pct,
      });
    } catch (err: any) {
      console.error("Failed to autosave website builder draft:", err);
      set({ autosaveState: "error" });
    }
  },

  archiveBuilderDraft: async () => {
    const { builderId } = get();
    if (!builderId) return;

    set({ loading: true });
    try {
      const builderRef = doc(db, "websiteBuilders", builderId);
      await updateDoc(builderRef, {
        status: "archived" as const,
        updatedAt: serverTimestamp(),
      });
      set({ draftStatus: "archived", loading: false });
    } catch (err: any) {
      console.error("Failed to archive builder session:", err);
      set({ error: err.message || "Failed to archive session.", loading: false });
      throw err;
    }
  },

  completeBuilderDraft: async () => {
    const { builderId } = get();
    if (!builderId) return;

    set({ loading: true });
    try {
      const builderRef = doc(db, "websiteBuilders", builderId);
      await updateDoc(builderRef, {
        status: "completed" as const,
        updatedAt: serverTimestamp(),
      });
      set({ draftStatus: "completed", loading: false });
    } catch (err: any) {
      console.error("Failed to complete builder session:", err);
      set({ error: err.message || "Failed to finalize session.", loading: false });
      throw err;
    }
  },

  resetStore: () => {
    if (saveTimeout) clearTimeout(saveTimeout);
    set({
      builderId: null,
      userId: null,
      currentStep: 1,
      completedSteps: [],
      draftStatus: "draft",
      completionPercentage: 0,
      autosaveState: "saved",
      unsavedChanges: false,
      validationState: {},
      loading: false,
      error: null,
      websiteData: {},
    });
  },
}));
