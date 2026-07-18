import { adminAuth } from "./admin";

/**
 * Verifies a Firebase client ID token supplied in the Authorization header.
 * @param authHeader The raw Authorization header (should be "Bearer <token>")
 * @returns The verified user's UID
 */
export async function verifyToken(authHeader: string | null): Promise<string> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid authorization header");
  }

  const token = authHeader.split("Bearer ")[1];
  if (!adminAuth) {
    throw new Error("Firebase Admin Auth service is not available on this server environment");
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    if (!decodedToken.uid) {
      throw new Error("Token does not contain a valid user identity");
    }
    return decodedToken.uid;
  } catch (error: any) {
    console.error("Token verification helper error:", error);
    throw new Error(`Unauthorized: ${error.message || "Failed to verify ID token"}`);
  }
}
