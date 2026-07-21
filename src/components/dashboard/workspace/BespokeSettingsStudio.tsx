"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Settings,
  Shield,
  Bell,
  Sun,
  Moon,
  Key,
  Globe,
  Save,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function BespokeSettingsStudio() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"general" | "security" | "notifications" | "appearance" | "apikeys">("general");

  // Local State
  const [workspaceName, setWorkspaceName] = useState("Alex Carter Workspace");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [apiKey, setApiKey] = useState("bmp_live_8f92a10b4c73e19a28");

  const handleSave = () => {
    toast.success("Workspace settings updated successfully!");
  };

  return (
    <div className="space-y-6 text-left select-none">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" /> Workspace Settings
        </h1>
        <p className="text-xs text-muted-foreground font-medium">
          Configure workspace preferences, security controls, notification webhooks, and API keys.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-border/40 pb-2">
        {[
          { id: "general", label: "General", icon: Settings },
          { id: "security", label: "Security & Passwords", icon: Shield },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "appearance", label: "Appearance", icon: Sun },
          { id: "apikeys", label: "API Keys", icon: Key },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                activeTab === t.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="rounded-3xl border border-border/60 bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-2xl max-w-3xl">
        {activeTab === "general" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">Workspace Name</label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary/45"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">Primary Deployment Region</label>
              <select className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-xs font-medium focus:outline-none">
                <option>Global Edge CDN (US-East / EU-Central)</option>
                <option>Asia Pacific (Tokyo)</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">Current Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-xs font-medium focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">New Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-xs font-medium focus:outline-none"
              />
            </div>
          </div>
        )}

        {activeTab === "appearance" && (
          <div className="space-y-4">
            <label className="text-xs font-bold text-foreground">Select Interface Theme</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={cn(
                  "p-4 rounded-2xl border text-center space-y-2 cursor-pointer transition-all",
                  theme === "dark" ? "border-primary bg-primary/10" : "border-border/60 bg-background/60"
                )}
              >
                <Moon className="h-6 w-6 text-amber-400 mx-auto" />
                <span className="text-xs font-bold block">Dark Mode</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={cn(
                  "p-4 rounded-2xl border text-center space-y-2 cursor-pointer transition-all",
                  theme === "light" ? "border-primary bg-primary/10" : "border-border/60 bg-background/60"
                )}
              >
                <Sun className="h-6 w-6 text-amber-500 mx-auto" />
                <span className="text-xs font-bold block">Light Mode</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === "apikeys" && (
          <div className="space-y-4">
            <label className="text-xs font-bold text-foreground">Workspace Live API Key</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={apiKey}
                className="w-full rounded-xl border border-border/60 bg-background/80 px-3.5 py-2.5 text-xs font-mono text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(apiKey);
                  toast.success("API key copied!");
                }}
                className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shrink-0"
              >
                Copy Key
              </button>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="pt-6 border-t border-border/40 mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-extrabold shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer"
          >
            <Save className="h-4 w-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
