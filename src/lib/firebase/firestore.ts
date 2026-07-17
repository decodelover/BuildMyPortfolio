import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { app } from "./firebase";

export const db = getFirestore(app);

export interface UserDocument {
  uid: string;
  fullName: string;
  username: string;
  email: string;
  photoURL: string | null;
  profession: string | null;
  currentPlan: "FREE" | "PRO" | "ELITE";
  role: "USER" | "ADMIN";
  isVerified: boolean;
  isSuspended: boolean;
  bio: string | null;
  country: string | null;
  socialLinks: { github?: string; twitter?: string; linkedin?: string; website?: string } | null;
  aiCredits: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp;
}

// Helper to generate a URL-safe, clean username
export function generateUsername(name: string, email: string): string {
  const base = name ? name : email.split("@")[0];
  const cleaned = base
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 15);
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${cleaned}${suffix}`;
}

// Synchronize Firebase Auth user with Firestore user document
export async function syncUserProfile(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}) {
  if (!user.email) {
    throw new Error("User email is required to synchronize profile.");
  }

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  const now = serverTimestamp();

  if (!userSnap.exists()) {
    const newUsername = generateUsername(user.displayName || "", user.email);
    const newUserDoc = {
      uid: user.uid,
      fullName: user.displayName || user.email.split("@")[0],
      username: newUsername,
      email: user.email,
      photoURL: user.photoURL || null,
      profession: null,
      currentPlan: "FREE" as const,
      role: "USER" as const,
      isVerified: user.emailVerified,
      isSuspended: false,
      bio: null,
      country: null,
      socialLinks: null,
      aiCredits: 100,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
    };
    await setDoc(userRef, newUserDoc);
    return {
      ...newUserDoc,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      lastLoginAt: Timestamp.now(),
    } as UserDocument;
  } else {
    const existingData = userSnap.data();
    // Block suspended users
    if (existingData.isSuspended) {
      throw new Error("This account has been suspended by administration.");
    }
    const updateData = {
      lastLoginAt: now,
      updatedAt: now,
      isVerified: user.emailVerified,
    };
    await updateDoc(userRef, updateData);
    return {
      ...existingData,
      ...updateData,
      lastLoginAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    } as UserDocument;
  }
}

// Retrieve user document by UID
export async function getUserProfile(uid: string): Promise<UserDocument | null> {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data() as UserDocument;
  }
  return null;
}

// Modify user document profile fields
export async function updateUserProfile(
  uid: string,
  data: Partial<Omit<UserDocument, "uid" | "createdAt" | "role" | "currentPlan">>
) {
  const userRef = doc(db, "users", uid);
  const updateData = {
    ...data,
    updatedAt: serverTimestamp(),
  };
  await updateDoc(userRef, updateData);
}
