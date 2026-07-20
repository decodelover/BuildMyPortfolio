"use client";

import React from "react";
import { motion } from "framer-motion";
import { AnimationVariantsConfig } from "@/lib/rendering-engine/types";

export interface AnimationWrapperProps {
  animationConfig: AnimationVariantsConfig;
  children: React.ReactNode;
}

export function AnimationWrapper({ animationConfig, children }: AnimationWrapperProps) {
  if (animationConfig.reducedMotion) {
    return <div>{children}</div>;
  }

  const reveal = animationConfig.scrollReveal;

  return (
    <motion.div
      initial={reveal.initial}
      whileInView={reveal.whileInView}
      viewport={reveal.viewport}
      transition={reveal.transition}
    >
      {children}
    </motion.div>
  );
}
