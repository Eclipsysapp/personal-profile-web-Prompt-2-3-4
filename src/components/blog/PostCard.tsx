import Link from "next/link";
import type { Blog } from "@/types/blog";

function formatDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export function PostCard({ blog }: { blog: Blog }) {
  return (
    <article className="geeky-post-card">
      <Link href={`/blog/${blog.slug}`} className="geeky-post-card-image">
        {blog.featured_image ? <img src={blog.featured_image} alt={blog.featured_image_alt || blog.title} loading="lazy" decoding="async" /> : <span className="geeky-image-placeholder">AB</span>}
      </Link>
      <div className="geeky-post-meta"><span>◷</span>{formatDate(blog.published_at)}{blog.category ? <><i>•</i><b>{blog.category}</b></> : null}</div>
      <h3><Link href={`/blog/${blog.slug}`}>{blog.title}</Link></h3>
      {blog.excerpt && <p>{blog.excerpt}</p>}
    </article>
  );
}
