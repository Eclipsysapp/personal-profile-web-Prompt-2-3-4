"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");
const tokenKey = "blog_author_session_token";

export type BlogAuthor = { id: number; name: string; display_name: string | null; avatar_url: string | null; bio: string | null };
type Context = { author: BlogAuthor | null; loading: boolean; token: string; signInUrl: (provider: string) => string; acceptToken: (token: string, author: BlogAuthor) => void; signOut: () => Promise<void> };
const BlogAuthorContext = createContext<Context | null>(null);

export function BlogAuthorProvider({ children }: { children: React.ReactNode }) {
  const [author, setAuthor] = useState<BlogAuthor | null>(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = sessionStorage.getItem(tokenKey) ?? "";
      if (!saved) { setLoading(false); return; }
      setToken(saved);
      fetch(`${API_URL}/api/blog-author/me`, { headers: { Accept: "application/json", Authorization: `Bearer ${saved}` } })
        .then(async (response) => response.ok ? response.json() : Promise.reject())
        .then((data) => setAuthor(data.author))
        .catch(() => { sessionStorage.removeItem(tokenKey); setToken(""); })
        .finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const acceptToken = useCallback((nextToken: string, nextAuthor: BlogAuthor) => {
    sessionStorage.setItem(tokenKey, nextToken); setToken(nextToken); setAuthor(nextAuthor); setLoading(false);
  }, []);
  const signOut = useCallback(async () => {
    if (token) await fetch(`${API_URL}/api/blog-author/logout`, { method: "POST", headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }).catch(() => undefined);
    sessionStorage.removeItem(tokenKey); setToken(""); setAuthor(null);
  }, [token]);
  const value = useMemo(() => ({ author, loading, token, acceptToken, signOut, signInUrl: (provider: string) => `${API_URL}/blog-author/oauth/${provider}/redirect` }), [author, loading, token, acceptToken, signOut]);
  return <BlogAuthorContext.Provider value={value}>{children}</BlogAuthorContext.Provider>;
}

export function useBlogAuthor() {
  const value = useContext(BlogAuthorContext);
  if (!value) throw new Error("useBlogAuthor must be used inside BlogAuthorProvider");
  return value;
}
