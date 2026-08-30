const VISITOR_SESSION_KEY = "visitor_session_token";

export function setVisitorSessionToken(token: string): void {
  if (typeof window === "undefined") return;

  const cleanToken = token.trim();

  if (!cleanToken) return;

  window.sessionStorage.setItem(
    VISITOR_SESSION_KEY,
    cleanToken,
  );
}

export function getVisitorSessionToken(): string | null {
  if (typeof window === "undefined") return null;

  return (
    window.sessionStorage.getItem(
      VISITOR_SESSION_KEY,
    ) ?? null
  );
}

export function removeVisitorSessionToken(): void {
  if (typeof window === "undefined") return;

  window.sessionStorage.removeItem(
    VISITOR_SESSION_KEY,
  );
}
