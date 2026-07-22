"use client";

import React, { useState } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { AdminCommandPalette } from "./admin-command-palette";
import { AdminRole } from "@/lib/admin/admin-rbac-engine";

interface AdminLayoutProps {
  children: React.ReactNode;
  adminRole?: AdminRole;
}

export function AdminLayout({ children, adminRole = "SUPER_ADMIN" }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Responsive Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />

      {/* Main Content Workspace */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <AdminHeader
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          adminRole={adminRole}
        />

        {/* Dynamic Page Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">{children}</main>

        {/* Footer */}
        <footer className="border-t border-border bg-card/50 px-6 py-3 text-center text-xs text-muted-foreground">
          <span>BuildMyPortfolio Enterprise Admin Console &copy; 2026. All operations authenticated &amp; audited.</span>
        </footer>
      </div>

      {/* Command Palette Modal */}
      <AdminCommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </div>
  );
}
