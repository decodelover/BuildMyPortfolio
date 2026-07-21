"use client";

import { useState } from "react";
import { AdminRoute } from "@/components/shared/protected-route";
import { 
  Users, 
  Briefcase, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  Search, 
  Filter, 
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertTriangle
} from "lucide-react";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
}

function AdminStatCard({ title, value, description, icon: Icon, trend }: AdminStatCardProps) {
  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          {trend && <span className="text-emerald-500 font-medium">{trend}</span>}
          {description}
        </p>
      </div>
    </div>
  );
}

export function AdminDashboardContent() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockStats = [
    { title: "Total Users", value: "2,845", description: "Across Free, Pro, and Elite tiers", icon: Users, trend: "+12%" },
    { title: "Active Portfolios", value: "1,920", description: "Deployed & live on production CDN", icon: Briefcase, trend: "+18%" },
    { title: "AI Generation Jobs", value: "14,302", description: "Successfully compiled blueprints", icon: Cpu, trend: "+24%" },
    { title: "System Health", value: "99.98%", description: "All services operating normally", icon: ShieldCheck, trend: "Optimal" },
  ];

  const mockUsers = [
    { id: "usr_1", name: "Alex Morgan", email: "alex@example.com", plan: "PRO", status: "Active", joined: "2026-06-12" },
    { id: "usr_2", name: "Sarah Chen", email: "sarah.c@example.com", plan: "ELITE", status: "Active", joined: "2026-05-20" },
    { id: "usr_3", name: "David Kim", email: "dkim@example.com", plan: "FREE", status: "Active", joined: "2026-07-01" },
    { id: "usr_4", name: "Elena Rostova", email: "elena@example.com", plan: "PRO", status: "Active", joined: "2026-07-15" },
  ];

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Console</h1>
          <p className="text-muted-foreground text-sm mt-1">
            System administration, user oversight, and platform metrics dashboard.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.location.reload()} 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-card text-foreground hover:bg-accent text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh State
          </button>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {mockStats.map((stat, idx) => (
          <AdminStatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Directory Table (Takes 2 cols) */}
        <div className="lg:col-span-2 bg-card border rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Registered Accounts</h2>
              <p className="text-xs text-muted-foreground">Manage system users and access roles</p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search user or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-muted-foreground font-medium">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Subscription Plan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-foreground">{u.name}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        u.plan === "ELITE" ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" :
                        u.plan === "PRO" ? "bg-primary/10 text-primary border border-primary/20" :
                        "bg-secondary text-secondary-foreground"
                      }`}>
                        {u.plan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted-foreground">{u.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Activity & Services Status */}
        <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Infrastructure Status</h2>
            <p className="text-xs text-muted-foreground">Live service monitoring</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium">Firebase Auth & Firestore</span>
              </div>
              <span className="text-xs text-emerald-600 font-semibold px-2 py-0.5 bg-emerald-500/10 rounded">Healthy</span>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
              <div className="flex items-center gap-3">
                <Cpu className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Gemini AI Orchestrator</span>
              </div>
              <span className="text-xs text-emerald-600 font-semibold px-2 py-0.5 bg-emerald-500/10 rounded">Healthy</span>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">CDN & Static Publishing</span>
              </div>
              <span className="text-xs text-emerald-600 font-semibold px-2 py-0.5 bg-emerald-500/10 rounded">Healthy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  return (
    <AdminRoute>
      <AdminDashboardContent />
    </AdminRoute>
  );
}
