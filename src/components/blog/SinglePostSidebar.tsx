import Link from "next/link";
import type { Blog, BlogSite } from "@/types/blog";

type SinglePostSidebarProps = {
  site: BlogSite;
  related: Blog[];
};

function formatDate(value: string | null) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function socialLabel(key: string) {
  const normalized = key.toLowerCase();

  if (normalized === "twitter") return "X";
  if (normalized === "youtube") return "YT";
  if (normalized === "linkedin") return "in";
  if (normalized === "instagram") return "◎";
  if (normalized === "facebook") return "f";
  if (normalized === "github") return "GH";

  return key.slice(0, 2).toUpperCase();
}

export function SinglePostSidebar({
  site,
  related,
}: SinglePostSidebarProps) {
  return (
    <aside className="geeky-single-sidebar">
      <section className="geeky-author-card">
        <div
          className="geeky-author-watermark"
          aria-hidden="true"
        >
          ◇
        </div>

        <div className="geeky-author-logo">
          <span className="geeky-logo-symbol">
            <i />
            <b>•••</b>
          </span>

          <strong>
            {site.website_title?.trim() ||
              site.full_name
                .trim()
                .split(/\s+/)[0]
                ?.toLowerCase() ||
              "blog"}
          </strong>
        </div>

        <p>
          {site.short_intro ||
            "Ideas, technology, business observations and practical perspectives."}
        </p>

        <div className="geeky-author-socials">
          {Object.entries(site.social_links ?? {})
            .slice(0, 6)
            .map(([key, value]) => (
              <a
                href={value}
                key={key}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={key}
                title={key}
              >
                {socialLabel(key)}
              </a>
            ))}
        </div>
      </section>

      <section className="geeky-sidebar-box">
        <div className="geeky-sidebar-heading">
          <h3>Featured</h3>
          <span />
        </div>

        <div className="geeky-sidebar-tabs">
          <span>Featured</span>
          <b>Recent</b>
        </div>

        <div className="geeky-sidebar-posts">
          {related.length ? (
            related.slice(0, 4).map((blog) => (
              <article key={blog.id}>
                <Link
                  href={`/blog/${blog.slug}`}
                  className="geeky-sidebar-thumb"
                >
                  {blog.featured_image ? (
                    <img
                      src={blog.featured_image}
                      alt={
                        blog.featured_image_alt ||
                        blog.title
                      }
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span>AB</span>
                  )}
                </Link>

                <div>
                  <h4>
                    <Link href={`/blog/${blog.slug}`}>
                      {blog.title}
                    </Link>
                  </h4>

                  <small>
                    ◷ {formatDate(blog.published_at)}
                  </small>
                </div>
              </article>
            ))
          ) : (
            <p className="geeky-sidebar-empty">
              More articles will appear here.
            </p>
          )}
        </div>
      </section>

      <section className="geeky-sidebar-box geeky-sidebar-newsletter">
        <div className="geeky-sidebar-heading">
          <h3>Newsletter</h3>
          <span />
        </div>

        <p>
          Get new public articles and useful updates
          delivered to your inbox.
        </p>

        <form>
          <input
            type="email"
            placeholder="Type your email"
            aria-label="Newsletter email"
          />

          <button type="button">
            Sign Up
          </button>
        </form>

        <small>
          No spam. Newsletter backend can be connected
          later.
        </small>
      </section>
    </aside>
  );
}
