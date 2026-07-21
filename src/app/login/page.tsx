"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { PublicOnlyRoute } from "@/components/shared/protected-route";
import { Sparkles, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FullPageLoader } from "@/components/shared/full-page-loader";
import { checkRedirectAuthResult } from "@/lib/firebase/auth";
import { syncUserProfile } from "@/lib/firebase/firestore";

// Google Icon SVG
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

// GitHub Icon SVG
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

// Zod schema for login validation
const loginSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const { login, loginWithGoogle, loginWithGithub, setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Check for pending redirect sign-in results on component mount
  useEffect(() => {
    async function handleRedirectResult() {
      try {
        const redirectedUser = await checkRedirectAuthResult();
        if (redirectedUser) {
          const profile = await syncUserProfile(redirectedUser);
          setUser(profile);
          toast.success("Successfully logged in via redirect!");
        }
      } catch (err) {
        console.warn("Redirect result handling error:", err);
      }
    }
    handleRedirectResult();
  }, [setUser]);

  const onSubmit = async (data: LoginFormValues) => {
    setLocalLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Successfully logged in!");
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLocalLoading(true);
    try {
      const userDoc = await loginWithGoogle();
      if (userDoc) {
        toast.success("Logged in with Google!");
      } else {
        toast.info("Browser blocked popup. Redirecting to Google sign in...");
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Google Authentication failed.");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLocalLoading(true);
    try {
      const userDoc = await loginWithGithub();
      if (userDoc) {
        toast.success("Logged in with GitHub!");
      } else {
        toast.info("Browser blocked popup. Redirecting to GitHub sign in...");
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "GitHub Authentication failed.");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <PublicOnlyRoute>
      <div className="relative min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300">
        {/* Glow elements */}
        <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative w-full max-w-md space-y-8 rounded-2xl border border-border/60 bg-card/80 p-8 shadow-xl backdrop-blur-xl transition-all">
          {/* Logo & Header */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 font-black text-2xl tracking-tight">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-accent text-primary-foreground shadow-md shadow-primary/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                BuildMyPortfolio
              </span>
            </Link>
            <h2 className="mt-4 text-xl font-bold tracking-tight text-foreground">Welcome back</h2>
            <p className="mt-1 text-xs text-muted-foreground">Sign in to manage your AI portfolio generator</p>
          </div>

          {/* Login Form */}
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Email Address</label>
              <input
                {...register("email")}
                type="email"
                placeholder="developer@buildmyportfolio.com"
                className={cn(
                  "w-full rounded-xl border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all",
                  errors.email ? "border-destructive focus:ring-destructive/40" : "border-border"
                )}
              />
              {errors.email && <p className="mt-1 text-[11px] font-medium text-destructive">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-foreground">Password</label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={cn(
                    "w-full rounded-xl border bg-background px-3.5 py-2.5 pr-10 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all",
                    errors.password ? "border-destructive focus:ring-destructive/40" : "border-border"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-[11px] font-medium text-destructive">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("rememberMe")}
                  type="checkbox"
                  className="rounded border-border text-primary focus:ring-primary/40 h-4 w-4"
                />
                <span className="text-xs text-muted-foreground">Remember my session credentials</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={localLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
            >
              {localLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Logging in...
                </>
              ) : (
                "Log In to Dashboard"
              )}
            </button>
          </form>

          {/* Social Sign-In Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-semibold">
              <span className="bg-card px-3 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Social Sign-In Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={localLoading}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background py-2 px-3 text-xs font-semibold text-foreground shadow-xs hover:bg-muted transition-all disabled:opacity-50 cursor-pointer"
            >
              <GoogleIcon className="h-4 w-4" /> Google
            </button>
            <button
              type="button"
              onClick={handleGithubLogin}
              disabled={localLoading}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background py-2 px-3 text-xs font-semibold text-foreground shadow-xs hover:bg-muted transition-all disabled:opacity-50 cursor-pointer"
            >
              <GitHubIcon className="h-4 w-4" /> GitHub
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="font-bold text-primary hover:underline">
              Create an account free
            </Link>
          </p>
        </div>
      </div>
    </PublicOnlyRoute>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<FullPageLoader label="Loading security session..." />}>
      <LoginForm />
    </Suspense>
  );
}
