import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { app } from "./firebase";

export const storage = getStorage(app);
// Limit Firebase Storage retry timeout to 10s to prevent storage/retry-limit-exceeded infinite loops
storage.maxUploadRetryTime = 10000;
storage.maxOperationRetryTime = 10000;

/**
 * Uploads a file to Firebase Storage under a user-specific folder path.
 * @param uid User ID
 * @param file File object
 * @param folder Subfolder path within user directory (e.g., 'profile', 'projects')
 * @returns The public download URL of the uploaded file
 */
export async function uploadUserFile(uid: string, file: File, folder: string = "general"): Promise<string> {
  try {
    // Generate a unique filename to prevent collisions
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const uniqueFileName = `${timestamp}_${cleanFileName}`;
    
    const fileRef = ref(storage, `users/${uid}/${folder}/${uniqueFileName}`);
    
    // Upload file bytes
    const snapshot = await uploadBytes(fileRef, file);
    
    // Retrieve public download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Storage file upload failed:", error);
    throw error;
  }
}

/**
 * Deletes a file from Firebase Storage.
 * @param fileUrl The full download URL of the file
 */
export async function deleteUserFile(fileUrl: string): Promise<void> {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Storage file deletion failed:", error);
    throw error;
  }
}
