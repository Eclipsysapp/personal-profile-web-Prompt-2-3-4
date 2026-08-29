import type { Metadata } from "next";
import AccessRequestDemo from "./AccessRequestDemo";

export const metadata: Metadata = {
  title: "Request Profile Access",
  description:
    "Request verified access to the protected professional profile.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
  },
};

export default function AccessPage() {
  return <AccessRequestDemo />;
}