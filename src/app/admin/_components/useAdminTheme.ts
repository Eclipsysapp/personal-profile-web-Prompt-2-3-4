"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

/**
 * Self-contained light/dark toggle for the admin area.
 *
 * The public site ships `.dark` CSS rules but no global theme provider,
 * so the admin manages its own preference. The <html> `dark` class is the
 * single source of truth (an external system), which we read through
 * `useSyncExternalStore` — this avoids setState-in-effect and keeps SSR
 * and client markup in sync. It does not touch auth or business logic.
 */

type Theme = "light" | "dark";

const STORAGE_KEY = "adx-theme";

let listeners: Array<() => void> = [];

function subscribe(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((listener) => listener !== callback);
  };
}

function emit() {
  for (const listener of listeners) listener();
}

function getSnapshot(): Theme {
  return typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  emit();
}

export function useAdminTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // Apply the stored / preferred theme once on mount. This updates an
  // external system (the DOM) rather than React state.
  useEffect(() => {
    let initial: Theme = "light";
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
        initial = stored;
      } else if (
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        initial = "dark";
      }
    } catch {
      // Ignore storage access issues.
    }
    applyTheme(initial);
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage access issues.
    }
    applyTheme(next);
  }, []);

  return { theme, toggle, mounted: true };
}
