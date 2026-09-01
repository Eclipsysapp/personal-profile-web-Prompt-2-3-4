"use client";

import Link from "next/link";
import { adminIdentity } from "../_data/demo";
import { navItems } from "./nav";
import { CloseIcon, LogoutIcon } from "./icons";

type AdminSidebarProps = {
  activeHref: string;
  onNavigate: () => void;
};

export default function AdminSidebar({
  activeHref,
  onNavigate,
}: AdminSidebarProps) {
  return (
    <aside className="adx-sidebar" aria-label="Admin navigation">
      <button
        type="button"
        className="adx-sidebar-close"
        onClick={onNavigate}
        aria-label="Close navigation"
      >
        <CloseIcon />
      </button>

      <div className="adx-sidebar-brand">
        <span className="adx-brand-mark" aria-hidden>
          {adminIdentity.initials}
        </span>
        <span className="adx-brand-copy">
          <strong>Anil Bhimani</strong>
          <span>Blog Admin</span>
        </span>
      </div>

      <nav className="adx-nav">
        <p className="adx-nav-label">Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === activeHref ||
            (item.href === "/admin" && activeHref === "/admin");

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`adx-nav-item${isActive ? " is-active" : ""}`}
              aria-current={isActive ? "page" : undefined}
              onClick={onNavigate}
            >
              <Icon />
              <span>{item.label}</span>
              {item.badge ? (
                <span className="adx-nav-badge">{item.badge}</span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="adx-sidebar-foot">
        <div className="adx-identity">
          <span className="adx-avatar" aria-hidden>
            {adminIdentity.initials}
          </span>
          <span className="adx-identity-copy">
            <strong>{adminIdentity.role}</strong>
            <span>{adminIdentity.email}</span>
          </span>
        </div>
        <Link href="/admin/login" className="adx-logout">
          <LogoutIcon />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
