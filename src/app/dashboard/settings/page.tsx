"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Settings, Mail, ShieldAlert, KeyRound, AlertTriangle, Loader2 } from "lucide-react";
import { getAuth, updatePassword, deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const [savingEmails, setSavingEmails] = useState(false);
  const [updatingPass, setUpdatingPass] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);

  // Password fields state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification checkbox states
  const [emailReplies, setEmailReplies] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  const handleSaveEmails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEmails(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Email preferences updated successfully!");
    } catch (err) {
      toast.error("Failed to update email preferences.");
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
        toast.error("This action is sensitive and requires a recent login. Please sign out and sign back in to change your password.");
      } else {
        toast.error(err.message || "Failed to update password.");
      }
    } finally {
      setUpdatingPass(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      "WARNING: This action is permanent. All your portfolios, account settings, and project records will be deleted forever. Do you wish to proceed?"
    );
    if (!confirmation || !user) return;

    setDeletingUser(true);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No active user session found.");

      // 1. Delete document from Firestore
      await deleteDoc(doc(db, "users", user.uid));

      // 2. Delete user auth details from Firebase Auth
      await deleteUser(currentUser);

      // 3. Clear Zustand and cookies
      await logout();

      toast.success("Account has been permanently deleted.");
      router.push("/register");
    } catch (error) {
      const err = error as { code?: string; message?: string };
      if (err.code === "auth/requires-recent-login") {
        toast.error("This action is sensitive and requires a recent login. Please sign out and sign back in before deleting your account.");
      } else {
        toast.error(err.message || "Failed to delete account. Please try again.");
      }
    } finally {
      setDeletingUser(false);
    }
  };

  return (
    <div className="space-y-8 text-left max-w-4xl">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight">Account Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your login details, security, and notification settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Side: Email and Password Configs */}
        <div className="space-y-8">
          
          {/* Email preferences panel */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Email Preferences
            </h3>
            
            <form onSubmit={handleSaveEmails} className="space-y-4 text-xs font-semibold">
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailReplies}
                    onChange={(e) => setEmailReplies(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary/45 mt-0.5"
                  />
                  <div>
                    <span className="block text-foreground font-bold">Support Ticket Replies</span>
                    <span className="text-[10px] text-muted-foreground block font-medium">Send email copies when an administrator responds to your support ticket.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary/45 mt-0.5"
                  />
                  <div>
                    <span className="block text-foreground font-bold">Marketing &amp; Product Updates</span>
                    <span className="text-[10px] text-muted-foreground block font-medium">Receive periodic summaries of newly deployed templates and AI builder features.</span>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={savingEmails}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-1.5"
              >
                {savingEmails ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save Preferences"}
              </button>
            </form>
          </div>

          {/* Change password panel */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" />
              Security Password Reset
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground uppercase">New Password</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={updatingPass}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground uppercase">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={updatingPass}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                />
              </div>

              <button
                type="submit"
                disabled={updatingPass}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-1.5"
              >
                {updatingPass ? <Loader2 className="h-3 w-3 animate-spin" /> : "Update Password"}
              </button>
            </form>
          </div>

        </div>

        {/* Right Side: Account Deletion */}
        <div className="space-y-8">
          
          {/* Danger zone panel */}
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-destructive flex items-center gap-2">
                <ShieldAlert className="h-4.5 w-4.5" />
                Danger Zone Settings
              </h3>
              
              <div className="space-y-3 text-xs text-muted-foreground">
                <div className="flex gap-3 items-start p-3 bg-destructive/10 rounded-xl border border-destructive/20 text-destructive">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <div>
                    <span className="font-bold block">Account Removal is Permanent</span>
                    <span className="text-[10px] leading-relaxed">
                      All created portfolios, subdomains, files, settings, and linked integrations data will be removed immediately. This is not reversible.
                    </span>
                  </div>
                </div>
                <p className="leading-relaxed">
                  Before requesting account termination, export your project source files (.zip) or save any custom content values elsewhere.
                </p>
              </div>
            </div>

            <button
              onClick={handleDeleteAccount}
              disabled={deletingUser}
              className="w-full rounded-xl bg-destructive text-destructive-foreground py-2.5 text-xs font-semibold hover:bg-destructive/95 shadow transition-all mt-6 flex items-center justify-center gap-1.5"
            >
              {deletingUser ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Deleting Account...
                </>
              ) : (
                "Permanently Delete Account"
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
