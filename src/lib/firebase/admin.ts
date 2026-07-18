import { initializeApp, getApps, getApp, cert, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const initAdmin = () => {
  if (getApps().length > 0) {
    return getApp();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      "Firebase Admin credentials are not set. Server-side Firebase operations will fail."
    );
    return null;
  }

  // Format the private key to handle escaped newline characters
  privateKey = privateKey.replace(/\\n/g, "\n");

  try {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      } as ServiceAccount),
      storageBucket: `${projectId}.appspot.com`,
    });
  } catch (error) {
    console.error("Firebase Admin initialization failed:", error);
    return null;
  }
};

const adminApp = initAdmin();

export const adminDb = adminApp ? getFirestore() : null;
export const adminAuth = adminApp ? getAuth() : null;
export const adminStorage = adminApp ? getStorage() : null;

export default adminApp;
