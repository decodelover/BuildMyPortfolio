"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  ChevronRight,
  PlusCircle,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingNavHeaderProps {
  onOpenCommandPalette: () => void;
  onOpenNotifications: () => void;
  onOpenAIAssistant: () => void;
  onToggleMobileSidebar: () => void;
  unreadNotifications: number;
}

export function FloatingNavHeader({
  onOpenCommandPalette,
  onOpenNotifications,
  onOpenAIAssistant,
  onToggleMobileSidebar,
  unreadNotifications,
}: FloatingNavHeaderProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Construct breadcrumbs
  const paths = pathname.split("/").filter((p) => p);
  const breadcrumbs = paths.map((path, idx) => {
    const href = "/" + paths.slice(0, idx + 1).join("/");
    const label = path.charAt(0).toUpperCase() + path.slice(1);
    const isLast = idx === paths.length - 1;
    return { label, href, isLast };
  });

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border/60 bg-card/70 backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Workspace
          </Link>
          {breadcrumbs.map((crumb) => (
            <div key={crumb.href} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
              {crumb.isLast ? (
                <span className="text-foreground font-bold">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-foreground transition-colors">
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Center: Command Palette Quick Search Trigger */}
      <button
        type="button"
        onClick={onOpenCommandPalette}
        className="flex-1 max-w-md hidden sm:flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl border border-border/60 bg-background/50 hover:bg-background/80 text-muted-foreground hover:text-foreground text-xs font-medium transition-all shadow-inner cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" />
          <span>Search workspace, portfolios, or actions...</span>
        </span>
        <kbd className="px-2 py-0.5 rounded-lg bg-card border border-border shadow-xs text-[10px] font-bold">
          ⌘K
        </kbd>
      </button>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Create Quick Action */}
        <Link
          href="/dashboard/create"
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-semibold shadow-sm hover:opacity-95 transition-opacity"
        >
          <PlusCircle className="h-4 w-4" />
          Create Portfolio
        </Link>

        {/* AI Assistant Button */}
        <button
          type="button"
          onClick={onOpenAIAssistant}
          className="p-2 rounded-xl border border-accent/30 bg-accent/10 text-accent hover:bg-accent/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Open AI Copilot"
        >
          <Sparkles className="h-4 w-4 animate-pulse" />
          <span className="hidden md:inline font-bold">AI Copilot</span>
        </button>

        {/* Notifications Button */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[9px] font-extrabold flex items-center justify-center border-2 border-background">
              {unreadNotifications}
            </span>
          )}
        </button>

        {/* Theme Switcher */}
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
        </button>
      </div>
    </header>
  );
}
