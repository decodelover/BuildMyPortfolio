"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center transition-colors duration-300">
          <div className="max-w-md space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-md">
              <AlertTriangle className="h-8 w-8" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Something went wrong
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                An unexpected error occurred while rendering this component. Try reloading or contact system support.
              </p>
              {this.state.error && (
                <div className="rounded-lg bg-muted p-3 text-left font-mono text-xs text-muted-foreground overflow-x-auto max-w-full">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <button
                onClick={this.handleReset}
                className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg bg-primary px-4.5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Retry Loading
              </button>
              <Link
                href="/"
                className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg border border-border px-4.5 py-2.5 text-sm font-semibold hover:bg-muted transition-colors"
              >
                <Home className="h-4 w-4" />
                Return Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
