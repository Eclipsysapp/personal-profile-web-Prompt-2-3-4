import type { Metadata } from "next";
import Link from "next/link";
import { getBlogCommunityHome, getBlogSite } from "@/lib/blog-api";
import type { Blog } from "@/types/blog";
import { BlogHomeMasthead } from "@/components/blog/home/BlogHomeMasthead";
import { PostThumb, PostMeta } from "@/components/blog/home/parts";
import "./blog-home.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Independent ideas and useful perspectives from the Geeky blog community.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Geeky Blog Community",
    description: "Independent ideas and useful perspectives from our writers.",
    type: "website",
    url: "/blog",
  },
};

function CardLink({ blog }: { blog: Blog }) {
  return (
    <article className="bh-card">
      <Link href={`/blog/${blog.slug}`} aria-label={blog.title}>
        <PostThumb blog={blog} sizes="(max-width: 900px) 50vw, 33vw" />
      </Link>
      {blog.category ? <span className="bh-pill">{blog.category}</span> : null}
      <h3>
        <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
      </h3>
      <PostMeta blog={blog} showComments={false} />
    </article>
  );
}

export default async function BlogPage() {
  let data;
  try {
    data = await getBlogCommunityHome();
  } catch {
    return (
      <div className="bhome">
        <div className="bhome-empty" role="status">
          Our articles are taking a short break. Please refresh in a little
          while &mdash; the blog will be right back.
        </div>
      </div>
    );
  }

  let intro =
    "Ideas, technology, business observations and practical perspectives.";
  try {
    const { site } = await getBlogSite();
    if (site?.short_intro?.trim()) intro = site.short_intro.trim();
  } catch {
    // Keep the fallback intro if the branding endpoint is unavailable.
  }

  const totalArticles = data.categories.reduce(
    (sum, category) => sum + (category.article_count ?? 0),
    0,
  );

  const lead = data.featured[0] ?? data.latest[0] ?? null;
  const subFeatured = (data.featured.length ? data.featured.slice(1) : data.latest.slice(1))
    .slice(0, 3);

  return (
    <div className="bhome">
      <BlogHomeMasthead
        intro={intro}
        categories={data.categories}
        totalArticles={totalArticles}
      />

      {lead ? (
        <section className="bhome-featured" aria-label="Featured article">
          <Link
            className="bhome-featured-media"
            href={`/blog/${lead.slug}`}
            aria-label={lead.title}
          >
            {lead.category ? (
              <span className="bh-pill">{lead.category}</span>
            ) : null}
            <PostThumb blog={lead} sizes="(max-width: 900px) 100vw, 55vw" />
          </Link>
          <div className="bhome-featured-body">
            <p className="bh-kicker">Featured</p>
            <h2>
              <Link href={`/blog/${lead.slug}`}>{lead.title}</Link>
            </h2>
            {lead.excerpt ? <p>{lead.excerpt}</p> : null}
            <PostMeta blog={lead} />
            <Link className="bh-read" href={`/blog/${lead.slug}`}>
              Read article
            </Link>
          </div>
        </section>
      ) : null}

      {subFeatured.length ? (
        <section className="bhome-subfeatured" aria-label="More featured articles">
          {subFeatured.map((blog) => (
            <CardLink key={blog.id} blog={blog} />
          ))}
        </section>
      ) : null}

      <div className="bhome-body">
        <main className="bhome-main">
          <div className="bh-section-head">
            <div>
              <p className="bh-kicker">Fresh perspectives</p>
              <h2>Latest Articles</h2>
            </div>
            <Link href="/blog#categories">Browse all</Link>
          </div>

          {data.latest.length ? (
            <div className="bhome-feed">
              {data.latest.map((blog) => (
                <article className="bhome-feed-row" key={blog.id}>
                  <Link
                    className="bhome-feed-media"
                    href={`/blog/${blog.slug}`}
                    aria-label={blog.title}
                  >
                    <PostThumb blog={blog} sizes="(max-width: 767px) 100vw, 290px" />
                  </Link>
                  <div className="bhome-feed-body">
                    {blog.category ? (
                      <span className="bh-pill">{blog.category}</span>
                    ) : null}
                    <h3>
                      <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h3>
                    {blog.excerpt ? <p>{blog.excerpt}</p> : null}
                    <PostMeta blog={blog} />
                    <Link className="bh-read" href={`/blog/${blog.slug}`}>
                      Read article
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bhome-empty" role="status">
              No articles have been published yet. Check back soon.
            </div>
          )}
        </main>

        <aside className="bhome-sidebar" aria-label="Blog sidebar">
          <section className="bh-widget bh-about">
            <h2 className="bh-widget-title">
              About the <span>Journal</span>
            </h2>
            <p className="bh-about-name">Anil Bhimani</p>
            <p>{intro}</p>
          </section>

          {data.categories.length ? (
            <section className="bh-widget" id="categories">
              <h2 className="bh-widget-title">Categories</h2>
              <ul className="bh-cat-list">
                {data.categories.map((category) => (
                  <li key={category.slug}>
                    <Link href={`/blog/category/${category.slug}`}>
                      <span>{category.name}</span>
                      <small>{category.article_count}</small>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {data.most_commented.length ? (
            <section className="bh-widget">
              <h2 className="bh-widget-title">Featured &amp; Discussed</h2>
              {data.most_commented.map((blog) => (
                <div className="bh-mini" key={blog.id}>
                  <Link
                    className="bh-mini-thumb"
                    href={`/blog/${blog.slug}`}
                    aria-label={blog.title}
                  >
                    <PostThumb blog={blog} sizes="66px" />
                  </Link>
                  <div className="bh-mini-body">
                    <strong>
                      <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </strong>
                    <span>
                      {blog.comments_count > 0
                        ? `${blog.comments_count} comment${blog.comments_count === 1 ? "" : "s"}`
                        : "Featured article"}
                    </span>
                  </div>
                </div>
              ))}
            </section>
          ) : null}

          {data.discover ? (
            <section className="bh-widget bh-discover-widget">
              <h2 className="bh-widget-title">Discover</h2>
              <Link className="bh-discover" href={`/blog/${data.discover.slug}`}>
                <PostThumb blog={data.discover} sizes="320px" />
                <strong>{data.discover.title}</strong>
              </Link>
            </section>
          ) : null}

          {data.popular_tags.length ? (
            <section className="bh-widget">
              <h2 className="bh-widget-title">Popular Tags</h2>
              <div className="bh-tags">
                {data.popular_tags.map((tag) => (
                  <Link
                    href={`/blog/search?q=${encodeURIComponent(tag.name)}`}
                    key={tag.name}
                  >
                    #{tag.name} <small>{tag.count}</small>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </div>

      <section className="bhome-cta" aria-label="Join the community">
        <div className="bhome-cta-copy">
          <p className="bh-kicker">Community writing</p>
          <h2>Have a useful perspective worth sharing?</h2>
          <p>
            Join the blog community to draft and submit an article. Every
            submission is reviewed before it goes live &mdash; thoughtful,
            independent writing only.
          </p>
        </div>
        <div className="bhome-cta-actions">
          <Link className="bh-btn bh-btn-primary" href="/blog/write">
            Start writing
          </Link>
          <Link className="bh-btn bh-btn-ghost" href="/blog/login">
            Author sign in
          </Link>
        </div>
      </section>
    </div>
  );
}
