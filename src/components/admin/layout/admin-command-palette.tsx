"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Users, CreditCard, BarChart3, Settings, HelpCircle, Shield } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminCommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open signal handled upstream
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigationCommands = [
    { name: "Overview Dashboard", href: "/admin", icon: BarChart3, section: "Navigation" },
    { name: "User Management Directory", href: "/admin/users", icon: Users, section: "Navigation" },
    { name: "Subscription & Invoices", href: "/admin/subscriptions", icon: CreditCard, section: "Navigation" },
    { name: "Financial & Revenue BI", href: "/admin/analytics", icon: BarChart3, section: "Analytics" },
    { name: "Support Ticket Queue", href: "/admin/support", icon: HelpCircle, section: "Operations" },
    { name: "System Settings & Flags", href: "/admin/settings", icon: Settings, section: "System" },
    { name: "Security Audit Logs", href: "/admin/audit-logs", icon: Shield, section: "Security" },
  ];

  const filteredCommands = navigationCommands.filter((cmd) =>
    cmd.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-20 p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl border border-border bg-card shadow-2xl overflow-hidden text-left">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground shrink-0 mr-3" />
          <input
            type="text"
            placeholder="Type a command or search admin features (Ctrl+K)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary transition-all">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd) => {
              const IconComponent = cmd.icon;
              return (
                <button
                  key={cmd.name}
                  onClick={() => handleSelect(cmd.href)}
                  className="w-full flex items-center justify-between rounded-xl p-2.5 text-xs text-foreground hover:bg-primary/10 hover:text-primary transition-all group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary group-hover:bg-primary/20 text-muted-foreground group-hover:text-primary transition-colors">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span className="font-semibold">{cmd.name}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground group-hover:text-primary font-mono">{cmd.section}</span>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground">No admin commands found matching "{query}"</div>
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-border bg-muted/20 px-4 py-2 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Use arrow keys to navigate</span>
          <span className="font-mono">ESC to exit</span>
        </div>
      </div>
    </div>
  );
}
