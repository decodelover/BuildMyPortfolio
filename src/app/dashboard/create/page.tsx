"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { WizardLayout } from "@/components/dashboard/wizard/WizardLayout";
import { StepCard } from "@/components/dashboard/wizard/StepCard";
import { AlertCircle, RotateCcw, Loader2, Home, WifiOff } from "lucide-react";
import { toast } from "sonner";

export default function WebsiteBuilderWizardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const {
    currentStep,
    loadBuilderDraft,
    saveBuilderDraft,
    unsavedChanges,
    loading,
    error,
    resetStore,
  } = useWebsiteBuilderStore();

  const [mounted, setMounted] = useState(false);

  // Sync component mount state to prevent hydration mismatches
  useEffect(() => {
    setMounted(true);
    return () => {
      // Clean up Zustand store when leaving the wizard page
      resetStore();
    };
  }, [resetStore]);

  // Load user draft configuration
  useEffect(() => {
    if (mounted && user?.uid) {
      loadBuilderDraft(user.uid);
    }
  }, [mounted, user?.uid, loadBuilderDraft]);

  // Monitor online / offline states
  useEffect(() => {
    if (!mounted) return;

    const handleOnline = () => {
      toast.success("Connection restored! Syncing your changes...", { duration: 3000 });
      // Trigger a forced save of any unsaved changes accumulated during offline mode
      if (unsavedChanges) {
        saveBuilderDraft(true);
      }
    };

    const handleOffline = () => {
      toast.warning("You are offline. Changes will save locally and sync when you reconnect.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [mounted, unsavedChanges, saveBuilderDraft]);

  // Warn the user before they leave the page with unsaved modifications
  useEffect(() => {
    if (!mounted) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes that will be lost. Are you sure you want to exit?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [mounted, unsavedChanges]);

  // Route protection - redirect guests to login
  useEffect(() => {
    if (mounted && !authLoading && !user) {
      toast.error("Please sign in to access the Website Builder Wizard.");
      router.push(`/login?redirect=/dashboard/create`);
    }
  }, [mounted, user, authLoading, router]);

  // Loading skeleton block mirroring the exact layout structure
  if (!mounted || authLoading || (loading && !error)) {
    return (
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground select-none">
        {/* Header Skeleton */}
        <div className="h-14 border-b border-border bg-card/60 flex items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-muted shimmer" />
            <div className="h-4.5 w-32 bg-muted rounded shimmer" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-24 bg-muted rounded-full shimmer" />
            <div className="h-7.5 w-24 bg-muted rounded-xl shimmer" />
          </div>
        </div>

        {/* Stepper Skeleton */}
        <div className="h-11 border-b border-border bg-card/30 flex items-center gap-4 px-6 overflow-hidden hidden md:flex">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <div className="h-5 w-5 rounded-full bg-muted shimmer" />
              <div className="h-3 w-16 bg-muted rounded shimmer" />
              <div className="h-[1px] w-4 bg-muted" />
            </div>
          ))}
        </div>

        {/* Workspace Skeleton */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Skeleton */}
          <div className="w-72 border-r border-border bg-card/45 p-5 space-y-4 hidden md:block">
            <div className="space-y-1.5 pb-4 border-b border-border">
              <div className="h-3.5 w-16 bg-muted rounded shimmer" />
              <div className="h-2 w-full bg-muted rounded shimmer" />
            </div>
            <div className="space-y-3 pt-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-lg bg-muted shimmer shrink-0" />
                  <div className="space-y-1 flex-1">
                    <div className="h-3 w-2/3 bg-muted rounded shimmer" />
                    <div className="h-2 w-1/2 bg-muted rounded shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Canvas content Skeleton */}
          <div className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto max-w-4xl mx-auto">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-muted shimmer shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-16 bg-muted rounded shimmer" />
                  <div className="h-5 w-40 bg-muted rounded shimmer" />
                  <div className="h-3.5 w-full bg-muted rounded shimmer" />
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="h-32 w-full rounded-xl bg-muted/30 shimmer border border-dashed border-border" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error boundary layout page
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <div className="max-w-md space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 shadow-md">
            <WifiOff className="h-8 w-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Failed to load draft session
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We encountered a Firestore sync or authentication timeout when retrieving your draft. Please verify your connection status.
            </p>
            <div className="rounded-xl bg-muted p-3.5 text-left font-mono text-[11px] text-muted-foreground overflow-x-auto max-w-full border border-border">
              {error}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-2">
            <button
              onClick={() => user && loadBuilderDraft(user.uid)}
              className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/95 transition-all cursor-pointer"
            >
              <RotateCcw className="h-4 w-4 animate-spin-once" />
              Retry Loading Draft
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-border px-5 py-2.5 text-xs font-bold hover:bg-muted transition-colors cursor-pointer"
            >
              <Home className="h-4 w-4" />
              Exit to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <WizardLayout>
      <StepCard stepId={currentStep} />
    </WizardLayout>
  );
}
