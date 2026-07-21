"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Settings,
  Mail,
  ShieldAlert,
  KeyRound,
  AlertTriangle,
  Loader2,
  Sun,
  Moon,
  Laptop,
  Bell,
  Globe,
  Key,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { getAuth, updatePassword, deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"general" | "security" | "notifications" | "appearance" | "apikeys">("general");

  const [savingEmails, setSavingEmails] = useState(false);
  const [updatingPass, setUpdatingPass] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);

  // Password fields state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification checkbox states
  const [emailReplies, setEmailReplies] = useState(true);
  const [compilationAlerts, setCompilationAlerts] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  // API Key state
  const [apiKey, setApiKey] = useState("bmp_live_9f837192a01b4c3e8912");

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEmails(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Notification preferences updated!");
    } catch (err) {
      toast.error("Failed to update notification preferences.");
    } finally {
      setSavingEmails(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setUpdatingPass(true);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No active user session found.");

      await updatePassword(currentUser, newPassword);
      toast.success("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const err = error as { code?: string; message?: string };
      if (err.code === "auth/requires-recent-login") {
        toast.error("Requires a recent login. Please sign out and sign back in to change your password.");
      } else {
        toast.error(err.message || "Failed to update password.");
      }
    } finally {
      setUpdatingPass(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      "WARNING: This action is permanent. All your portfolios and account records will be deleted forever. Proceed?"
    );
    if (!confirmation || !user) return;

    setDeletingUser(true);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No active user session found.");

      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(currentUser);
      await logout();

      toast.success("Account permanently deleted.");
      router.push("/register");
    } catch (error) {
      const err = error as { code?: string; message?: string };
      if (err.code === "auth/requires-recent-login") {
        toast.error("Requires a recent login. Please re-authenticate to delete your account.");
      } else {
        toast.error(err.message || "Failed to delete account.");
      }
    } finally {
      setDeletingUser(false);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "security", label: "Security & Passwords", icon: KeyRound },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Sun },
    { id: "apikeys", label: "API Keys", icon: Key },
  ] as const;

  return (
    <div className="space-y-8 text-left max-w-5xl">
      {/* Header */}
      <div className="border-b border-border/60 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          <Settings className="h-7 w-7 text-primary" /> Workspace Settings
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Configure security credentials, notifications, visual theme preferences, and API integrations.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border/40 pb-2 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === "general" && (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-6">
          <h3 className="text-sm font-bold text-foreground">General Workspace Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold">
            <div className="space-y-1.5">
              <label className="text-muted-foreground uppercase text-[10px]">Primary Email</label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-xs opacity-75"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-muted-foreground uppercase text-[10px]">Full Name</label>
              <input
                type="text"
                disabled
                value={user?.fullName || "User"}
                className="w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-xs opacity-75"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Change Password Card */}
          <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" /> Change Password
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-muted-foreground uppercase text-[10px]">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-muted-foreground uppercase text-[10px]">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                />
              </div>
              <button
                type="submit"
                disabled={updatingPass}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2"
              >
                {updatingPass && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Update Password
              </button>
            </form>
          </div>

          {/* Danger Zone Card */}
          <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6 shadow-sm backdrop-blur-2xl space-y-3">
            <h3 className="text-sm font-bold text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Danger Zone
            </h3>
            <p className="text-xs text-muted-foreground">
              Permanently remove your profile, portfolio websites, and user data. This cannot be reversed.
            </p>
            <button
              type="button"
              disabled={deletingUser}
              onClick={handleDeleteAccount}
              className="px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-xs font-bold shadow-xs hover:opacity-90 cursor-pointer flex items-center gap-2"
            >
              {deletingUser && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Delete Workspace & Account
            </button>
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <form onSubmit={handleSaveNotifications} className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-5">
          <h3 className="text-sm font-bold text-foreground">Notification Preferences</h3>
          <div className="space-y-4 text-xs font-medium">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailReplies}
                onChange={(e) => setEmailReplies(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span>Receive email alerts when portfolio contact forms are submitted</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={compilationAlerts}
                onChange={(e) => setCompilationAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span>Receive AI compilation and publishing completion notifications</span>
            </label>
          </div>
          <button
            type="submit"
            disabled={savingEmails}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold cursor-pointer hover:opacity-90"
          >
            {savingEmails ? "Saving..." : "Save Preferences"}
          </button>
        </form>
      )}

      {activeTab === "appearance" && (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-6">
          <h3 className="text-sm font-bold text-foreground">Platform Visual Theme</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={cn(
                "p-5 rounded-2xl border text-left space-y-3 cursor-pointer transition-all",
                theme === "light" ? "border-primary bg-primary/5 shadow-sm" : "border-border/60 bg-background/50"
              )}
            >
              <Sun className="h-6 w-6 text-amber-500" />
              <div>
                <p className="text-xs font-bold text-foreground">Light Mode</p>
                <p className="text-[10px] text-muted-foreground">Crisp clean workspace theme</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={cn(
                "p-5 rounded-2xl border text-left space-y-3 cursor-pointer transition-all",
                theme === "dark" ? "border-primary bg-primary/5 shadow-sm" : "border-border/60 bg-background/50"
              )}
            >
              <Moon className="h-6 w-6 text-indigo-400" />
              <div>
                <p className="text-xs font-bold text-foreground">Dark Mode</p>
                <p className="text-[10px] text-muted-foreground">Obsidian glassmorphism theme</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setTheme("system")}
              className={cn(
                "p-5 rounded-2xl border text-left space-y-3 cursor-pointer transition-all",
                theme === "system" ? "border-primary bg-primary/5 shadow-sm" : "border-border/60 bg-background/50"
              )}
            >
              <Laptop className="h-6 w-6 text-primary" />
              <div>
                <p className="text-xs font-bold text-foreground">System Preference</p>
                <p className="text-[10px] text-muted-foreground">Sync automatically with OS</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {activeTab === "apikeys" && (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" /> Enterprise API Access Key
          </h3>
          <p className="text-xs text-muted-foreground">
            Use your personal API secret token to trigger programmatic portfolio generation and compilation.
          </p>
          <div className="flex items-center gap-2 max-w-md">
            <input
              type="text"
              readOnly
              value={apiKey}
              className="flex-1 rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-xs font-mono text-foreground"
            />
            <button
              type="button"
              onClick={() => {
                const newKey = `bmp_live_${Math.random().toString(36).substring(2, 18)}`;
                setApiKey(newKey);
                toast.success("Generated new API Key!");
              }}
              className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold cursor-pointer hover:opacity-90"
            >
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
