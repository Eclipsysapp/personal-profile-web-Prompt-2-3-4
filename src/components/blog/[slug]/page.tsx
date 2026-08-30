import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/blog/PostCard";
import {
  getBlogBySlug,
  getBlogSite,
} from "@/lib/blog-api";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(value: string | null) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function contentHtml(content?: string) {
  const value = (content ?? "").trim();

  if (!value) return "";

  // Admin-authored HTML is rendered as HTML. Plain text is safely
  // converted into paragraphs so line breaks remain readable.
  if (/<[a-z][\s\S]*>/i.test(value)) {
    return value;
  }

  return value
    .split(/\n{2,}/)
    .map(
      (paragraph) =>
        `<p>${escapeHtml(paragraph).replaceAll(
          "\n",
          "<br />",
        )}</p>`,
    )
    .join("");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { blog } = await getBlogBySlug(slug);

    return {
      title: blog.effective_seo_title,
      description: blog.effective_seo_description,
      alternates: {
        canonical: blog.canonical_url,
      },
      robots: {
        index: blog.is_indexable,
        follow: true,
      },
      openGraph: {
        type: "article",
        title: blog.effective_seo_title,
        description: blog.effective_seo_description,
        url: blog.canonical_url,
        publishedTime: blog.published_at ?? undefined,
        modifiedTime: blog.updated_at ?? undefined,
        images: blog.featured_image
          ? [
              {
                url: blog.featured_image,
                alt: blog.featured_image_alt,
              },
            ]
          : undefined,
      },
      twitter: {
        card: blog.featured_image
          ? "summary_large_image"
          : "summary",
        title: blog.effective_seo_title,
        description: blog.effective_seo_description,
        images: blog.featured_image
          ? [blog.featured_image]
          : undefined,
      },
    };
  } catch {
    return {
      title: "Article not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function BlogArticlePage({
  params,
}: PageProps) {
  const { slug } = await params;

  let article;
  let site;

  try {
    const [articleResponse, siteResponse] =
      await Promise.all([
        getBlogBySlug(slug),
        getBlogSite(),
      ]);

    article = articleResponse;
    site = siteResponse.site;
  } catch {
    notFound();
  }

  const { blog, related_blogs: related } = article;

  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.effective_seo_description,
    url: blog.canonical_url,
    mainEntityOfPage: blog.canonical_url,
    datePublished: blog.published_at,
    dateModified: blog.updated_at ?? blog.published_at,
    author: {
      "@type": "Person",
      name: site.full_name,
    },
    publisher: {
      "@type": "Person",
      name: site.full_name,
    },
    image: blog.featured_image
      ? [blog.featured_image]
      : undefined,
    keywords: blog.tags.join(", "),
    articleSection: blog.category ?? undefined,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Blog",
        item: blog.seo_url.replace(
          `/blog/${blog.slug}`,
          "/blog",
        ),
      },
      ...(blog.category
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: blog.category,
              item: blog.seo_url.replace(
                `/blog/${blog.slug}`,
                `/blog/category/${blog.category_slug}`,
              ),
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: blog.category ? 3 : 2,
        name: blog.title,
        item: blog.canonical_url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPosting),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumb),
        }}
      />

      <article className="geeky-article-page">
        <div className="geeky-container geeky-article-wrap">
          <nav
            className="geeky-breadcrumb"
            aria-label="Breadcrumb"
          >
            <Link href="/blog">Blog</Link>
            <span>›</span>
            {blog.category ? (
              <>
                <Link
                  href={`/blog/category/${blog.category_slug}`}
                >
                  {blog.category}
                </Link>
                <span>›</span>
              </>
            ) : null}
            <span>{blog.title}</span>
          </nav>

          <header className="geeky-article-header">
            {blog.category ? (
              <Link
                className="geeky-article-category"
                href={`/blog/category/${blog.category_slug}`}
              >
                {blog.category}
              </Link>
            ) : null}

            <h1>{blog.title}</h1>

            <p className="geeky-article-meta">
              By {site.full_name}
              {blog.published_at
                ? ` · ${formatDate(blog.published_at)}`
                : ""}
            </p>

            {blog.excerpt ? (
              <p className="geeky-article-excerpt">
                {blog.excerpt}
              </p>
            ) : null}
          </header>

          {blog.featured_image ? (
            <div className="geeky-article-image">
              <img
                src={blog.featured_image}
                alt={blog.featured_image_alt}
                loading="eager"
                decoding="async"
              />
            </div>
          ) : null}

          <div
            className="geeky-article-content"
            dangerouslySetInnerHTML={{
              __html: contentHtml(blog.content),
            }}
          />

          {blog.tags.length ? (
            <div className="geeky-article-tags">
              {blog.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          ) : null}
        </div>
      </article>

      {related.length ? (
        <section className="geeky-related-section">
          <div className="geeky-container">
            <h2 className="geeky-section-title">
              Related Posts
            </h2>
            <div className="geeky-related-grid">
              {related.map((item) => (
                <PostCard blog={item} key={item.id} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
