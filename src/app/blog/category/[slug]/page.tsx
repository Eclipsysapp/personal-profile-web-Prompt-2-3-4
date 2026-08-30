import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArchiveHeader } from "@/components/blog/BlogArchiveHeader";
import { BlogPagination } from "@/components/blog/BlogPagination";
import { PostCard } from "@/components/blog/PostCard";
import {
  getBlogCategories,
  getBlogs,
} from "@/lib/blog-api";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response = await getBlogCategories();
    const category = response.categories.find(
      (item) => item.slug === slug,
    );

    if (!category) {
      return {
        title: "Category not found",
        robots: { index: false, follow: false },
      };
    }

    return {
      title: `${category.name} Articles`,
      description: `Browse ${category.name} articles and insights.`,
      alternates: {
        canonical: `/blog/category/${category.slug}`,
      },
    };
  } catch {
    return {
      title: "Blog Category",
    };
  }
}

export default async function BlogCategoryPage({
  params,
  searchParams,
}: PageProps) {
  const [{ slug }, query] = await Promise.all([
    params,
    searchParams,
  ]);

  const page = Math.max(1, Number(query.page) || 1);

  let category;

  try {
    const categories = await getBlogCategories();
    category = categories.categories.find(
      (item) => item.slug === slug,
    );
  } catch {
    notFound();
  }

  if (!category) notFound();

  const response = await getBlogs(page, 9, {
    category: category.name,
  });

  return (
    <>
      <BlogArchiveHeader
        eyebrow="Category"
        title={category.name}
        description={`${category.article_count} published ${
          category.article_count === 1 ? "article" : "articles"
        }`}
      />

      <section className="geeky-archive-section">
        <div className="geeky-container">
          {response.blogs.length ? (
            <div className="geeky-archive-grid">
              {response.blogs.map((blog) => (
                <PostCard blog={blog} key={blog.id} />
              ))}
            </div>
          ) : (
            <div className="geeky-empty-posts">
              <h3>No articles yet.</h3>
            </div>
          )}

          <BlogPagination
            currentPage={response.pagination.current_page}
            lastPage={response.pagination.last_page}
            basePath={`/blog/category/${slug}`}
          />
        </div>
      </section>
    </>
  );
}
