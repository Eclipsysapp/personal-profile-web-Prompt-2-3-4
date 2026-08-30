import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (
    process.env.NEXT_PUBLIC_SITE_UNDER_CONSTRUCTION === "true"
  ) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/profile/",
        "/verify/",
        "/access/status/",
        "/access/code/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
