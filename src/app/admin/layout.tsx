import React from "react";
import { Metadata } from "next";
import { AdminDashboardWrapper } from "./admin-dashboard-wrapper";

export const metadata: Metadata = {
  title: "Admin Console | BuildMyPortfolio",
  description: "Enterprise administration, telemetry, user management, and business intelligence platform.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayoutPage({ children }: { children: React.ReactNode }) {
  return <AdminDashboardWrapper>{children}</AdminDashboardWrapper>;
}
