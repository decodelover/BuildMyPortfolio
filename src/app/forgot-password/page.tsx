"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { sendPasswordReset } from "@/lib/firebase/auth";
import { PublicOnlyRoute } from "@/components/shared/protected-route";
import { Sparkles, Loader2, MailCheck, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { FullPageLoader } from "@/components/shared/full-page-loader";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Please enter a valid email address."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

function ForgotPasswordForm() {
  const [localLoading, setLocalLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setLocalLoading(true);
    try {
      await sendPasswordReset(data.email);
      setSubmittedEmail(data.email);
      setEmailSent(true);
      toast.success("Password reset email sent!");
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Failed to send password reset email.");
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

        <div className="relative w-full max-w-[440px] space-y-6 rounded-2xl border border-border bg-card/60 p-6 sm:p-8 shadow-xl backdrop-blur-md">
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
            
            {!emailSent ? (
              <>
                <h2 className="text-xl font-bold tracking-tight text-foreground pt-3">
                  Forgot password?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enter your email address to receive a recovery link
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-500 shadow-md pt-1 mt-3">
                  <MailCheck className="h-7 w-7" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-foreground pt-2">
                  Check your inbox
                </h2>
                <p className="text-sm text-muted-foreground">
                  We sent password reset instructions to
                  <br />
                  <span className="font-semibold text-foreground">{submittedEmail}</span>
                </p>
              </>
            )}
          </div>

          {!emailSent ? (
            /* Form input state */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-muted-foreground">
                  Registered Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="developer@example.com"
                  disabled={localLoading}
                  className={cn(
                    "w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary disabled:opacity-50",
                    errors.email && "border-destructive focus:ring-destructive/30"
                  )}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={localLoading}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-primary/45 disabled:opacity-50 transition-colors mt-2"
              >
                {localLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending instructions...
                  </>
                ) : (
                  "Send Reset Instructions"
                )}
              </button>
            </form>
          ) : (
            /* Success confirmation details */
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setEmailSent(false)}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-colors"
              >
                Re-enter Email Address
              </button>
            </div>
          )}

          {/* Return link */}
          <div className="flex justify-center text-xs font-semibold text-muted-foreground pt-2 border-t border-border/50">
            <Link href="/login" className="flex items-center gap-1.5 text-primary hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </PublicOnlyRoute>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<FullPageLoader label="Loading recovery services..." />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
