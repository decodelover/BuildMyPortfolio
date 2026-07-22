"use client";

import React, { useState } from "react";
import { Search, Bell, ShieldCheck, Menu, Command } from "lucide-react";
import { AdminRole } from "@/lib/admin/admin-rbac-engine";

interface AdminHeaderProps {
  onOpenSidebar: () => void;
  onOpenCommandPalette: () => void;
  adminRole?: AdminRole;
}

export function AdminHeader({ onOpenSidebar, onOpenCommandPalette, adminRole = "SUPER_ADMIN" }: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-4 lg:px-8">
      {/* Left: Mobile Toggle & Quick Search Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="rounded-xl p-2 text-muted-foreground hover:bg-secondary lg:hidden transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Bar Command Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:bg-background transition-all w-48 sm:w-72 justify-between"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">Search admin console...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground border border-border">
            <Command className="h-3 w-3" />K
          </kbd>
        </button>
      </div>

      {/* Right: Notifications, Role Badge & User Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl border border-border bg-background p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card p-4 shadow-xl text-left space-y-3 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-bold text-foreground">Admin System Alerts</span>
                <span className="text-[10px] font-semibold text-primary">3 New</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-muted/30 space-y-0.5">
                  <span className="font-bold text-foreground block">Paystack Webhook Verified</span>
                  <span className="text-[11px] text-muted-foreground block">Subscription renewal event recorded.</span>
                </div>
                <div className="p-2 rounded-xl bg-muted/30 space-y-0.5">
                  <span className="font-bold text-foreground block">High AI Queue Usage</span>
                  <span className="text-[11px] text-muted-foreground block">Orchestrator peak latency 420ms.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Role Badge */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-extrabold text-primary border border-primary/20">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>{adminRole.replace("_", " ")}</span>
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground font-bold border border-border shadow-sm">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
