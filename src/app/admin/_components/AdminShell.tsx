"use client";

import { useState, type ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useAdminTheme } from "./useAdminTheme";
import "../admin.css";

type AdminShellProps = {
  title: string;
  subtitle: string;
  activeHref: string;
  children: ReactNode;
};

export default function AdminShell({
  title,
  subtitle,
  activeHref,
  children,
}: AdminShellProps) {
  const { theme, toggle, mounted } = useAdminTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className={`adx${drawerOpen ? " is-drawer-open" : ""}`}>
      <div className="adx-shell">
        <div
          className="adx-overlay"
          onClick={() => setDrawerOpen(false)}
          aria-hidden
        />

        <AdminSidebar
          activeHref={activeHref}
          onNavigate={() => setDrawerOpen(false)}
        />

        <div className="adx-main">
          <AdminHeader
            title={title}
            subtitle={subtitle}
            theme={theme}
            themeReady={mounted}
            onToggleTheme={toggle}
            onOpenMenu={() => setDrawerOpen(true)}
          />
          <main className="adx-content">{children}</main>
        </div>
      </div>
    </div>
  );
}
