export type Blog = {
  id: number;
  title: string;
  slug: string;
  category: string | null;
  category_slug: string | null;
  excerpt: string | null;
  featured_image: string | null;
  featured_image_alt: string;
  tags: string[];
  is_featured: boolean;
  published_at: string | null;
  updated_at: string | null;
  relative_url: string;
  seo_url: string;
  canonical_url: string;
  effective_seo_title: string;
  effective_seo_description: string;
  is_indexable: boolean;
  content?: string;
};

export type BlogCategory = {
  name: string;
  slug: string;
  article_count: number;
};

export type BlogPagination = {
  current_page: number;
  per_page: number;
  last_page: number;
  total: number;
  from: number | null;
  to: number | null;
  has_more_pages: boolean;
};

export type BlogSite = {
  full_name: string;
  professional_title: string | null;
  short_intro: string;
  welcome_message: string | null;
  website_title: string | null;
  profile_image: string | null;
  social_links: Record<string, string>;
};

export type BlogListResponse = {
  success: boolean;
  blogs: Blog[];
  pagination: BlogPagination;
  filters: {
    category: string | null;
    search: string | null;
    featured: boolean;
  };
};

export type FeaturedBlogsResponse = {
  success: boolean;
  count: number;
  blogs: Blog[];
};

export type BlogCategoriesResponse = {
  success: boolean;
  count: number;
  categories: BlogCategory[];
};

export type BlogSiteResponse = {
  success: boolean;
  site: BlogSite;
};

export type SingleBlogResponse = {
  success: boolean;
  blog: Blog;
  related_blogs: Blog[];
};

export type BlogCommenter = {
  visitor_id: number;
  display_name: string;
};

export type BlogComment = {
  id: number;
  body: string;
  created_at: string;
  commenter: BlogCommenter;
  replies: BlogComment[];
};

export type BlogCommentsResponse = {
  comments: BlogComment[];
  total: number;
  top_level_count: number;
};

export type BlogCommentSubmissionResponse = {
  message: string;
  comment: {
    id: number;
    status: "pending";
    body: string;
    created_at: string;
  };
};
