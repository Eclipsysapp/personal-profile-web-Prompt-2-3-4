import Image from "next/image";
import Link from "next/link";
import type { BlogSite } from "@/types/blog";

type BlogFooterProps = {
  site: BlogSite;
};

type SocialLinks = Record<string, string>;

function socialUrl(links: SocialLinks, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = links[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function SocialLink({
  href,
  label,
  children,
}: {
  href?: string;
  label: string;
  children: React.ReactNode;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      className="geeky-social"
      aria-label={label}
      title={label}
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
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.3" cy="6.8" r="1.2" /></svg>;
}
function LinkedInIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8.5H2V22h3V8.5ZM3.5 2A2 2 0 1 0 3.5 6a2 2 0 0 0 0-4ZM22 14.2c0-4.1-2.2-6-5.1-6-2.4 0-3.4 1.3-4 2.2V8.5h-3V22h3v-6.7c0-1.8.3-3.5 2.5-3.5s2.3 2 2.3 3.6V22H22v-7.8Z" /></svg>;
}
function GitHubIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.7-1.3-2.2-.3-4.6-1.1-4.6-5A4 4 0 0 1 7 8.6c-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 2.8 1.1a9.7 9.7 0 0 1 5.2 0C17 5.6 18 5.9 18 5.9c.6 1.4.2 2.4.1 2.7a4 4 0 0 1 1.1 2.8c0 3.9-2.4 4.7-4.6 5 .4.3.7 1 .7 2V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" /></svg>;
}
function YouTubeIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23 12s0-3.2-.4-4.7a3 3 0 0 0-2.1-2.1C19 4.8 12 4.8 12 4.8s-7 0-8.5.4a3 3 0 0 0-2.1 2.1C1 8.8 1 12 1 12s0 3.2.4 4.7a3 3 0 0 0 2.1 2.1c1.5.4 8.5.4 8.5.4s7 0 8.5-.4a3 3 0 0 0 2.1-2.1C23 15.2 23 12 23 12Z" /><path d="m9.8 15.5 5.7-3.5-5.7-3.5v7Z" fill="white" /></svg>;
}

export function BlogFooter({ site }: BlogFooterProps) {
  const logoText =
    site.website_title?.trim() ||
    site.full_name.trim().split(/\s+/)[0]?.toLowerCase() ||
    "blog";

  const socials = site.social_links ?? {};
  const facebook = socialUrl(socials, "facebook", "Facebook");
  const twitter = socialUrl(socials, "twitter", "x", "Twitter", "X");
  const instagram = socialUrl(socials, "instagram", "Instagram");
  const linkedin = socialUrl(socials, "linkedin", "linkedIn", "LinkedIn");
  const github = socialUrl(socials, "github", "GitHub");
  const youtube = socialUrl(socials, "youtube", "youTube", "YouTube");

  return (
    <footer className="geeky-footer">
      <Image src="/geeky/footer-bg-shape.svg" alt="" fill className="geeky-footer-shape" />

      <div className="geeky-container geeky-footer-inner">
        <Link href="/blog" className="geeky-logo geeky-footer-logo">
          <Image className="geeky-logo-light" src="/geeky-original/logo.png" alt={logoText} width={150} height={39} />
          <Image className="geeky-logo-dark" src="/geeky-original/logo-light.png" alt={logoText} width={150} height={39} />
        </Link>

        <p>{site.short_intro}</p>

        <nav className="geeky-footer-nav" aria-label="Footer navigation">
          <Link href="/blog">Home</Link>
          <Link href="/#about">About</Link>
          <Link href="/blog">Articles</Link>
          <Link href="/#contact">Contact</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-of-service">Terms of Service</Link>
          <Link href="/data-deletion">Data Deletion</Link>
        </nav>

        <div className="geeky-socials geeky-footer-socials" aria-label="Social links">
          <SocialLink label="Facebook" href={facebook}><FacebookIcon /></SocialLink>
          <SocialLink label="X / Twitter" href={twitter}><XIcon /></SocialLink>
          <SocialLink label="Instagram" href={instagram}><InstagramIcon /></SocialLink>
          <SocialLink label="LinkedIn" href={linkedin}><LinkedInIcon /></SocialLink>
          <SocialLink label="GitHub" href={github}><GitHubIcon /></SocialLink>
          <SocialLink label="YouTube" href={youtube}><YouTubeIcon /></SocialLink>
        </div>

        <p className="geeky-copyright">
          © {new Date().getFullYear()} {site.full_name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
