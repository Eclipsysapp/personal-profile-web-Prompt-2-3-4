import type { Metadata } from "next";
import "../community-login.css";

export const metadata: Metadata = {
  title: "Author sign in",
  description:
    "Sign in to the Anil Bhimani blog community to draft and submit articles.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
