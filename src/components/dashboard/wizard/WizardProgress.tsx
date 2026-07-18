"use client";

import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { motion } from "framer-motion";

export function WizardProgress() {
  const completionPercentage = useWebsiteBuilderStore((state) => state.completionPercentage);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-muted-foreground uppercase tracking-wider">Builder Progress</span>
        <span className="text-primary font-bold">{completionPercentage}% Completed</span>
      </div>
      <div className="relative h-2 w-full rounded-full bg-secondary overflow-hidden border border-border">
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-primary to-accent"
          initial={{ width: 0 }}
          animate={{ width: `${completionPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
export default WizardProgress;
