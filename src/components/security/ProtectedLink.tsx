"use client";

import type { MouseEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"
).replace(/\/$/, "");

const SESSION_KEYS = [
  "visitor_session_token",
  "session_token",
  "visitorSessionToken",
  "personal_profile_session_token",
] as const;

function readVisitorSessionToken(): string | null {
  if (typeof window === "undefined") return null;

  for (const key of SESSION_KEYS) {
    const sessionValue = window.sessionStorage.getItem(key);
    if (sessionValue?.trim()) return sessionValue.trim();

    const localValue = window.localStorage.getItem(key);
    if (localValue?.trim()) return localValue.trim();
  }

  return null;
}

function clearVisitorSessionToken(): void {
  if (typeof window === "undefined") return;

  for (const key of SESSION_KEYS) {
    window.sessionStorage.removeItem(key);
    window.localStorage.removeItem(key);
  }
}

export function saveVisitorSessionToken(token: string): void {
  if (typeof window === "undefined") return;

  const cleanToken = token.trim();

  if (!cleanToken) return;

  window.sessionStorage.setItem(
    "visitor_session_token",
    cleanToken,
  );
}

type ProtectedLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  title?: string;
  onBeforeNavigate?: () => void;
};

export function ProtectedLink({
  href,
  children,
  className,
  title,
  onBeforeNavigate,
}: ProtectedLinkProps) {
  const router = useRouter();

  async function handleClick(
    event: MouseEvent<HTMLAnchorElement>,
  ) {
    event.preventDefault();

    onBeforeNavigate?.();

    const sessionToken = readVisitorSessionToken();

    if (!sessionToken) {
      router.push(
        `/access?next=${encodeURIComponent(href)}`,
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/sessions/validate`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_token: sessionToken,
          }),
        },
      );

      const data = (await response.json().catch(() => null)) as
        | { success?: boolean }
        | null;

      if (response.ok && data?.success) {
        router.push(href);
        return;
      }
    } catch {
      // Fall through to the secure access flow.
    }

    clearVisitorSessionToken();

    router.push(
      `/access?next=${encodeURIComponent(href)}`,
    );
  }

  return (
    <a
      href={href}
      className={className}
      title={title}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
