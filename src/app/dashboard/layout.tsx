"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useTheme } from "next-themes";
import { ProtectedRoute } from "@/components/shared/protected-route";
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
  Menu,
  X,
  Sun,
  Moon,
  Search,
  ChevronDown,
  User,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Portfolios", href: "/dashboard/portfolios", icon: FolderKanban },
  { label: "Create Portfolio", href: "/dashboard/create", icon: PlusCircle },
  { label: "Themes", href: "/dashboard/themes", icon: Palette },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: true },
  { label: "Support", href: "/dashboard/support", icon: HelpCircle },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Sync mount cycle
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
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadNotifications(snapshot.size);
    });
    return () => unsubscribe();
  }, [user]);

  // Construct breadcrumbs
  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter((p) => p);
    return paths.map((path, idx) => {
      const href = "/" + paths.slice(0, idx + 1).join("/");
      const label = path.charAt(0).toUpperCase() + path.slice(1);
      const isLast = idx === paths.length - 1;
      return { label, href, isLast };
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Dashboard signout error:", err);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/65 backdrop-blur-md shrink-0">
          <div className="flex h-16 items-center px-6 border-b border-border">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg tracking-tight">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-accent text-primary-foreground shadow-md">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <span className="bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent">
                BuildMyPortfolio
              </span>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4.5 w-4.5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && unreadNotifications > 0 && (
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold",
                      isActive ? "bg-white text-primary" : "bg-primary text-white"
                    )}>
                      {unreadNotifications}
                    </span>
                  )}
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors mt-6 text-left"
            >
              <LogOut className="h-4.5 w-4.5" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Mobile sidebar drawer */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              {/* Overlay Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-black lg:hidden"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card flex flex-col lg:hidden"
              >
                <div className="flex h-16 items-center justify-between px-6 border-b border-border">
                  <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-accent text-white">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <span>BuildMyPortfolio</span>
                  </Link>
                  <button onClick={() => setIsSidebarOpen(false)} className="rounded-lg p-1.5 hover:bg-muted">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4.5 w-4.5" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && unreadNotifications > 0 && (
                          <span className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            isActive ? "bg-white text-primary" : "bg-primary text-white"
                          )}>
                            {unreadNotifications}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors mt-6 text-left"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                    <span>Logout</span>
                  </button>
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
          
          {/* Top Navbar */}
          <header className="h-16 border-b border-border bg-card/65 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30 transition-colors">
            
            {/* Left side: Breadcrumbs and Mobile trigger */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden rounded-lg p-2 hover:bg-muted text-muted-foreground"
                aria-label="Open menu drawer"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Dynamic Breadcrumbs */}
              <nav className="hidden sm:flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  Dashboard
                </Link>
                {getBreadcrumbs().map((bc) => (
                  <span key={bc.href} className="flex items-center gap-2">
                    <span className="opacity-45">/</span>
                    {bc.isLast ? (
                      <span className="text-foreground font-bold">{bc.label}</span>
                    ) : (
                      <Link href={bc.href} className="hover:text-primary transition-colors">
                        {bc.label}
                      </Link>
                    )}
                  </span>
                ))}
              </nav>
            </div>

            {/* Right side: Actions & User Menu */}
            <div className="flex items-center gap-4">
              
              {/* Search input box */}
              <div className="relative hidden md:block max-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Global search..."
                  className="w-full rounded-lg border border-border bg-background px-8 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/45"
                />
              </div>

              {/* Theme switch button */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-lg p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Toggle visual theme"
                >
                  {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
                </button>
              )}

              {/* Notifications link shortcut */}
              <Link
                href="/dashboard/notifications"
                className="relative rounded-lg p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="View notifications catalog"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-primary" />
                )}
              </Link>

              {/* Profile drop-down trigger */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 rounded-lg p-1 hover:bg-muted transition-colors"
                  aria-label="Toggle user actions dropdown"
                >
                  <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs overflow-hidden border border-border">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="User Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", isProfileOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      {/* Close click blocker */}
                      <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card p-2.5 shadow-xl z-50 space-y-1 text-left"
                      >
                        <div className="px-2.5 py-1.5 border-b border-border mb-1.5 pb-2">
                          <p className="text-xs font-bold text-foreground truncate">{user?.fullName}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                        </div>
                        
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold hover:bg-muted text-foreground transition-colors"
                        >
                          <User className="h-4 w-4" />
                          View Profile
                        </Link>
                        
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold hover:bg-muted text-foreground transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>

                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            handleLogout();
                          }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </header>

          {/* Children views pages */}
          <main className="flex-1 p-6 relative">
            {children}
          </main>

        </div>
      </div>
    </ProtectedRoute>
  );
}
