import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || (process.env.NODE_ENV === "development" || typeof window === "undefined" ? "AIzaSyFakeKeyForLocalBuildAndDevelopment" : undefined),
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || (process.env.NODE_ENV === "development" || typeof window === "undefined" ? "mock-project.firebaseapp.com" : undefined),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || (process.env.NODE_ENV === "development" || typeof window === "undefined" ? "mock-project" : undefined),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || (process.env.NODE_ENV === "development" || typeof window === "undefined" ? "mock-project.appspot.com" : undefined),
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || (process.env.NODE_ENV === "development" || typeof window === "undefined" ? "000000000000" : undefined),
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || (process.env.NODE_ENV === "development" || typeof window === "undefined" ? "1:000000000000:web:0000000000000000000000" : undefined),
};

// Strict environment variables validation
const validateConfig = () => {
  const missingKeys: string[] = [];
  Object.entries(firebaseConfig).forEach(([key, value]) => {
    if (!value) {
      // Map to original ENV naming standard
      const envName = "NEXT_PUBLIC_FIREBASE_" + key.replace(/([A-Z])/g, "_$1").toUpperCase();
      missingKeys.push(envName);
    }
  });

  if (missingKeys.length > 0) {
    const errorMsg = `Missing Firebase environment configuration variables: ${missingKeys.join(", ")}`;
    console.error("Firebase Config Warning:", errorMsg);
  }
};

validateConfig();

let app: FirebaseApp;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase App initialization failed:", error);
  throw error;
}

export { app };
export default app;
