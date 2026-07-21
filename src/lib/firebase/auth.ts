import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  sendEmailVerification as firebaseSendEmailVerification,
} from "firebase/auth";
import { app } from "./firebase";

export const auth = getAuth(app);

// Authentication Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const githubProvider = new GithubAuthProvider();

// Email & Password Registration
export async function registerWithEmail(email: string, pass: string) {
  try {
    const credential = await firebaseCreateUserWithEmailAndPassword(auth, email, pass);
    return credential.user;
  } catch (error) {
    console.error("Email registration failed:", error);
    throw error;
  }
}

// Email & Password Log In
export async function loginWithEmail(email: string, pass: string) {
  try {
    const credential = await firebaseSignInWithEmailAndPassword(auth, email, pass);
    return credential.user;
  } catch (error) {
    console.error("Email login failed:", error);
    throw error;
  }
}

// Google Sign-In (with popup-blocked fallback)
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.warn("Google signInWithPopup error:", error?.code || error);
    if (error?.code === "auth/popup-blocked" || error?.code === "auth/popup-closed-by-user") {
      console.log("Popup blocked by browser. Falling back to redirect...");
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    throw error;
  }
}

// GitHub Sign-In (with popup-blocked fallback)
export async function signInWithGithub() {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return result.user;
  } catch (error: any) {
    console.warn("GitHub signInWithPopup error:", error?.code || error);
    if (error?.code === "auth/popup-blocked" || error?.code === "auth/popup-closed-by-user") {
      console.log("Popup blocked by browser. Falling back to redirect...");
      await signInWithRedirect(auth, githubProvider);
      return null;
    }
    throw error;
  }
}

// Check for pending redirect result on app mount
export async function checkRedirectAuthResult() {
  try {
    const result = await getRedirectResult(auth);
    return result?.user || null;
  } catch (error) {
    console.warn("Redirect result check error:", error);
    return null;
  }
}

// Send Reset Password Link
export async function sendPasswordReset(email: string) {
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL;
    await firebaseSendPasswordResetEmail(auth, email, {
      url: `${origin}/login`,
    });
  } catch (error) {
    console.error("Password reset email dispatch failed:", error);
    throw error;
  }
}

// Send Email Verification Link
export async function sendVerification() {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("No active user session found to trigger verification email.");
  }
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL;
    await firebaseSendEmailVerification(currentUser, {
      url: `${origin}/dashboard`,
    });
  } catch (error) {
    console.error("Email verification dispatch failed:", error);
    throw error;
  }
}

// Log Out Session
export async function signOutUser() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Sign out failed:", error);
    throw error;
  }
}
