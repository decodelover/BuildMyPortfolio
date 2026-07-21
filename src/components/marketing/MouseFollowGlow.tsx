"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function MouseFollowGlow() {
  const [mounted, setMounted] = useState(false);

  const cursorX = useSpring(-100, { stiffness: 400, damping: 30 });
  const cursorY = useSpring(-100, { stiffness: 400, damping: 30 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  return (
    <motion.div
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      className="fixed pointer-events-none z-30 hidden lg:block w-[450px] h-[450px] rounded-full bg-radial from-primary/12 via-accent/6 to-transparent blur-[90px] transition-opacity duration-300"
    />
  );
}
