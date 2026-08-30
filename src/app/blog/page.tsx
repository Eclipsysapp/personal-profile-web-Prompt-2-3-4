import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { FeaturedPosts } from "@/components/blog/FeaturedPosts";
import { GeekyHero } from "@/components/blog/GeekyHero";
import { PostCard } from "@/components/blog/PostCard";
import {
  getBlogCategories,
  getBlogs,
  getBlogSite,
  getFeaturedBlogs,
} from "@/lib/blog-api";
import type {
  Blog,
  BlogCategory,
  BlogSite,
} from "@/types/blog";

export const dynamic = "force-dynamic";

const fallbackSite: BlogSite = {
  full_name: "Anil Bhimani",
  professional_title: null,
  short_intro:
    "Ideas, technology, business observations and practical perspectives.",
  welcome_message: null,
  website_title: null,
  profile_image: null,
  social_links: {},
};

export default async function BlogPage() {
  let featured: Blog[] = [];
  let latest: Blog[] = [];
  let categories: BlogCategory[] = [];
  let site = fallbackSite;
  let apiUnavailable = false;

  try {
    const [
      siteResponse,
      featuredResponse,
      latestResponse,
      categoriesResponse,
    ] = await Promise.all([
      getBlogSite(),
      getFeaturedBlogs(5),
      getBlogs(1, 8),
      getBlogCategories(),
    ]);

    site = siteResponse.site;
    featured = featuredResponse.blogs;
    latest = latestResponse.blogs;
    categories = categoriesResponse.categories;

    if (!featured.length) {
      featured = latest.slice(0, 5);
    }
  } catch {
    apiUnavailable = true;
  }

  return (
    <>
      <GeekyHero site={site} />

      <section className="geeky-main-section">
        <div className="geeky-container">
          {apiUnavailable ? (
            <div className="geeky-api-notice">
              Blog API is temporarily unavailable. Start Laravel and
              refresh this page.
            </div>
          ) : null}

          <div className="geeky-content-grid">
            <div className="geeky-main-column">
              <FeaturedPosts blogs={featured} />

              <section className="geeky-recent-section">
                <h2 className="geeky-section-title">
                  Recent Posts
                </h2>

                <div className="geeky-recent-box">
                  {latest.length ? (
                    <div className="geeky-post-grid">
                      {latest.map((blog) => (
                        <PostCard blog={blog} key={blog.id} />
                      ))}
                    </div>
                  ) : (
                    <div className="geeky-empty-posts">
                      <h3>Your blog is ready.</h3>
                      <p>
                        Publish a public article from Admin Blog
                        Manager and it will appear here
                        automatically.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <BlogSidebar
              categories={categories}
              recent={latest}
            />
          </div>
        </div>
      </section>
    </>
  );
}
