import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogFooter } from "@/components/blog/BlogFooter";
import { BlogAuthorProvider } from "@/components/blog/BlogAuthorProvider";
import { HomeHero } from "@/components/home/HomeHero";
import { FeaturedWriting } from "@/components/home/FeaturedWriting";
import { TopicsSection } from "@/components/home/TopicsSection";
import { ProfilePreview } from "@/components/home/ProfilePreview";
import { HomeFinalCta } from "@/components/home/HomeFinalCta";
import { getBlogSite, getBlogCommunityHome } from "@/lib/blog-api";
import type {
  Blog,
  BlogCategory,
  BlogSite,
} from "@/types/blog";
import "./blog/blog.css";
import "./admin/blogs/admin-blogs.css";
import "./blog/community.css";
import "./home.css";

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

function dedupePosts(...groups: Blog[][]): Blog[] {
  const seen = new Set<number>();
  const result: Blog[] = [];

  for (const group of groups) {
    for (const post of group) {
      if (seen.has(post.id)) continue;
      seen.add(post.id);
      result.push(post);
    }
  }

  return result;
}

export default async function Home() {
  let site = fallbackSite;
  let posts: Blog[] = [];
  let categories: BlogCategory[] = [];

  try {
    const response = await getBlogSite();
    site = response.site;
  } catch {
    // Keep the homepage usable if branding endpoint is unavailable.
  }

  try {
    const community = await getBlogCommunityHome();
    posts = dedupePosts(community.featured, community.latest);
    categories = community.categories ?? [];
  } catch {
    // Writing sections gracefully hide themselves when empty.
  }

  const articleCount = categories.reduce(
    (total, category) => total + (category.article_count || 0),
    0,
  );

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.full_name,
    description: site.short_intro,
    url:
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://anilbhimani.com",
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.full_name,
    jobTitle: site.professional_title ?? undefined,
    description: site.short_intro,
    sameAs: Object.values(site.social_links ?? {}).filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <div className="geeky-shell">
        <BlogAuthorProvider>
          <BlogHeader site={site} />
          <main className="home">
            <HomeHero site={site} articleCount={articleCount} />
            <FeaturedWriting posts={posts} />
            <TopicsSection categories={categories} />
            <ProfilePreview site={site} />
            <HomeFinalCta />
          </main>
          <BlogFooter site={site} />
        </BlogAuthorProvider>
      </div>
    </>
  );
}
