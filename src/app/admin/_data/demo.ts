/**
 * ============================================================
 * ADMIN DASHBOARD — DEMO / PLACEHOLDER DATA
 * ============================================================
 *
 * This is the SINGLE source of mock data for the admin dashboard
 * UI prototype. Everything the dashboard renders comes from here.
 *
 * When wiring the real Laravel API (api.anilbhimani.com), replace
 * the exported values below with fetched data that matches the
 * same shapes. Nothing in this file touches authentication or any
 * business logic — it is purely presentational placeholder content.
 * ------------------------------------------------------------
 */

export type StatTrend = "up" | "down" | "flat";

export type DashboardStat = {
  key: string;
  label: string;
  value: string;
  hint: string;
  trend: StatTrend;
  delta: string;
  icon:
    | "blogs"
    | "published"
    | "pending"
    | "comments"
    | "access"
    | "visitors";
};

export type BlogStatus = "published" | "draft" | "pending";

export type BlogRow = {
  id: string;
  title: string;
  author: string;
  category: string;
  status: BlogStatus;
  date: string;
};

export type SubmissionRow = {
  id: string;
  title: string;
  author: string;
  submitted: string;
  status: "pending" | "in_review";
};

export type CommentRow = {
  id: string;
  author: string;
  initials: string;
  preview: string;
  article: string;
  time: string;
};

export type AccessRequestRow = {
  id: string;
  name: string;
  email: string;
  device: string;
  requested: string;
  status: "pending" | "approved" | "denied";
};

export type SecuritySeverity = "info" | "success" | "warning" | "danger";

export type SecurityEvent = {
  id: string;
  title: string;
  detail: string;
  time: string;
  severity: SecuritySeverity;
};

export const adminIdentity = {
  name: "Anil Bhimani",
  role: "Administrator",
  email: "admin@anilbhimani.com",
  initials: "AB",
};

export const dashboardStats: DashboardStat[] = [
  {
    key: "total-blogs",
    label: "Total Blogs",
    value: "148",
    hint: "All articles",
    trend: "up",
    delta: "+6",
    icon: "blogs",
  },
  {
    key: "published",
    label: "Published",
    value: "121",
    hint: "Live on site",
    trend: "up",
    delta: "+4",
    icon: "published",
  },
  {
    key: "pending-submissions",
    label: "Pending Submissions",
    value: "9",
    hint: "Community drafts",
    trend: "up",
    delta: "+3",
    icon: "pending",
  },
  {
    key: "pending-comments",
    label: "Pending Comments",
    value: "17",
    hint: "Awaiting moderation",
    trend: "down",
    delta: "-2",
    icon: "comments",
  },
  {
    key: "access-requests",
    label: "Access Requests",
    value: "6",
    hint: "New this week",
    trend: "up",
    delta: "+2",
    icon: "access",
  },
  {
    key: "visitors",
    label: "Visitors",
    value: "3.4k",
    hint: "Last 30 days",
    trend: "up",
    delta: "+12%",
    icon: "visitors",
  },
];

export const recentBlogs: BlogRow[] = [
  {
    id: "b1",
    title: "Designing Resilient Systems for the Modern Web",
    author: "Anil Bhimani",
    category: "Engineering",
    status: "published",
    date: "Aug 28, 2026",
  },
  {
    id: "b2",
    title: "A Practical Guide to Progressive Enhancement",
    author: "Anil Bhimani",
    category: "Frontend",
    status: "published",
    date: "Aug 24, 2026",
  },
  {
    id: "b3",
    title: "Rethinking Access Control for Personal Sites",
    author: "Priya Nair",
    category: "Security",
    status: "pending",
    date: "Aug 22, 2026",
  },
  {
    id: "b4",
    title: "Notes on Editorial Typography Systems",
    author: "Anil Bhimani",
    category: "Design",
    status: "draft",
    date: "Aug 19, 2026",
  },
  {
    id: "b5",
    title: "Shipping Faster with Confident Caching",
    author: "Rahul Mehta",
    category: "Performance",
    status: "published",
    date: "Aug 15, 2026",
  },
];

export const pendingSubmissions: SubmissionRow[] = [
  {
    id: "s1",
    title: "How I Migrated a Legacy Blog to the App Router",
    author: "Karan Shah",
    submitted: "2 hours ago",
    status: "pending",
  },
  {
    id: "s2",
    title: "Building Accessible Data Tables from Scratch",
    author: "Meera Iyer",
    submitted: "Yesterday",
    status: "in_review",
  },
  {
    id: "s3",
    title: "A Field Guide to Type Scales",
    author: "Devang Patel",
    submitted: "2 days ago",
    status: "pending",
  },
];

export const pendingComments: CommentRow[] = [
  {
    id: "c1",
    author: "Sana Kapoor",
    initials: "SK",
    preview:
      "This finally made caching click for me — the diagram in section three is excellent.",
    article: "Shipping Faster with Confident Caching",
    time: "18m ago",
  },
  {
    id: "c2",
    author: "Vikram Rao",
    initials: "VR",
    preview:
      "Would love a follow-up on how this holds up under heavy write traffic.",
    article: "Designing Resilient Systems for the Modern Web",
    time: "1h ago",
  },
  {
    id: "c3",
    author: "Ananya Das",
    initials: "AD",
    preview: "Great breakdown. Bookmarking the progressive enhancement bits.",
    article: "A Practical Guide to Progressive Enhancement",
    time: "3h ago",
  },
];

export const accessRequests: AccessRequestRow[] = [
  {
    id: "a1",
    name: "Nikhil Verma",
    email: "nikhil.verma@example.com",
    device: "Chrome · macOS",
    requested: "12 min ago",
    status: "pending",
  },
  {
    id: "a2",
    name: "Leah Fernandes",
    email: "leah.f@example.com",
    device: "Safari · iPhone",
    requested: "40 min ago",
    status: "pending",
  },
  {
    id: "a3",
    name: "Omar Sheikh",
    email: "omar.sheikh@example.com",
    device: "Firefox · Windows",
    requested: "2 hours ago",
    status: "approved",
  },
  {
    id: "a4",
    name: "Grace Lin",
    email: "grace.lin@example.com",
    device: "Edge · Windows",
    requested: "Yesterday",
    status: "denied",
  },
];

export const securityEvents: SecurityEvent[] = [
  {
    id: "e1",
    title: "Successful admin login",
    detail: "Chrome · macOS · 103.4.22.19",
    time: "Just now",
    severity: "success",
  },
  {
    id: "e2",
    title: "Failed access attempt",
    detail: "Invalid access code · 4 tries · 88.12.9.4",
    time: "26m ago",
    severity: "danger",
  },
  {
    id: "e3",
    title: "New device authorized",
    detail: "iPhone · Safari · approved by admin",
    time: "1h ago",
    severity: "info",
  },
  {
    id: "e4",
    title: "Access code regenerated",
    detail: "Visitor code rotated for the month",
    time: "5h ago",
    severity: "warning",
  },
  {
    id: "e5",
    title: "Successful admin login",
    detail: "Edge · Windows · 45.9.201.3",
    time: "Yesterday",
    severity: "success",
  },
];
