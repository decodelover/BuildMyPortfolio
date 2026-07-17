import { create } from "zustand";
import {
  registerWithEmail,
  loginWithEmail,
  signOutUser,
  signInWithGoogle,
  signInWithGithub,
} from "@/lib/firebase/auth";
import {
  syncUserProfile,
  updateUserProfile,
  UserDocument,
  getUserProfile,
} from "@/lib/firebase/firestore";

interface AuthState {
  user: UserDocument | null;
  loading: boolean;
  setUser: (user: UserDocument | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, pass: string) => Promise<UserDocument>;
  loginWithGoogle: () => Promise<UserDocument>;
  loginWithGithub: () => Promise<UserDocument>;
  register: (email: string, pass: string, fullName: string) => Promise<UserDocument>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<Omit<UserDocument, "uid" | "createdAt" | "role" | "currentPlan">>) => Promise<void>;
}

// Helper to manage authentication cookies for Next.js Middleware guarding
const setAuthCookies = (token: string, role: string) => {
  if (typeof window !== "undefined") {
    const secure = window.location.protocol === "https:" ? "Secure;" : "";
    // Firebase Hosting uses '__session' cookie since it's the only one passed through Cloud Functions caching
    document.cookie = `__session=${token}; path=/; max-age=3600; ${secure} SameSite=Lax`;
    document.cookie = `token=${token}; path=/; max-age=3600; ${secure} SameSite=Lax`;
    document.cookie = `user_role=${role}; path=/; max-age=3600; ${secure} SameSite=Lax`;
  }
};

const clearAuthCookies = () => {
  if (typeof window !== "undefined") {
    document.cookie = "__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  login: async (email, pass) => {
    set({ loading: true });
    try {
      const fbUser = await loginWithEmail(email, pass);
      const profile = await syncUserProfile(fbUser);
      const token = await fbUser.getIdToken();
      setAuthCookies(token, profile.role);
      set({ user: profile, loading: false });
      return profile;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  loginWithGoogle: async () => {
    set({ loading: true });
    try {
      const fbUser = await signInWithGoogle();
      const profile = await syncUserProfile(fbUser);
      const token = await fbUser.getIdToken();
      setAuthCookies(token, profile.role);
      set({ user: profile, loading: false });
      return profile;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  loginWithGithub: async () => {
    set({ loading: true });
    try {
      const fbUser = await signInWithGithub();
      const profile = await syncUserProfile(fbUser);
      const token = await fbUser.getIdToken();
      setAuthCookies(token, profile.role);
      set({ user: profile, loading: false });
      return profile;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  register: async (email, pass, fullName) => {
    set({ loading: true });
    try {
      const fbUser = await registerWithEmail(email, pass);
      // Wait for Firebase user object to resolve display name
      const profile = await syncUserProfile({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fullName,
        photoURL: fbUser.photoURL,
        emailVerified: fbUser.emailVerified,
      });
      const token = await fbUser.getIdToken();
      setAuthCookies(token, profile.role);
      set({ user: profile, loading: false });
      return profile;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await signOutUser();
      clearAuthCookies();
      set({ user: null, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  updateUser: async (data) => {
    const { user } = get();
    if (!user) throw new Error("No authenticated user profile loaded to update.");
    try {
      await updateUserProfile(user.uid, data);
      const updatedProfile = await getUserProfile(user.uid);
      set({ user: updatedProfile });
    } catch (error) {
      console.error("Failed to update user profile store:", error);
      throw error;
    }
  },
}));
