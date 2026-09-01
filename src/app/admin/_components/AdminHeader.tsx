"use client";

import type { AdminIdentity } from "@/lib/admin-api";
import {
  BellIcon,
  MenuIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
} from "./icons";

type AdminHeaderProps = {
  title: string;
  subtitle: string;
  theme: "light" | "dark";
  themeReady: boolean;
  onToggleTheme: () => void;
  onOpenMenu: () => void;
  admin:AdminIdentity;
};

export default function AdminHeader({
  title,
  subtitle,
  theme,
  themeReady,
  onToggleTheme,
  onOpenMenu,
  admin,
}: AdminHeaderProps) {
  return (
    <header className="adx-header">
      <button
        type="button"
        className="adx-icon-btn adx-menu-toggle"
        onClick={onOpenMenu}
        aria-label="Open navigation"
      >
        <MenuIcon />
      </button>

      <div className="adx-header-titles">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="adx-header-tools">
        <div className="adx-search" role="search">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search dashboard…"
            aria-label="Search dashboard"
          />
        </div>

        <button
          type="button"
          className="adx-icon-btn"
          onClick={onToggleTheme}
          aria-label={
            theme === "dark"
              ? "Switch to light theme"
              : "Switch to dark theme"
          }
        >
          {themeReady && theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>

        <button
          type="button"
          className="adx-icon-btn"
          aria-label="Notifications"
        >
          <BellIcon />
          <span className="adx-dot" aria-hidden />
        </button>

        <button type="button" className="adx-header-avatar">
          <span className="adx-avatar" aria-hidden>
            {admin.name.split(/\s+/).map(part=>part[0]).join("").slice(0,2).toUpperCase()}
          </span>
          <span>{admin.name}</span>
        </button>
      </div>
    </header>
  );
}
