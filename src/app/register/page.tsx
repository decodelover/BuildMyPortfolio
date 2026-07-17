"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { sendVerification } from "@/lib/firebase/auth";
import { PublicOnlyRoute } from "@/components/shared/protected-route";
import { Sparkles, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FullPageLoader } from "@/components/shared/full-page-loader";

// Zod schema for registration validation
const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full Name must be at least 2 characters.")
      .max(50, "Full Name cannot exceed 50 characters."),
    email: z.string().min(1, "Email is required.").email("Please enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms & conditions.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

// Password strength evaluator
const getPasswordStrength = (pwd: string) => {
  if (!pwd) return { score: 0, label: "None", color: "bg-muted" };
  let score = 0;
  if (pwd.length >= 8) score += 1;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
  if (/[0-9]/.test(pwd)) score += 1;
  if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;

  if (score <= 1) return { score, label: "Weak", color: "bg-destructive" };
  if (score <= 3) return { score, label: "Medium", color: "bg-amber-500" };
  return { score, label: "Strong", color: "bg-green-500" };
};

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const router = useRouter();

  const { register: registerAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: undefined,
    },
  });

  const passwordValue = watch("password", "");
  const passwordStrength = getPasswordStrength(passwordValue);

  const onSubmit = async (data: RegisterFormValues) => {
    setLocalLoading(true);
    try {
      // Register user and create Firestore user document
      await registerAuth(data.email, data.password, data.fullName);
      
      // Dispatch email verification link immediately
      try {
        await sendVerification();
        toast.success("Verification email dispatched!");
      } catch (err) {
        console.error("Verification email failed to send on register:", err);
      }

      toast.success("Account created successfully!");
      router.push("/verify-email");
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Failed to create account. Please check inputs.");
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
            <h2 className="text-xl font-bold tracking-tight text-foreground pt-3">
              Create an account
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign up to design and host your developer portfolio website
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="text-xs font-semibold text-muted-foreground">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Sarah Carter"
                disabled={localLoading}
                className={cn(
                  "w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary disabled:opacity-50",
                  errors.fullName && "border-destructive focus:ring-destructive/30"
                )}
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-xs font-medium text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-muted-foreground">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="sarah@example.com"
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

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={localLoading}
                  className={cn(
                    "w-full rounded-lg border border-border bg-background pl-3.5 pr-10 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary disabled:opacity-50",
                    errors.password && "border-destructive focus:ring-destructive/30"
                  )}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {/* Password Strength Meter */}
              {passwordValue && (
                <div className="space-y-1 pt-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground">
                    <span>Password Strength:</span>
                    <span className={cn(
                      passwordStrength.label === "Weak" && "text-destructive",
                      passwordStrength.label === "Medium" && "text-amber-500",
                      passwordStrength.label === "Strong" && "text-green-500"
                    )}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        passwordStrength.color,
                        passwordStrength.score === 1 && "w-1/4",
                        passwordStrength.score === 2 && "w-2/4",
                        passwordStrength.score === 3 && "w-3/4",
                        passwordStrength.score === 4 && "w-full"
                      )}
                    />
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-semibold text-muted-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={localLoading}
                  className={cn(
                    "w-full rounded-lg border border-border bg-background pl-3.5 pr-10 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary disabled:opacity-50",
                    errors.confirmPassword && "border-destructive focus:ring-destructive/30"
                  )}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs font-medium text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Accept Terms Checkbox */}
            <div className="space-y-1">
              <div className="flex items-start space-x-2">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  disabled={localLoading}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary mt-0.5"
                  {...register("acceptTerms")}
                />
                <label htmlFor="acceptTerms" className="text-xs text-muted-foreground leading-normal font-semibold">
                  I agree to the&nbsp;
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
                  &nbsp;and&nbsp;
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-xs font-medium text-destructive">{errors.acceptTerms.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={localLoading}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-primary/45 disabled:opacity-50 transition-colors mt-2"
            >
              {localLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Register Developer Profile"
              )}
            </button>
          </form>

          {/* Login Redirect */}
          <div className="flex justify-center text-xs font-semibold text-muted-foreground pt-2 border-t border-border/50">
            Already have an account?&nbsp;
            <Link href="/login" className="text-primary hover:underline">
              Log in instead
            </Link>
          </div>
        </div>
      </div>
    </PublicOnlyRoute>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<FullPageLoader label="Loading registration..." />}>
      <RegisterForm />
    </Suspense>
  );
}
