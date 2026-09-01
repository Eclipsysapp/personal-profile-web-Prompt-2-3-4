import type { ComponentType, SVGProps } from "react";
import {
  AccessIcon,
  BlogsIcon,
  CommentsIcon,
  DashboardIcon,
  SecurityIcon,
  VisitorsIcon,
} from "./icons";

export type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  badge?: string;
};

/**
 * Admin navigation. Routes that aren't part of this UI prototype yet
 * point at `/admin` anchors so the shell stays self-contained without
 * creating placeholder pages or fake endpoints.
 */
export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: DashboardIcon },
  { label: "Blogs", href: "/admin/blogs", icon: BlogsIcon },
  { label: "Comments", href: "/admin/comments", icon: CommentsIcon },
  {
    label: "Access Requests",
    href: "/admin/access-requests",
    icon: AccessIcon,
  },
  { label: "Visitors", href: "/admin/visitors", icon: VisitorsIcon },
  { label: "Security & Audit", href: "/admin/security", icon: SecurityIcon },
];
