import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GeekyOriginalSidebar } from "@/components/blog/GeekyOriginalSidebar";
import { BlogComments } from "@/components/blog/BlogComments";
import { getBlogBySlug, getBlogCategories, getBlogs, getBlogSite } from "@/lib/blog-api";
import type { Blog, BlogCategory } from "@/types/blog";
import "../single-post-geeky.css";

type PageProps = { params: Promise<{ slug: string }> };

function formatDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function contentHtml(content?: string) {
  const value = (content ?? "").trim();
  if (!value) return "";
  if (/<[a-z][\s\S]*>/i.test(value)) return value;
  return value.split(/\n{2,}/).map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br />")}</p>`).join("");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { blog } = await getBlogBySlug(slug);
    return {
      title: blog.effective_seo_title,
      description: blog.effective_seo_description,
      alternates: { canonical: blog.canonical_url },
      robots: { index: blog.is_indexable, follow: true },
      openGraph: {
        type: "article", title: blog.effective_seo_title, description: blog.effective_seo_description,
        url: blog.canonical_url, publishedTime: blog.published_at ?? undefined, modifiedTime: blog.updated_at ?? undefined,
        images: blog.featured_image ? [{ url: blog.featured_image, alt: blog.featured_image_alt || blog.title }] : [],
      },
      twitter: {
        card: blog.featured_image ? "summary_large_image" : "summary", title: blog.effective_seo_title,
        description: blog.effective_seo_description, images: blog.featured_image ? [blog.featured_image] : [],
      },
    };
  } catch {
    return { title: "Article not found", robots: { index: false, follow: false } };
  }
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  let article;
  let site;
  let categories: BlogCategory[] = [];
  let allBlogs: Blog[] = [];
  try {
    const [articleResponse, siteResponse, categoriesResponse, blogsResponse] = await Promise.all([
      getBlogBySlug(slug),
      getBlogSite(),
      getBlogCategories(),
      getBlogs(1, 24),
    ]);
    article = articleResponse;
    site = siteResponse.site;
    categories = categoriesResponse.categories;
    allBlogs = blogsResponse.blogs;
  } catch {
    notFound();
  }

  const { blog, related_blogs: related } = article;
  const chronologicalBlogs = [...allBlogs].sort((a, b) =>
    Date.parse(b.published_at ?? "") - Date.parse(a.published_at ?? "")
  );
  const currentIndex = chronologicalBlogs.findIndex((item) => item.slug === blog.slug);
  const nextPost = currentIndex > 0 ? chronologicalBlogs[currentIndex - 1] : null;
  const previousPost = currentIndex >= 0 && currentIndex < chronologicalBlogs.length - 1
    ? chronologicalBlogs[currentIndex + 1]
    : null;
  const sidebarPosts = chronologicalBlogs.filter((item) => item.slug !== blog.slug);
  const blogPosting = {
    "@context": "https://schema.org", "@type": "BlogPosting", headline: blog.title,
    description: blog.effective_seo_description, url: blog.canonical_url, mainEntityOfPage: blog.canonical_url,
    datePublished: blog.published_at, dateModified: blog.updated_at ?? blog.published_at,
    author: { "@type": "Person", name: blog.author?.name ?? site.full_name }, publisher: { "@type": "Person", name: site.full_name },
    image: blog.featured_image ? [blog.featured_image] : undefined, keywords: blog.tags.join(", "), articleSection: blog.category ?? undefined,
  };

  return (
    <section className="geeky-original-single">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPosting) }} />
      <div className="gos-container">
        <div className="gos-row">
          <main className="gos-main">
            <article>
              <div className="gos-cover" style={!blog.featured_image && blog.background_color ? { backgroundColor: blog.background_color } : undefined}>
                {blog.featured_image ? <img src={blog.featured_image} alt={blog.featured_image_alt || blog.title} width={1000} height={500} /> : null}
                {blog.category && blog.category_slug ? <ul className="gos-category-list"><li><Link href={`/blog/category/${blog.category_slug}`}>{blog.category}</Link></li></ul> : null}
              </div>
              <h1 className="gos-title">{blog.title}</h1>
              <ul className="gos-meta">
                <li><span aria-hidden="true">♟</span><span>{blog.author?.name ?? site.full_name}</span></li>
                {blog.published_at ? <li><span aria-hidden="true">▣</span><time dateTime={blog.published_at}>{formatDate(blog.published_at)}</time></li> : null}
              </ul>
              {blog.excerpt ? <p className="gos-lead">{blog.excerpt}</p> : null}
              <div className="gos-content" dangerouslySetInnerHTML={{ __html: contentHtml(blog.content) }} />
              {blog.tags.length ? <div className="gos-tags" aria-label="Article tags">{blog.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div> : null}
              {(previousPost || nextPost) ? <nav className="gos-inner-pagination" aria-label="Article navigation">
                <span>{previousPost ? <Link href={`/blog/${previousPost.slug}`}>Prev</Link> : null}</span>
                <span>{nextPost ? <Link href={`/blog/${nextPost.slug}`}>Next</Link> : null}</span>
              </nav> : null}
              <BlogComments slug={blog.slug} />
            </article>
          </main>
          <GeekyOriginalSidebar site={site} posts={sidebarPosts} categories={categories} />
        </div>

        {related.length ? <section className="gos-related">
          <h2 className="gos-section-title">Related Posts</h2>
          <div className="gos-related-grid">
            {related.slice(0, 3).map((item) => <article className="gos-post-card" key={item.id}>
              <Link href={`/blog/${item.slug}`} className="gos-card-image">
                {item.featured_image ? <img src={item.featured_image} alt={item.featured_image_alt || item.title} width={405} height={208} /> : <span className="gos-image-fallback">{item.title.charAt(0)}</span>}
                {item.category ? <b>{item.category}</b> : null}
              </Link>
              <h3><Link href={`/blog/${item.slug}`}>{item.title}</Link></h3>
              <ul className="gos-card-meta"><li>♟ {site.full_name}</li>{item.published_at ? <li>▣ {formatDate(item.published_at)}</li> : null}</ul>
              {item.excerpt ? <p>{item.excerpt}</p> : null}
              <Link className="gos-read-more" href={`/blog/${item.slug}`}>Read More</Link>
            </article>)}
          </div>
        </section> : null}
      </div>
    </section>
  );
}
