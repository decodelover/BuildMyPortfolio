"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/storage";
import { Upload, X, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FileUploadProgressProps {
  label: string;
  accept?: string;
  folder?: string;
  value: string;
  onChange: (url: string) => void;
  maxSizeMB?: number;
}

export function FileUploadProgress({
  label,
  accept = "image/*",
  folder = "general",
  value,
  onChange,
  maxSizeMB = 5,
}: FileUploadProgressProps) {
  const { user } = useAuthStore();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate size limit
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds the limit of ${maxSizeMB}MB.`);
      return;
    }

    setUploading(true);
    setProgress(0);

    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const uniqueFileName = `${timestamp}_${cleanFileName}`;
    const storageRef = ref(storage, `users/${user.uid}/${folder}/${uniqueFileName}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(pct);
      },
      (error) => {
        console.error("Upload error:", error);
        toast.error("File upload failed. Please verify storage permissions.");
        setUploading(false);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          onChange(downloadUrl);
          toast.success("File uploaded successfully!");
        } catch (err) {
          console.error("URL retrieval error:", err);
          toast.error("Failed to get download URL.");
        } finally {
          setUploading(false);
        }
      }
    );
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="space-y-2 text-left">
      <span className="text-muted-foreground uppercase text-[9px] tracking-wider font-bold block">
        {label}
      </span>

      {value ? (
        <div className="flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 p-3.5 shadow-sm">
          <div className="h-8 w-8 rounded bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <Check className="h-4.5 w-4.5 stroke-[2.5]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">File upload complete</p>
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-primary hover:underline font-bold truncate block"
            >
              View Uploaded File
            </a>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
            aria-label="Remove uploaded file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : uploading ? (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-sm">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-primary flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading file...
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden border border-border">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-card/40 hover:bg-card hover:border-primary/45 transition-all p-5 text-center cursor-pointer select-none group shadow-inner">
          <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="text-xs font-bold text-foreground mt-2">
            Click to upload files
          </span>
          <span className="text-[10px] text-muted-foreground/60 font-semibold mt-1">
            Accepts {accept.replace("/*", "")} (Max {maxSizeMB}MB)
          </span>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
export default FileUploadProgress;
