"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
  ChevronLeft,
  ChevronRight,
  Sparkles,
  User,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

interface FloatingSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  unreadNotifications: number;
}

export function FloatingSidebar({
  isCollapsed,
  onToggleCollapse,
  unreadNotifications,
}: FloatingSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const sidebarItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Portfolios", href: "/dashboard/portfolios", icon: FolderKanban },
    { label: "Create Portfolio", href: "/dashboard/create", icon: PlusCircle, highlight: true },
    { label: "Themes", href: "/dashboard/themes", icon: Palette },
    { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { label: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: unreadNotifications },
    { label: "Support", href: "/dashboard/support", icon: HelpCircle },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Sidebar logout error:", err);
    }
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border/60 bg-card/70 backdrop-blur-2xl transition-all duration-300 relative z-30 select-none",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/40">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary via-primary/80 to-accent flex items-center justify-center text-primary-foreground shadow-md shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent truncate">
              BuildMyPortfolio
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative group cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}

              {/* Badge Count */}
              {Boolean(item.badge) && item.badge! > 0 && (
                <span
                  className={cn(
                    "ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip when collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-popover text-popover-foreground text-xs font-semibold shadow-md border border-border opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Footer Card */}
      <div className="p-3 border-t border-border/40">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-muted/30 border border-border/30">
          <div className="h-8 w-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-bold text-foreground truncate">{user?.fullName || "Pro Member"}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer shrink-0"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
