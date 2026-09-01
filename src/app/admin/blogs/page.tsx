import type { Metadata } from "next";
import AdminBlogsClient from "./AdminBlogsShell";

export const metadata: Metadata = {
  title: "Blogs | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminBlogsPage() {
  return <AdminBlogsClient view="manager" />;
}
