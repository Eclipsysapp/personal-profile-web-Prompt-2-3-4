import type { Metadata } from "next";
import Form from "next/form";
import { BlogArchiveHeader } from "@/components/blog/BlogArchiveHeader";
import { BlogPagination } from "@/components/blog/BlogPagination";
import { PostCard } from "@/components/blog/PostCard";
import { getBlogs } from "@/lib/blog-api";

export const metadata: Metadata = {
  title: "Search Articles",
  description: "Search published blog articles.",
  robots: {
    index: false,
    follow: true,
  },
};

type PageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

export default async function BlogSearchPage({
  searchParams,
}: PageProps) {
  const query = await searchParams;
  const q = (query.q ?? "").trim();
  const page = Math.max(1, Number(query.page) || 1);

  const response = q
    ? await getBlogs(page, 9, { search: q })
    : null;

  return (
    <>
      <BlogArchiveHeader
        eyebrow="Search"
        title="Find an article"
        description="Search titles, excerpts, content, categories and tags."
      />

      <section className="geeky-search-section">
        <div className="geeky-container">
          <Form
            action="/blog/search"
            className="geeky-search-form"
          >
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search articles..."
              aria-label="Search articles"
            />
            <button type="submit">Search</button>
          </Form>

          {q ? (
            <>
              <p className="geeky-search-summary">
                {response?.pagination.total ?? 0} results for
                <strong> “{q}”</strong>
              </p>

              {response?.blogs.length ? (
                <div className="geeky-archive-grid">
                  {response.blogs.map((blog) => (
                    <PostCard blog={blog} key={blog.id} />
                  ))}
                </div>
              ) : (
                <div className="geeky-empty-posts">
                  <h3>No matching articles found.</h3>
                  <p>Try a different keyword.</p>
                </div>
              )}

              {response ? (
                <BlogPagination
                  currentPage={
                    response.pagination.current_page
                  }
                  lastPage={response.pagination.last_page}
                  basePath="/blog/search"
                  query={{ q }}
                />
              ) : null}
            </>
          ) : null}
        </div>
      </section>
    </>
  );
}
