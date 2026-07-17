"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { auth, sendVerification } from "@/lib/firebase/auth";
import { syncUserProfile } from "@/lib/firebase/firestore";
import { toast } from "sonner";
import { Sparkles, Loader2, Mail, RefreshCw, LogOut } from "lucide-react";
import { FullPageLoader } from "@/components/shared/full-page-loader";

export default function VerifyEmailPage() {
  const { user, loading, logout, setUser } = useAuthStore();
  const router = useRouter();
  const [resendCooldown, setResendCooldown] = useState(0);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Sync profile and redirect once email verified
  const checkEmailVerified = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    await currentUser.reload();
    if (currentUser.emailVerified) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      try {
        const profile = await syncUserProfile(currentUser);
        setUser(profile);
        toast.success("Email verified! Redirecting to dashboard...");
        router.replace("/dashboard");
      } catch (err) {
        console.error("Failed to sync profile after email verification:", err);
      }
    }
  }, [router, setUser]);

  // Automatic polling checking every 4 seconds
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.isVerified) {
      router.replace("/dashboard");
      return;
    }

    intervalRef.current = setInterval(() => {
      checkEmailVerified();
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user, loading, router, checkEmailVerified]);

  const handleManualCheck = async () => {
    setCheckingStatus(true);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.reload();
        if (currentUser.emailVerified) {
          await checkEmailVerified();
        } else {
          toast.info("Email is not verified yet. Please check your inbox or spam folder.");
        }
      }
    } catch (error) {
      console.error("Manual verification refresh error:", error);
      toast.error("Error refreshing verification status.");
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleResendLink = async () => {
    try {
      await sendVerification();
      toast.success("Verification link resent successfully!");
      setResendCooldown(60);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Failed to dispatch verification email.");
    }
  };

  if (loading) {
    return <FullPageLoader label="Resolving verification status..." />;
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300">
      {/* Glow elements */}
      <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative w-full max-w-[450px] space-y-6 rounded-2xl border border-border bg-card/60 p-6 sm:p-8 shadow-xl backdrop-blur-md">
        {/* Header branding */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-accent text-primary-foreground shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent">
              BuildMyPortfolio
            </span>
          </Link>
          
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-md pt-1 mt-3 animate-bounce">
            <Mail className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground pt-2">
            Verify your email
          </h2>
          <p className="text-sm text-muted-foreground">
            We sent a verification link to
            <br />
            <span className="font-semibold text-foreground">{user.email}</span>
          </p>
        </div>

        {/* Content details */}
        <div className="rounded-lg border border-border bg-background/50 p-4 text-xs leading-relaxed text-muted-foreground text-center">
          Please click the link inside the verification email to activate your account. Once verified, this page will automatically redirect you to the dashboard.
        </div>

        {/* Actions panel */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleManualCheck}
            disabled={checkingStatus}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 focus:outline-none disabled:opacity-50 transition-colors"
          >
            {checkingStatus ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Refresh Status
              </>
            )}
          </button>

          <button
            onClick={handleResendLink}
            disabled={resendCooldown > 0}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background py-2.5 text-sm font-semibold text-foreground hover:bg-muted/70 disabled:opacity-60 transition-colors"
          >
            {resendCooldown > 0 ? (
              `Resend Link (${resendCooldown}s)`
            ) : (
              "Resend Verification Link"
            )}
          </button>
        </div>

        {/* Log Out option */}
        <div className="flex justify-center text-xs font-semibold text-muted-foreground pt-2 border-t border-border/50">
          <button
            onClick={logout}
            className="flex items-center gap-1.5 hover:text-destructive transition-colors text-muted-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out of this account
          </button>
        </div>
      </div>
    </div>
  );
}
