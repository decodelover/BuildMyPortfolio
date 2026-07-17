"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/auth";
import { syncUserProfile } from "@/lib/firebase/firestore";
import { useAuthStore } from "@/store/useAuthStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const profile = await syncUserProfile(firebaseUser);
          const token = await firebaseUser.getIdToken();

          // Set cookies for Next.js Middleware route checking
          const secure = window.location.protocol === "https:" ? "Secure;" : "";
          document.cookie = `__session=${token}; path=/; max-age=3600; ${secure} SameSite=Lax`;
          document.cookie = `token=${token}; path=/; max-age=3600; ${secure} SameSite=Lax`;
          document.cookie = `user_role=${profile.role}; path=/; max-age=3600; ${secure} SameSite=Lax`;

          setUser(profile);
        } else {
          // Clear auth cookies on sign-out
          document.cookie = "__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

          setUser(null);
        }
      } catch (error) {
        console.error("Auth state synchronization error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
