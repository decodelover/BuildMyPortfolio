"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  Sparkles,
  CreditCard,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  onOpenAIAssistant?: () => void;
}

export function MobileBottomNav({ onOpenAIAssistant }: MobileBottomNavProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auto-hide navigation on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard },
    { label: "Portfolios", href: "/dashboard/portfolios", icon: FolderKanban },
    { label: "Create", href: "/dashboard/create", icon: PlusCircle, highlight: true },
    { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { label: "Profile", href: "/dashboard/profile", icon: User },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 z-40 md:hidden"
        >
          <div className="mx-auto max-w-md rounded-2xl border border-border/60 bg-card/85 p-2 shadow-xl backdrop-blur-2xl flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              if (item.highlight) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative flex flex-col items-center justify-center p-2 rounded-xl text-primary-foreground bg-gradient-to-r from-primary to-accent shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[9px] font-bold mt-0.5">{item.label}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex flex-col items-center justify-center p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[9px] font-medium mt-0.5">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="mobile-nav-indicator"
                      className="absolute -bottom-1 h-1 w-4 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* AI Assistant Quick Trigger */}
            {onOpenAIAssistant && (
              <button
                type="button"
                onClick={onOpenAIAssistant}
                className="relative flex flex-col items-center justify-center p-2 rounded-xl text-xs font-semibold text-accent hover:text-accent/80 transition-colors cursor-pointer"
              >
                <Sparkles className="h-5 w-5" />
                <span className="text-[9px] font-bold mt-0.5">AI</span>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
