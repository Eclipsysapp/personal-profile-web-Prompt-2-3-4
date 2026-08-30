import type { Metadata } from "next";
import { BlogFooter } from "@/components/blog/BlogFooter";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogAuthorProvider } from "@/components/blog/BlogAuthorProvider";
import { getBlogSite } from "@/lib/blog-api";
import type { BlogSite } from "@/types/blog";
import "./blog.css";
import "../admin/blogs/admin-blogs.css";
import "./community.css";

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

export const metadata: Metadata = {
  title: {
    default: "Anil Bhimani Blog",
    template: "%s | Anil Bhimani",
  },
  description:
    "Ideas, technology, business observations and practical perspectives by Anil Bhimani.",
};

export default async function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let site = fallbackSite;

  try {
    const response = await getBlogSite();
    site = response.site;
  } catch {
    // Keep the blog usable if the branding endpoint is temporarily unavailable.
  }

  return (
    <div className="geeky-shell">
      <BlogAuthorProvider>
        <BlogHeader site={site} />
        <main>{children}</main>
        <BlogFooter site={site} />
      </BlogAuthorProvider>
    </div>
  );
}
