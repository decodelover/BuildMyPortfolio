"use client";

export function AuthSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[440px] space-y-6 rounded-2xl border border-border bg-card p-6 sm:p-8 animate-pulse">
      {/* Logo container skeleton */}
      <div className="flex flex-col items-center space-y-3">
        <div className="h-10 w-10 rounded-xl bg-muted" />
        <div className="h-6 w-32 rounded bg-muted" />
        <div className="h-4 w-48 rounded bg-muted" />
      </div>

      {/* Input fields skeletons */}
      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <div className="h-3 w-16 rounded bg-muted" />
          <div className="h-10 w-full rounded-lg bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-16 rounded bg-muted" />
          <div className="h-10 w-full rounded-lg bg-muted" />
        </div>
        
        {/* Utility row skeleton */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-muted" />
            <div className="h-3 w-20 rounded bg-muted" />
          </div>
          <div className="h-3 w-24 rounded bg-muted" />
        </div>

        {/* Submit button skeleton */}
        <div className="h-11 w-full rounded-lg bg-muted mt-2" />
      </div>

      {/* Divider skeleton */}
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-border" />
        <div className="mx-4 h-3 w-32 rounded bg-muted" />
        <div className="flex-grow border-t border-border" />
      </div>

      {/* Social login buttons skeletons */}
      <div className="grid grid-cols-2 gap-3">
        <div className="h-10 rounded-lg bg-muted" />
        <div className="h-10 rounded-lg bg-muted" />
      </div>

      {/* Bottom link redirect skeleton */}
      <div className="flex justify-center pt-2">
        <div className="h-3 w-48 rounded bg-muted" />
      </div>
    </div>
  );
}
export default AuthSkeleton;
