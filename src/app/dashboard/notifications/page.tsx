"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc, writeBatch, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { Bell, Loader2, Check, Trash2, CheckSquare, BellOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Timestamp | null;
}

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Subscribe to real-time notifications in Firestore database
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loaded: NotificationItem[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          loaded.push({
            id: doc.id,
            title: data.title || "System Message",
            message: data.message || "",
            isRead: !!data.isRead,
            createdAt: data.createdAt as Timestamp,
          });
        });
        setNotifications(loaded);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore notifications sync error:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const docRef = doc(db, "notifications", id);
      await updateDoc(docRef, { isRead: true });
    } catch (err) {
      toast.error("Failed to update notification status.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const docRef = doc(db, "notifications", id);
      await deleteDoc(docRef);
      toast.success("Notification removed.");
    } catch (err) {
      toast.error("Failed to delete notification.");
    }
  };

  const handleMarkAllRead = async () => {
    if (!user || notifications.length === 0) return;
    setActionLoading(true);
    try {
      const unread = notifications.filter((n) => !n.isRead);
      if (unread.length === 0) {
        toast.info("All notifications are already read.");
        return;
      }
      
      const batch = writeBatch(db);
      unread.forEach((n) => {
        const docRef = doc(db, "notifications", n.id);
        batch.update(docRef, { isRead: true });
      });
      await batch.commit();
      toast.success("All notifications marked as read!");
    } catch (err) {
      toast.error("Failed to update notifications.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!user || notifications.length === 0) return;
    const confirm = window.confirm("Are you sure you want to clear your notification history?");
    if (!confirm) return;

    setActionLoading(true);
    try {
      const batch = writeBatch(db);
      notifications.forEach((n) => {
        const docRef = doc(db, "notifications", n.id);
        batch.delete(docRef);
      });
      await batch.commit();
      toast.success("Notification history cleared!");
    } catch (err) {
      toast.error("Failed to clear notifications.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-left max-w-4xl">
      
      {/* Header section with action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight">Notification Center</h1>
          <p className="text-sm text-muted-foreground">Keep track of your system logs, support alerts, and builder alerts.</p>
        </div>

        {notifications.length > 0 && (
          <div className="flex gap-2 text-xs font-semibold">
            <button
              onClick={handleMarkAllRead}
              disabled={actionLoading}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 hover:bg-muted transition-colors disabled:opacity-50"
            >
              <CheckSquare className="h-4 w-4 text-primary" />
              Mark all read
            </button>
            <button
              onClick={handleClearAll}
              disabled={actionLoading}
              className="flex items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive px-3 py-2 hover:bg-destructive/10 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Clear all
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-2">
          <Loader2 className="h-8 w-8 animate-spin opacity-45" />
          <p className="text-xs">Syncing notifications...</p>
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence initial={false} mode="popLayout">
            {notifications.map((n) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex items-start justify-between rounded-xl border p-4 shadow-sm bg-card transition-all relative overflow-hidden",
                  !n.isRead ? "border-primary/45 bg-primary/5" : "border-border hover:border-primary/20"
                )}
              >
                {!n.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                )}
                
                <div className="flex gap-4 items-start text-xs text-left pr-4">
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg border shrink-0",
                    !n.isRead ? "bg-primary/10 border-primary/20 text-primary" : "bg-secondary border-border text-muted-foreground"
                  )}>
                    <Bell className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-foreground flex items-center gap-2">
                      {n.title}
                      {!n.isRead && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed text-xs">{n.message}</p>
                    <span className="text-[10px] text-muted-foreground block pt-1">
                      {n.createdAt ? n.createdAt.toDate().toLocaleString() : "Recently"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-1">
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="rounded-lg p-1.5 hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="rounded-lg p-1.5 hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                    title="Remove notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-2 text-center">
          <BellOff className="h-10 w-10 opacity-35" />
          <p className="text-xs font-semibold">All caught up!</p>
          <p className="text-[10px] max-w-xs">You have no active notifications. System messages will show up here.</p>
        </div>
      )}

    </div>
  );
}
