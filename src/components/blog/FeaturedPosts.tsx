import Link from "next/link";
import type { Blog } from "@/types/blog";

function formatDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

function ArticleImage({ blog, priority = false }: { blog: Blog; priority?: boolean }) {
  if (!blog.featured_image) return <span className="geeky-image-placeholder">AB</span>;
  return <img src={blog.featured_image} alt={blog.featured_image_alt || blog.title} loading={priority ? "eager" : "lazy"} decoding="async" />;
}

export function FeaturedPosts({ blogs }: { blogs: Blog[] }) {
  const [lead, ...rest] = blogs;

  return (
    <section className="geeky-featured-section">
      <h2 className="geeky-section-title">Featured Posts</h2>
      <div className="geeky-featured-box">
        {lead ? (
          <article className="geeky-featured-lead">
            <Link className="geeky-featured-image" href={`/blog/${lead.slug}`}><ArticleImage blog={lead} priority /></Link>
            <div className="geeky-post-meta"><span>◷</span>{formatDate(lead.published_at)}{lead.category ? <><i>•</i><b>{lead.category}</b></> : null}</div>
            <h3><Link href={`/blog/${lead.slug}`}>{lead.title}</Link></h3>
            {lead.excerpt && <p>{lead.excerpt}</p>}
          </article>
        ) : (
          <article className="geeky-featured-lead geeky-empty-feature">
            <div className="geeky-featured-image"><span className="geeky-image-placeholder">AB</span></div>
            <div className="geeky-post-meta"><span>◷</span>Ready for your first article</div>
            <h3>Featured stories will appear here</h3>
            <p>Publish a public Featured article in Blog Manager and this section will populate automatically.</p>
          </article>
        )}

        <div className="geeky-featured-side">
          {rest.slice(0, 4).map((blog) => (
            <article className="geeky-featured-small" key={blog.id}>
              <Link className="geeky-small-image" href={`/blog/${blog.slug}`}><ArticleImage blog={blog} /></Link>
              <div><h4><Link href={`/blog/${blog.slug}`}>{blog.title}</Link></h4><small>◷ {formatDate(blog.published_at)}</small></div>
            </article>
          ))}
          {!rest.length && [1, 2, 3].map((item) => (
            <article className="geeky-featured-small geeky-skeleton-item" key={item}>
              <span className="geeky-small-image geeky-demo-thumb">AB</span>
              <div><h4>More featured articles will appear here</h4><small>Publish from Admin Blog Manager</small></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
