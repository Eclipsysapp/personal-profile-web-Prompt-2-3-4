import type {
  BlogCategoriesResponse,
  BlogListResponse,
  BlogSiteResponse,
  FeaturedBlogsResponse,
  SingleBlogResponse,
  BlogCommunityHomeResponse,
} from "@/types/blog";

export async function getBlogCommunityHome(): Promise<BlogCommunityHomeResponse> {
  return getJson<BlogCommunityHomeResponse>("/api/blogs/community-home", { cache:"no-store" });
}

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"
).replace(/\/$/, "");

async function getJson<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      Accept: "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(
      `Blog API request failed (${response.status})`,
    );
  }

  return (await response.json()) as T;
}

export async function getBlogSite(): Promise<BlogSiteResponse> {
  return getJson<BlogSiteResponse>("/api/blogs/site", {
    next: { revalidate: 300 },
  });
}

export async function getBlogs(
  page = 1,
  perPage = 8,
  options?: {
    category?: string;
    search?: string;
    featured?: boolean;
  },
): Promise<BlogListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });

  if (options?.category) {
    params.set("category", options.category);
  }

  if (options?.search) {
    params.set("search", options.search);
  }

  if (options?.featured) {
    params.set("featured", "1");
  }

  return getJson<BlogListResponse>(
    `/api/blogs?${params.toString()}`,
    { cache: "no-store" },
  );
}

export async function getFeaturedBlogs(
  limit = 5,
): Promise<FeaturedBlogsResponse> {
  return getJson<FeaturedBlogsResponse>(
    `/api/blogs/featured?limit=${limit}`,
    { cache: "no-store" },
  );
}

export async function getBlogCategories(): Promise<BlogCategoriesResponse> {
  return getJson<BlogCategoriesResponse>(
    "/api/blogs/categories",
    { next: { revalidate: 300 } },
  );
}

export async function getBlogBySlug(
  slug: string,
): Promise<SingleBlogResponse> {
  return getJson<SingleBlogResponse>(
    `/api/blogs/${encodeURIComponent(slug)}`,
    { cache: "no-store" },
  );
}
