"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBlogAuthor } from "@/components/blog/BlogAuthorProvider";
import { BLOG_API_URL } from "@/lib/blog-community";

export default function BlogAuthCallbackPage() {
  const router = useRouter(); const { acceptToken } = useBlogAuthor();
  const [message, setMessage] = useState("Completing secure sign in…");
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) { setTimeout(() => setMessage("Sign in could not be completed."), 0); return; }
    fetch(`${BLOG_API_URL}/api/blog-author/auth/exchange`, { method:"POST", headers:{"Content-Type":"application/json",Accept:"application/json"}, body:JSON.stringify({code}) })
      .then(async response => { const data=await response.json(); if(!response.ok) throw new Error(data.message); return data; })
      .then(data => { acceptToken(data.blog_author_session_token,data.author); router.replace("/blog/write"); })
      .catch(error => setMessage(error instanceof Error ? error.message : "Sign in failed."));
  }, [acceptToken, router]);
  return <section className="blog-community-page"><div className="blog-community-card blog-auth-result"><h1>Blog community sign in</h1><p>{message}</p></div></section>;
}
