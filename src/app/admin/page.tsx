import type { Metadata } from "next";
import AdminDashboardClient from "./RealAdminDashboardClient";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
