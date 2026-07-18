"use client";

import Link from "next/link";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { motion } from "framer-motion";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:14px_24px] opacity-60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-primary/10 blur-3xl opacity-60" />

        <div className="max-w-md space-y-6 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 shadow-md"
          >
            <AlertTriangle className="h-8 w-8 animate-bounce" />
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Page Not Found
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We couldn&apos;t find the route or resource you were trying to access. It might have been relocated, or doesn&apos;t exist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-2 text-xs">
            <Link
              href="/"
              className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 font-bold text-primary-foreground shadow hover:bg-primary/95 transition-all cursor-pointer"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-border/80 px-5 py-2.5 font-bold hover:bg-muted transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
