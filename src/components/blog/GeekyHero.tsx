import Image from "next/image";
import Link from "next/link";
import type { BlogSite } from "@/types/blog";

type GeekyHeroProps = {
  site: BlogSite;
};

export function GeekyHero({ site }: GeekyHeroProps) {
  const firstName =
    site.full_name.trim().split(/\s+/)[0] || site.full_name;

  const heroImage =
    site.profile_image || "/geeky/banner-author.png";

  const intro =
    site.welcome_message ||
    site.short_intro ||
    "Ideas, technology, business observations and practical perspectives.";

  return (
    <section className="geeky-hero">
      <Image
        className="geeky-hero-shape"
        src="/geeky/banner-bg-shape.svg"
        alt=""
        fill
        priority
      />

      <div className="geeky-container geeky-hero-grid">
        <div className="geeky-hero-copy">
          <h1>
            <strong>
              Welcome <em>!</em>
            </strong>
            <span>to {site.full_name}&apos;s Blog</span>
          </h1>

          <p>{intro}</p>

          {site.professional_title ? (
            <p className="geeky-hero-role">
              {site.professional_title}
            </p>
          ) : null}

          <Link href="/#about" className="geeky-primary-button">
            Know About {firstName}
          </Link>
        </div>

        <div className="geeky-hero-visual">
          <Image
            src={heroImage}
            alt={`${site.full_name} profile`}
            width={548}
            height={443}
            priority
          />
        </div>
      </div>
    </section>
  );
}
