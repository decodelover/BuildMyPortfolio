"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Sparkles,
  LayoutDashboard,
  FolderKanban,
  CreditCard,
  Settings,
  User,
  Plus,
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  ChevronRight,
  Shield,
  Zap,
  Globe,
  Sliders,
  HelpCircle,
  Code,
  Activity,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CommandPalette } from "@/components/dashboard/ui/CommandPalette";
import { QuickAIAssistantModal } from "@/components/dashboard/ui/QuickAIAssistantModal";
import { NotificationDrawer } from "@/components/dashboard/ui/NotificationDrawer";
import { MobileBottomNav } from "@/components/dashboard/ui/MobileBottomNav";
import { cn } from "@/lib/utils";

interface BespokeWorkspaceLayoutProps {
  children: React.ReactNode;
}

export function BespokeWorkspaceLayout({ children }: BespokeWorkspaceLayoutProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navItems = [
    { label: "AI Command Center", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Portfolios", href: "/dashboard/portfolios", icon: FolderKanban, badge: "Live" },
    { label: "Create Portfolio", href: "/dashboard/create", icon: Plus, isAction: true },
    { label: "Billing & Plans", href: "/dashboard/billing", icon: CreditCard },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
    { label: "Profile", href: "/dashboard/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 relative overflow-hidden">
      {/* Ambient Lighting Background */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[300px] bg-gradient-to-tr from-primary/10 via-accent/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="flex flex-1 relative z-10">
        {/* Collapsible Floating Desktop Sidebar */}
        <aside
          className={cn(
            "hidden lg:flex flex-col justify-between border-r border-border/40 bg-card/60 backdrop-blur-2xl p-4 transition-all duration-300 select-none",
            sidebarCollapsed ? "w-20" : "w-64"
          )}
        >
          <div className="space-y-6">
            {/* Header Brand */}
            <div className="flex items-center justify-between px-2 py-1">
              <Link href="/dashboard" className="flex items-center gap-2.5 font-black text-sm tracking-tight">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-accent text-primary-foreground shadow-md shadow-primary/20">
                  <Sparkles className="h-4 w-4" />
                </div>
                {!sidebarCollapsed && (
                  <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                    BuildMyPortfolio
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1 rounded-lg border border-border/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", !sidebarCollapsed && "rotate-180")} />
              </button>
            </div>

            {/* Quick Action Button */}
            {!sidebarCollapsed ? (
              <Link
                href="/dashboard/create"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-extrabold text-xs shadow-md hover:opacity-95 transition-opacity cursor-pointer"
              >
                <Plus className="h-4 w-4" /> New Portfolio
              </Link>
            ) : (
              <Link
                href="/dashboard/create"
                className="w-10 h-10 mx-auto flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md hover:opacity-95 transition-opacity"
                title="New Portfolio"
              >
                <Plus className="h-5 w-5" />
              </Link>
            )}

            {/* Nav Links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                if (item.isAction) return null;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative group cursor-pointer",
                      isActive
                        ? "bg-primary/10 text-primary font-extrabold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                    {!sidebarCollapsed && item.badge && (
                      <span className="ml-auto px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile Footer */}
          <div className="pt-4 border-t border-border/40 space-y-3">
            <div className="flex items-center gap-3 px-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent text-primary-foreground font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                {user?.fullName ? user.fullName[0].toUpperCase() : "U"}
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden text-left">
                  <h4 className="text-xs font-extrabold text-foreground truncate">{user?.fullName || "Developer"}</h4>
                  <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => logout()}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors cursor-pointer",
                sidebarCollapsed && "justify-center px-0"
              )}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Main Operating System Shell Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header Bar */}
          <header className="h-16 border-b border-border/40 bg-card/40 backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-40 select-none">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl border border-border/60 bg-background/60 text-muted-foreground hover:text-foreground text-xs font-medium w-full max-w-sm transition-colors cursor-pointer shadow-xs"
            >
              <Search className="h-3.5 w-3.5 text-primary" />
              <span className="flex-1 text-left">Search portfolios, actions...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold bg-muted rounded border border-border">
                ⌘K
              </kbd>
            </button>

            {/* Quick Utility Actions */}
            <div className="flex items-center gap-2.5">
              {/* AI Copilot Trigger */}
              <button
                type="button"
                onClick={() => setAiAssistantOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold hover:bg-primary/20 transition-colors cursor-pointer shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
                <span className="hidden sm:inline">AI Copilot</span>
              </button>

              {/* Notification Trigger */}
              <button
                type="button"
                onClick={() => setNotificationsOpen(true)}
                className="p-2 rounded-xl border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground relative transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-ping" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
              </button>

              {/* Theme Switcher */}
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-xl border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Toggle Theme"
              >
                {mounted && theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </header>

          {/* Children Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
        </div>
      </div>

      {/* Floating Bottom Nav for Mobile */}
      <MobileBottomNav />

      {/* Modals & Drawers */}
      <CommandPalette isOpen={commandOpen} onClose={() => setCommandOpen(false)} />
      <QuickAIAssistantModal isOpen={aiAssistantOpen} onClose={() => setAiAssistantOpen(false)} />
      <NotificationDrawer isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </div>
  );
}
