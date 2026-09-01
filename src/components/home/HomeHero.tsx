import Link from "next/link";
import Image from "next/image";
import { ProtectedLink } from "@/components/security/ProtectedLink";
import type { BlogSite } from "@/types/blog";

type HomeHeroProps = {
  site: BlogSite;
  articleCount: number;
};

function socialUrl(
  links: Record<string, string>,
  ...keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = links[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

export function HomeHero({ site, articleCount }: HomeHeroProps) {
  const name = site.full_name?.trim() || "Anil Bhimani";
  const initials = name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const title = site.professional_title?.trim();
  const intro =
    site.welcome_message?.trim() ||
    site.short_intro?.trim() ||
    "Ideas, technology, business observations and practical perspectives.";

  const socials = site.social_links ?? {};
  const github = socialUrl(socials, "github", "GitHub");
  const linkedin = socialUrl(socials, "linkedin", "linkedIn", "LinkedIn");
  const twitter = socialUrl(socials, "twitter", "x", "Twitter", "X");

  return (
    <section className="home-hero">
      <div className="home-container home-hero-grid">
        <div className="home-hero-content">
          <span className="home-hero-eyebrow">
            <span aria-hidden="true" />
            Personal site &amp; writing
          </span>

          <h1>{name}</h1>

          {title ? (
            <p className="home-hero-title">
              <b>{title}</b>
            </p>
          ) : null}

          <p className="home-hero-intro">{intro}</p>

          <div className="home-hero-actions">
            <Link href="/blog" className="home-btn home-btn-primary">
              Read the writing
              <span aria-hidden="true">→</span>
            </Link>
            <ProtectedLink href="/about" className="home-btn home-btn-ghost">
              View full profile
            </ProtectedLink>
          </div>

          <div className="home-hero-meta">
            {articleCount > 0 ? (
              <span className="home-hero-meta-static">
                {articleCount}+ published article{articleCount === 1 ? "" : "s"}
              </span>
            ) : null}
            {github ? (
              <a href={github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            ) : null}
            {linkedin ? (
              <a href={linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            ) : null}
            {twitter ? (
              <a href={twitter} target="_blank" rel="noopener noreferrer">
                X / Twitter
              </a>
            ) : null}
          </div>
        </div>

        <div className="home-hero-visual">
          <div className="home-portrait">
            {site.profile_image ? (
              <Image
                unoptimized
                src={site.profile_image}
                alt={`Portrait of ${name}`}
                width={480}
                height={600}
                priority
              />
            ) : (
              <div className="home-portrait-fallback" aria-hidden="true">
                {initials}
              </div>
            )}
            <span className="home-portrait-badge">
              <i aria-hidden="true" />
              Open to conversations
            </span>
          </div>

          <div className="home-hero-note" aria-hidden="true">
            <strong>{name.split(/\s+/)[0]}</strong>
            <small>{title || "Writer & builder"}</small>
          </div>
        </div>
      </div>
    </section>
  );
}
