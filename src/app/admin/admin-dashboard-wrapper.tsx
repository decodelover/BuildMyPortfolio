"use client";

import React from "react";
import { AdminRoute } from "@/components/shared/protected-route";
import { AdminLayout } from "@/components/admin/layout/admin-layout";

export function AdminDashboardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AdminRoute>
      <AdminLayout>{children}</AdminLayout>
    </AdminRoute>
  );
}
