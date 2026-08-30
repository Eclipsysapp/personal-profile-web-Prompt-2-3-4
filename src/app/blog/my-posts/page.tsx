"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useBlogAuthor } from "@/components/blog/BlogAuthorProvider";
import { BLOG_API_URL } from "@/lib/blog-community";

type Post = { id:number; title:string; slug:string; category:string; status:"draft"|"pending_review"|"published"|"rejected"; moderation_feedback:string|null; updated_at:string };
const sections: Array<[Post["status"],string]> = [["draft","Drafts"],["pending_review","Pending Review"],["published","Published"],["rejected","Rejected"]];
export default function MyPostsPage() {
  const { author, token, loading } = useBlogAuthor(); const [posts,setPosts]=useState<Post[]>([]); const [error,setError]=useState("");
  useEffect(() => { if(!token) return; fetch(`${BLOG_API_URL}/api/blog-author/posts`,{headers:{Accept:"application/json",Authorization:`Bearer ${token}`}}).then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.message);return d}).then(d=>setPosts(d.blogs)).catch(e=>setError(e.message)); },[token]);
  if(loading) return <section className="blog-community-page"><p>Loading…</p></section>;
  if(!author) return <section className="blog-community-page"><div className="blog-community-card"><h1>My Posts</h1><p>Sign in from the Blog header to manage your articles.</p></div></section>;
  return <section className="blog-community-page"><div className="blog-community-heading"><div><p>Community publishing</p><h1>My Posts</h1></div><Link href="/blog/write" className="community-primary">Write an article</Link></div>{error&&<p className="community-error">{error}</p>}<div className="community-status-sections">{sections.map(([status,label])=><section key={status}><h2>{label} <span>{posts.filter(p=>p.status===status).length}</span></h2><div>{posts.filter(p=>p.status===status).map(post=><article key={post.id}><div><small>{post.category}</small><h3>{post.title}</h3><p>Updated {new Date(post.updated_at).toLocaleDateString()}</p>{post.moderation_feedback&&<blockquote>{post.moderation_feedback}</blockquote>}</div><div>{status==="published"?<Link href={`/blog/${post.slug}`}>View</Link>:null}{status==="draft"||status==="rejected"?<Link href={`/blog/write?id=${post.id}`}>Edit</Link>:null}</div></article>)}{!posts.some(p=>p.status===status)&&<p className="community-empty">No {label.toLowerCase()}.</p>}</div></section>)}</div></section>;
}
