"use client";

import { ProtectedRoute } from "@/components/shared/protected-route";
import { BespokeWorkspaceLayout } from "@/components/dashboard/workspace/BespokeWorkspaceLayout";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <BespokeWorkspaceLayout>{children}</BespokeWorkspaceLayout>
    </ProtectedRoute>
  );
}
