"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ProtectedLink } from "@/components/security/ProtectedLink";
import { useBlogAuthor } from "./BlogAuthorProvider";
import type { BlogSite } from "@/types/blog";

type BlogHeaderProps = {
  site: BlogSite;
};

type SocialLinks = Record<string, string>;

function socialUrl(
  links: SocialLinks,
  ...keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = links[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function SocialIcon({
  label,
  href,
  children,
}: {
  label: string;
  href?: string;
  children: React.ReactNode;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      className="geeky-social"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

function FacebookIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3 0-5 2-5 5v2H6v4h3v7h4v-7h3l1-4h-4V9c0-.7.3-1 1-1Z" /></svg>;
}

function XIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.2 3H21l-6.1 7 7.1 11h-5.6l-4.4-6.8L6.1 21H3.3l7.4-8.5L3.9 3h5.7l4 6.2L18.2 3Zm-1 16h1.5L8.7 4.9H7.1L17.2 19Z" /></svg>;
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.3" cy="6.8" r="1.2" />
    </svg>
  );
}

function LinkedInIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8.5H2V22h3V8.5ZM3.5 2A2 2 0 1 0 3.5 6a2 2 0 0 0 0-4ZM22 14.2c0-4.1-2.2-6-5.1-6-2.4 0-3.4 1.3-4 2.2V8.5h-3V22h3v-6.7c0-1.8.3-3.5 2.5-3.5s2.3 2 2.3 3.6V22H22v-7.8Z" /></svg>;
}

function GitHubIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.7-1.3-2.2-.3-4.6-1.1-4.6-5A4 4 0 0 1 7 8.6c-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 2.8 1.1a9.7 9.7 0 0 1 5.2 0C17 5.6 18 5.9 18 5.9c.6 1.4.2 2.4.1 2.7a4 4 0 0 1 1.1 2.8c0 3.9-2.4 4.7-4.6 5 .4.3.7 1 .7 2V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" /></svg>;
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23 12s0-3.2-.4-4.7a3 3 0 0 0-2.1-2.1C19 4.8 12 4.8 12 4.8s-7 0-8.5.4a3 3 0 0 0-2.1 2.1C1 8.8 1 12 1 12s0 3.2.4 4.7a3 3 0 0 0 2.1 2.1c1.5.4 8.5.4 8.5.4s7 0 8.5-.4a3 3 0 0 0 2.1-2.1C23 15.2 23 12 23 12Z" />
      <path d="m9.8 15.5 5.7-3.5-5.7-3.5v7Z" fill="white" />
    </svg>
  );
}

export function BlogHeader({ site }: BlogHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { author, loading: authorLoading, signInUrl, signOut } = useBlogAuthor();
  const socials = site.social_links ?? {};

  const facebook = socialUrl(socials, "facebook", "Facebook");
  const twitter = socialUrl(socials, "twitter", "x", "Twitter", "X");
  const instagram = socialUrl(socials, "instagram", "Instagram");
  const linkedin = socialUrl(socials, "linkedin", "linkedIn", "LinkedIn");
  const github = socialUrl(socials, "github", "GitHub");
  const youtube = socialUrl(socials, "youtube", "youTube", "YouTube");

  const logoText =
    site.website_title?.trim() ||
    site.full_name.trim().split(/\s+/)[0]?.toLowerCase() ||
    "blog";

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="geeky-header">
      <div className="geeky-container geeky-navbar">
        <Link href="/blog" className="geeky-logo" aria-label={`${site.full_name} blog home`} onClick={closeMenu}>
          <Image className="geeky-logo-light" src="/geeky-original/logo.png" alt={logoText} width={150} height={39} priority />
          <Image className="geeky-logo-dark" src="/geeky-original/logo-light.png" alt={logoText} width={150} height={39} priority />
        </Link>

        <button type="button" className="geeky-menu-button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>
          <span /><span /><span />
        </button>

        <div className={`geeky-nav-cluster ${menuOpen ? "is-open" : ""}`}>
          <nav className="geeky-nav" aria-label="Website navigation">
            <Link className="active" href="/blog" onClick={closeMenu}>Home</Link>
            <Link href="/blog" onClick={closeMenu}>Blog</Link>
            <Link href="/blog#categories" onClick={closeMenu}>Categories</Link>
            <Link href="/blog/write" onClick={closeMenu}>Write</Link>
            <span className="geeky-pages-link"><ProtectedLink href="/about" title="Protected section" onBeforeNavigate={closeMenu}>About</ProtectedLink></span>
          </nav>

          <div className="geeky-header-tools">
            <div className="geeky-socials" aria-label="Social links">
              <SocialIcon label="Facebook" href={facebook}><FacebookIcon /></SocialIcon>
              <SocialIcon label="X / Twitter" href={twitter}><XIcon /></SocialIcon>
              <SocialIcon label="Instagram" href={instagram}><InstagramIcon /></SocialIcon>
              <SocialIcon label="LinkedIn" href={linkedin}><LinkedInIcon /></SocialIcon>
              <SocialIcon label="GitHub" href={github}><GitHubIcon /></SocialIcon>
              <SocialIcon label="YouTube" href={youtube}><YouTubeIcon /></SocialIcon>
            </div>

            <span className="geeky-tool-divider" />

            <button
              type="button"
              className="geeky-theme-button"
              aria-label="Toggle dark mode"
              onClick={() => document.documentElement.classList.toggle("geeky-dark")}
            >
              ◕
            </button>

            <button type="button" className="geeky-search-button" aria-label="Search articles" onClick={() => setSearchOpen(true)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="m16 16 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            {!authorLoading && (author ? <div className="blog-author-menu">{author.avatar_url ? <Image unoptimized src={author.avatar_url} alt="" width={30} height={30} /> : <span>{(author.display_name || author.name).charAt(0)}</span>}<div><strong>{author.display_name || author.name}</strong><Link href="/blog/my-posts" onClick={closeMenu}>My Posts</Link><button type="button" onClick={() => void signOut()}>Sign Out</button></div></div> : <button type="button" className="blog-sign-in" onClick={() => setAuthOpen(true)}>Sign in / Write</button>)}
          </div>
        </div>

        <form action="/blog/search" className={`geeky-search-modal ${searchOpen ? "is-open" : ""}`}>
          <input name="q" type="search" placeholder="Type and hit enter..." aria-label="Search articles" autoFocus={searchOpen} />
          <button type="button" className="geeky-search-close" aria-label="Close search" onClick={() => setSearchOpen(false)}>×</button>
        </form>
        {authOpen ? <div className="blog-auth-overlay" role="dialog" aria-modal="true" aria-labelledby="blog-auth-title"><div className="blog-auth-panel"><button type="button" className="blog-auth-close" onClick={() => setAuthOpen(false)} aria-label="Close">×</button><p>Blog community</p><h2 id="blog-auth-title">Sign in to write</h2><span>Choose a social provider. This account is used only for the public blog community.</span><div>{[["google","Google"],["facebook","Facebook"],["github","GitHub"],["x","X / Twitter"]].map(([provider,label]) => <a key={provider} href={signInUrl(provider)}><b aria-hidden="true">{label.charAt(0)}</b>Continue with {label}</a>)}</div></div></div> : null}
      </div>
    </header>
  );
}
