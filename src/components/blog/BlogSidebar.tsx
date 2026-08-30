import Image from "next/image";
import Link from "next/link";
import type { Blog, BlogCategory } from "@/types/blog";

function formatDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export function BlogSidebar({ categories, recent }: { categories: BlogCategory[]; recent: Blog[] }) {
  return (
    <aside className="geeky-sidebar">
      <section className="geeky-widget geeky-about-widget">
        <Image src="/geeky/map.svg" alt="" fill className="geeky-map" />
        <div className="geeky-sidebar-badge">AB</div>
        <h3>Anil Bhimani</h3>
        <p>A personal space for practical ideas, technology, business and long-form observations.</p>
        <div className="geeky-mini-socials"><span>f</span><span>𝕏</span><span>in</span><span>⌘</span></div>
      </section>

      <section className="geeky-widget">
        <h3 className="geeky-widget-title">Categories</h3>
        <div className="geeky-category-list">
          {categories.length ? categories.map((category) => (
            <Link href={`/blog/category/${category.slug}`} key={category.slug}>
              <span><b>›</b>{category.name}</span><small>{category.article_count}</small>
            </Link>
          )) : <p className="geeky-muted">Categories will appear after publishing articles.</p>}
        </div>
      </section>

      <section className="geeky-widget">
        <h3 className="geeky-widget-title">Recent</h3>
        <div className="geeky-recent-list">
          {recent.length ? recent.slice(0, 4).map((blog) => (
            <Link href={`/blog/${blog.slug}`} key={blog.id}>
              <span className="geeky-recent-thumb">{blog.featured_image ? <Image src={blog.featured_image} alt={blog.featured_image_alt || blog.title} fill sizes="78px" /> : "AB"}</span>
              <span><strong>{blog.title}</strong><small>◷ {formatDate(blog.published_at)}</small></span>
            </Link>
          )) : <p className="geeky-muted">Recent articles will appear here.</p>}
        </div>
      </section>

      <section className="geeky-widget geeky-newsletter">
        <h3 className="geeky-widget-title">Newsletter</h3>
        <p>Get new articles and useful notes when they are published.</p>
        <div className="geeky-newsletter-row"><input aria-label="Email address" placeholder="Email address" /><button type="button">→</button></div>
        <small>No spam. Just occasional updates.</small>
      </section>
    </aside>
  );
}
