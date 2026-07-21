"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { FloatingSidebar } from "@/components/dashboard/ui/FloatingSidebar";
import { FloatingNavHeader } from "@/components/dashboard/ui/FloatingNavHeader";
import { MobileBottomNav } from "@/components/dashboard/ui/MobileBottomNav";
import { CommandPalette } from "@/components/dashboard/ui/CommandPalette";
import { QuickAIAssistantModal } from "@/components/dashboard/ui/QuickAIAssistantModal";
import { NotificationDrawer } from "@/components/dashboard/ui/NotificationDrawer";
import { useAuthStore } from "@/store/useAuthStore";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  Palette,
  CreditCard,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync real-time unread notification count from Firestore
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      where("isRead", "==", false)
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setUnreadNotifications(snapshot.size);
      },
      (error) => {
        console.warn("Firestore notification count error:", error.message);
        setUnreadNotifications(0);
      }
    );
    return () => unsubscribe();
  }, [user]);

  if (!mounted) return null;

  const mobileNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Portfolios", href: "/dashboard/portfolios", icon: FolderKanban },
    { label: "Create Portfolio", href: "/dashboard/create", icon: PlusCircle },
    { label: "Themes", href: "/dashboard/themes", icon: Palette },
    { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { label: "Support", href: "/dashboard/support", icon: HelpCircle },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
        {/* Workspace Main Grid */}
        <div className="flex-1 flex overflow-hidden">
          {/* Desktop Floating Sidebar */}
          <FloatingSidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            unreadNotifications={unreadNotifications}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <FloatingNavHeader
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
              onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
              unreadNotifications={unreadNotifications}
            />

            {/* Page View Container */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full space-y-6">
              {children}
            </main>
          </div>
        </div>

        {/* Mobile Sidebar Overlay Drawer */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileSidebarOpen(false)}
                className="fixed inset-0 bg-background/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative w-4/5 max-w-xs h-full bg-card border-r border-border p-5 flex flex-col shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <span className="font-extrabold text-sm text-foreground">BuildMyPortfolio</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-1">
                  {mobileNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        )}
                      >
                        <Icon className="h-4.5 w-4.5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileSidebarOpen(false);
                    logout();
                  }}
                  className="mt-4 flex items-center gap-2 p-3 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs font-bold w-full justify-center"
                >
                  <LogOut className="h-4 w-4" /> Log Out
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Mobile Floating Bottom Nav */}
        <MobileBottomNav onOpenAIAssistant={() => setIsAIAssistantOpen(true)} />

        {/* Interactive Modals & Drawers */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        />
        <QuickAIAssistantModal
          isOpen={isAIAssistantOpen}
          onClose={() => setIsAIAssistantOpen(false)}
        />
        <NotificationDrawer
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />
      </div>
    </ProtectedRoute>
  );
}
