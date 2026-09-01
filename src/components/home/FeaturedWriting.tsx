import Link from "next/link";
import Image from "next/image";
import type { Blog } from "@/types/blog";

function formatDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function ArticleMedia({ blog }: { blog: Blog }) {
  return (
    <div
      className="home-article-media"
      style={
        !blog.featured_image && blog.background_color
          ? { backgroundColor: blog.background_color }
          : undefined
      }
    >
      {blog.featured_image ? (
        <Image
          unoptimized
          src={blog.featured_image}
          alt={blog.featured_image_alt || blog.title}
          fill
          sizes="(max-width: 680px) 100vw, 50vw"
        />
      ) : (
        <span className="home-article-ph" aria-hidden="true">
          {blog.title.charAt(0)}
        </span>
      )}
    </div>
  );
}

function ArticleCard({
  blog,
  lead = false,
}: {
  blog: Blog;
  lead?: boolean;
}) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className={`home-article${lead ? " is-lead" : ""}`}
    >
      <ArticleMedia blog={blog} />
      <div className="home-article-body">
        {blog.category ? (
          <span className="home-article-cat">{blog.category}</span>
        ) : null}
        <h3>{blog.title}</h3>
        {blog.excerpt ? <p>{blog.excerpt}</p> : null}
        <div className="home-article-meta">
          <span>{blog.author?.name ?? "Anil Bhimani"}</span>
          {blog.published_at ? (
            <>
              <i aria-hidden="true" />
              <span>{formatDate(blog.published_at)}</span>
            </>
          ) : null}
          {blog.comments_count > 0 ? (
            <>
              <i aria-hidden="true" />
              <span>
                {blog.comments_count} comment
                {blog.comments_count === 1 ? "" : "s"}
              </span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export function FeaturedWriting({ posts }: { posts: Blog[] }) {
  if (posts.length === 0) return null;

  const [lead, ...rest] = posts;
  const grid = rest.slice(0, 4);

  return (
    <section className="home-writing">
      <div className="home-container">
        <div className="home-section-head">
          <div>
            <span className="home-kicker">Selected writing</span>
            <h2>Notes on technology, building and business.</h2>
          </div>
          <Link href="/blog" className="home-section-link">
            All articles
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="home-writing-grid">
          <ArticleCard blog={lead} lead />
          {grid.map((blog) => (
            <ArticleCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
}
