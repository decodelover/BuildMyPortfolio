"use client";

import React, { useState } from "react";
import { Settings, ShieldAlert, Power, RefreshCw } from "lucide-react";
import { AdminSystemSettingsService } from "@/lib/admin/admin-service-registry";

export function AdminSettingsManagement() {
  const [maintenance, setMaintenance] = useState(AdminSystemSettingsService.isMaintenanceMode());
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const toggleMaintenance = () => {
    try {
      const res = AdminSystemSettingsService.toggleMaintenanceMode("SUPER_ADMIN", !maintenance);
      setMaintenance(res.maintenanceMode);
      setStatusMessage(`System maintenance mode set to ${res.maintenanceMode}.`);
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          System Configuration &amp; Feature Flags
        </h2>
        <p className="text-xs text-muted-foreground">Manage global SaaS platform parameters, emergency maintenance modes, and feature toggles.</p>
      </div>

      {statusMessage && (
        <div className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-xs text-primary font-semibold">
          {statusMessage}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm max-w-lg space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-500" /> Maintenance Mode Emergency Switch
        </h3>
        <p className="text-xs text-muted-foreground">
          Enabling maintenance mode prevents non-admin users from creating or modifying portfolios during database maintenance windows.
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-bold text-foreground">
            Status: <strong className={maintenance ? "text-rose-500" : "text-emerald-500"}>{maintenance ? "ACTIVE (MAINTENANCE)" : "NORMAL OPERATIONAL"}</strong>
          </span>
          <button
            onClick={toggleMaintenance}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow ${
              maintenance ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-rose-600 text-white hover:bg-rose-700"
            }`}
          >
            {maintenance ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
          </button>
        </div>
      </div>
    </div>
  );
}
