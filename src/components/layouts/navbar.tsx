"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/useAuthStore";
import { Menu, X, Sun, Moon, Sparkles, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, loading, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { label: "Features", href: "/features" },
    { label: "Templates", href: "/templates" },
    { label: "Showcase", href: "/showcase" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Blog", href: "#", badge: "Soon" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 font-black text-lg tracking-tight select-none">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-accent text-primary-foreground shadow-md shadow-primary/20">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <span className="bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent">
            BuildMyPortfolio
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const isSoon = link.badge === "Soon";
            return (
              <div key={link.label} className="relative flex items-center">
                {isSoon ? (
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground/60 cursor-not-allowed select-none px-2 py-1">
                    {link.label}
                    <span className="text-[9px] font-extrabold uppercase px-1 py-0.5 rounded bg-primary/10 text-primary scale-90 border border-primary/20">
                      {link.badge}
                    </span>
                  </span>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm font-semibold px-2 py-1 rounded-lg transition-colors relative group",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Action Buttons & Session Control */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggler */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-xl p-2 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer border border-transparent hover:border-border/30"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
          )}

          {loading ? (
            <div className="h-9 w-20 animate-pulse rounded-xl bg-muted" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-xl border border-border/80 px-4 py-2 text-xs font-bold hover:bg-muted transition-all duration-200 shadow-sm"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 rounded-xl bg-secondary px-4 py-2 text-xs font-bold text-secondary-foreground hover:bg-secondary/80 transition-colors shadow-sm cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/95 transition-all duration-200 hover:scale-[1.02]"
              >
                Start Building
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger & Theme Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-xl p-2 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-xl p-2 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Open menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md"
          >
            <div className="space-y-1.5 px-4 pb-6 pt-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const isSoon = link.badge === "Soon";
                return isSoon ? (
                  <span
                    key={link.label}
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground/50 cursor-not-allowed select-none"
                  >
                    {link.label}
                    <span className="text-[8px] font-extrabold uppercase px-1 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                      {link.badge}
                    </span>
                  </span>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="border-t border-border mt-4 pt-4 space-y-2.5">
                {loading ? (
                  <div className="h-10 w-full animate-pulse rounded-xl bg-muted" />
                ) : user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-bold hover:bg-muted transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-sm font-bold text-secondary-foreground hover:bg-secondary/95 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="block text-center rounded-xl py-2.5 text-sm font-bold hover:bg-muted text-muted-foreground transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="block text-center rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/95 transition-all"
                    >
                      Start Building
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
