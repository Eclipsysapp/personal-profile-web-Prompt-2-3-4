"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Blog, BlogCategory, BlogSite } from "@/types/blog";

type Props = { site: BlogSite; posts: Blog[]; categories: BlogCategory[] };
type SocialName = "facebook" | "twitter" | "instagram" | "linkedin" | "github" | "youtube";
const socialNames: SocialName[] = ["facebook", "twitter", "instagram", "linkedin", "github", "youtube"];

function formatDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function SocialIcon({ name }: { name: SocialName }) {
  if (name === "facebook") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3 0-5 2-5 5v2H6v4h3v7h4v-7h3l1-4h-4V9c0-.7.3-1 1-1Z" /></svg>;
  if (name === "twitter") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.2 3H21l-6.1 7 7.1 11h-5.6l-4.4-6.8L6.1 21H3.3l7.4-8.5L3.9 3h5.7l4 6.2L18.2 3Zm-1 16h1.5L8.7 4.9H7.1L17.2 19Z" /></svg>;
  if (name === "instagram") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.3" cy="6.8" r="1.2" /></svg>;
  if (name === "linkedin") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8.5H2V22h3V8.5ZM3.5 2A2 2 0 1 0 3.5 6a2 2 0 0 0 0-4ZM22 14.2c0-4.1-2.2-6-5.1-6-2.4 0-3.4 1.3-4 2.2V8.5h-3V22h3v-6.7c0-1.8.3-3.5 2.5-3.5s2.3 2 2.3 3.6V22H22v-7.8Z" /></svg>;
  if (name === "github") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.7-1.3-2.2-.3-4.6-1.1-4.6-5A4 4 0 0 1 7 8.6c-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 2.8 1.1a9.7 9.7 0 0 1 5.2 0C17 5.6 18 5.9 18 5.9c.6 1.4.2 2.4.1 2.7a4 4 0 0 1 1.1 2.8c0 3.9-2.4 4.7-4.6 5 .4.3.7 1 .7 2V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23 12s0-3.2-.4-4.7a3 3 0 0 0-2.1-2.1C19 4.8 12 4.8 12 4.8s-7 0-8.5.4a3 3 0 0 0-2.1 2.1C1 8.8 1 12 1 12s0 3.2.4 4.7a3 3 0 0 0 2.1 2.1c1.5.4 8.5.4 8.5.4s7 0 8.5-.4a3 3 0 0 0 2.1-2.1C23 15.2 23 12 23 12Z" /><path d="m9.8 15.5 5.7-3.5-5.7-3.5v7Z" fill="white" /></svg>;
}

export function GeekyOriginalSidebar({ site, posts, categories }: Props) {
  const [showRecent, setShowRecent] = useState(true);
  const sortedPosts = useMemo(() => [...posts].sort((a, b) => Date.parse(b.published_at ?? "") - Date.parse(a.published_at ?? "")), [posts]);
  const featuredPosts = useMemo(() => sortedPosts.filter((post) => post.is_featured), [sortedPosts]);
  const visiblePosts = (showRecent ? sortedPosts : featuredPosts).slice(0, 3);
  const socials = socialNames.flatMap((name) => {
    const href = site.social_links?.[name]?.trim();
    return href ? [{ name, href }] : [];
  });

  return (
    <aside className="gos-sidebar">
      <section className="gos-widget gos-about-widget">
        <img className="gos-map" src="/geeky-original/map.svg" alt="" />
        <div className="gos-sidebar-logo">
          <img className="geeky-logo-light" src="/geeky-original/logo.png" alt={site.website_title || site.full_name} />
          <img className="geeky-logo-dark" src="/geeky-original/logo-light.png" alt={site.website_title || site.full_name} />
        </div>
        <p>{site.short_intro}</p>
        {socials.length ? <ul className="gos-sidebar-socials" aria-label="Social profiles">
          {socials.map(({ name, href }) => <li key={name}><a href={href} target="_blank" rel="noopener noreferrer" aria-label={name}><SocialIcon name={name} /></a></li>)}
        </ul> : null}
      </section>

      {categories.length ? <section className="gos-widget gos-categories-widget">
        <h2 className="gos-section-title">Blog Categories</h2>
        <ul className="gos-sidebar-categories">
          {categories.map((category) => <li key={category.slug}>
            <Link href={`/blog/category/${category.slug}`}>
              <span><b aria-hidden="true">›</b>{category.name}</span>
              <small>{category.article_count}</small>
            </Link>
          </li>)}
        </ul>
      </section> : null}

      <section className="gos-widget gos-featured-widget">
        <h2 className="gos-section-title">Featured</h2>
        <div className="gos-tab-buttons" role="group" aria-label="Post list filter">
          <button type="button" className={!showRecent ? "is-active" : ""} onClick={() => setShowRecent(false)}>Featured</button>
          <button type="button" className={showRecent ? "is-active" : ""} onClick={() => setShowRecent(true)}>Recent</button>
        </div>
        <div className="gos-mini-post-list">
          {visiblePosts.length ? visiblePosts.map((post, index) => <article key={post.id} className={index < visiblePosts.length - 1 ? "has-border" : ""}>
            <Link href={`/blog/${post.slug}`} className="gos-mini-thumb" aria-label={post.title}>
              {post.featured_image ? <img src={post.featured_image} alt={post.featured_image_alt || post.title} width={85} height={85} /> : <span>{post.title.charAt(0)}</span>}
            </Link>
            <div><h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>{post.published_at ? <p><span aria-hidden="true">▣</span> {formatDate(post.published_at)}</p> : null}</div>
          </article>) : <p className="gos-widget-empty">No featured articles yet.</p>}
        </div>
      </section>

      <section className="gos-widget gos-newsletter-widget">
        <h2 className="gos-section-title">Newsletter</h2>
        <p>Join the newsletter and receive new public articles in your inbox.</p>
        <form onSubmit={(event) => event.preventDefault()}>
          <label className="gos-newsletter-input"><input type="email" placeholder="Type And Hit Enter" aria-label="Email address" /><b aria-hidden="true">✉</b></label>
          <button type="submit">Sign In</button>
        </form>
        <small>By Signing Up, You Agree To <span>Privacy Policy</span></small>
      </section>
    </aside>
  );
}
