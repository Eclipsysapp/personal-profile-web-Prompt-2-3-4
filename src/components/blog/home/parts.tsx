import type { Blog } from "@/types/blog";

export function formatDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

/**
 * Post thumbnail with graceful fallbacks:
 * - real featured image when available
 * - author-provided background colour, otherwise a soft brand tile
 * - the article initial as a placeholder glyph
 * - a play badge for video posts
 */
export function PostThumb({
  blog,
  sizes,
}: {
  blog: Blog;
  sizes?: string;
}) {
  return (
    <span
      className="bh-thumb"
      style={
        !blog.featured_image && blog.background_color
          ? { backgroundColor: blog.background_color }
          : undefined
      }
    >
      {blog.featured_image ? (
        <img
          src={blog.featured_image || "/placeholder.svg"}
          alt={blog.featured_image_alt || blog.title}
          loading="lazy"
          decoding="async"
          sizes={sizes}
        />
      ) : (
        <span className="bh-thumb-fallback" aria-hidden="true">
          {blog.title.charAt(0)}
        </span>
      )}
      {blog.post_type === "video" ? (
        <i className="bh-play" aria-hidden="true">
          ▶
        </i>
      ) : null}
    </span>
  );
}

export function PostMeta({
  blog,
  showComments = true,
}: {
  blog: Blog;
  showComments?: boolean;
}) {
  const date = formatDate(blog.published_at);
  return (
    <ul className="bh-meta">
      <li>{blog.author?.name ?? "Anil Bhimani"}</li>
      {date ? (
        <li>
          <time dateTime={blog.published_at ?? undefined}>{date}</time>
        </li>
      ) : null}
      {showComments && blog.comments_count > 0 ? (
        <li>
          {blog.comments_count} comment{blog.comments_count === 1 ? "" : "s"}
        </li>
      ) : null}
    </ul>
  );
}
