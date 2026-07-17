"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function FullPageLoader({ label = "Loading page assets..." }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm transition-colors duration-300">
      <div className="relative flex flex-col items-center">
        {/* Glowing ring animation */}
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-primary/20 opacity-75" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-accent text-primary-foreground shadow-lg">
          <Sparkles className="h-8 w-8 text-white animate-pulse" />
        </div>
        
        {/* Loading label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-6 text-sm font-semibold tracking-wide text-muted-foreground animate-pulse"
        >
          {label}
        </motion.p>
      </div>
    </div>
  );
}
