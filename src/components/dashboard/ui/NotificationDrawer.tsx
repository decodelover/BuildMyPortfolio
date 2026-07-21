"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCheck, Trash2, Sparkles, AlertCircle, Info, ExternalLink } from "lucide-react";
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  type?: "info" | "success" | "ai" | "alert";
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "notifications"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: NotificationItem[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as NotificationItem[];
        setNotifications(items);
      },
      (err) => {
        console.warn("Firestore notifications error:", err);
      }
    );
    return () => unsubscribe();
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "notifications", id), { isRead: true });
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "notifications", id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-sm h-full border-l border-border/60 bg-card/95 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 p-4 bg-muted/20">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Notifications</h3>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                  {notifications.filter((n) => !n.isRead).length} Unread
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="py-16 text-center text-xs text-muted-foreground font-medium space-y-2">
                  <Bell className="h-8 w-8 mx-auto opacity-30" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "p-3 rounded-xl border transition-all text-xs space-y-1 relative group",
                      n.isRead
                        ? "bg-card/40 border-border/40 text-muted-foreground"
                        : "bg-primary/5 border-primary/20 text-foreground font-semibold"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        {n.type === "ai" ? (
                          <Sparkles className="h-3.5 w-3.5 text-accent" />
                        ) : (
                          <Info className="h-3.5 w-3.5 text-primary" />
                        )}
                        {n.title}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!n.isRead && (
                          <button
                            type="button"
                            onClick={() => handleMarkAsRead(n.id)}
                            className="p-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                            title="Mark as read"
                          >
                            <CheckCheck className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(n.id)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                          title="Delete notification"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{n.message}</p>
                    <span className="block text-[9px] text-muted-foreground/60">{n.createdAt || "Just now"}</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
