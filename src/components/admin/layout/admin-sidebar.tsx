"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  HelpCircle,
  Settings,
  Shield,
  ChevronRight,
  Sparkles,
  Folder,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({ isOpen, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Users & Roles", href: "/admin/users", icon: Users },
    { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
    { label: "Portfolios Directory", href: "/admin/portfolios", icon: Folder },
    { label: "AI Operations", href: "/admin/ai-ops", icon: Sparkles },
    { label: "Analytics & BI", href: "/admin/analytics", icon: BarChart3 },
    { label: "Support Tickets", href: "/admin/support", icon: HelpCircle },
    { label: "System Settings", href: "/admin/settings", icon: Settings },
    { label: "Security Audit", href: "/admin/audit-logs", icon: Shield },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col justify-between p-4 text-left">
        <div className="space-y-6">
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3 px-2 pt-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md font-black">
              BP
            </div>
            <div>
              <span className="text-sm font-extrabold text-foreground tracking-tight block">BuildMyPortfolio</span>
              <span className="text-[10px] font-extrabold uppercase text-primary tracking-wider block">Admin Console</span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            <span className="px-3 text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider block mb-2">
              Management Modules
            </span>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* System Health Footer Banner */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-600">Platform Status</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <p className="text-[11px] text-muted-foreground">All 12 microservices operating at 99.98% uptime.</p>
        </div>
      </div>
    </aside>
  );
}
