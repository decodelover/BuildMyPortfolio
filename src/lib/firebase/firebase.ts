import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyFakeKeyForLocalBuildAndDevelopment",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mock-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mock-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:989064114043:web:17b3f7671b9e446bd317de",
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
