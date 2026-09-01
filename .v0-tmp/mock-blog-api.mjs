import { createServer } from "node:http";

const colors = ["#1f2937", "#0f766e", "#7c2d12", "#3730a3", "#831843", "#155e63"];
function blog(id, title, category, excerpt, comments = 0) {
  return {
    id, title, slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    category, category_slug: category ? category.toLowerCase().replace(/\s+/g, "-") : null,
    excerpt, post_type: "text", background_color: colors[id % colors.length],
    featured_image: null, featured_image_alt: title, tags: ["ideas", "tech"],
    is_featured: false, published_at: "2026-08-20T10:00:00Z", updated_at: "2026-08-20T10:00:00Z",
    comments_count: comments,
    author: { id: 1, name: "Anil Bhimani", avatar_url: null, bio: "Writer" },
    relative_url: "", seo_url: "", canonical_url: "", effective_seo_title: title,
    effective_seo_description: excerpt ?? "", is_indexable: true,
  };
}

const featured = [
  blog(1, "The quiet power of doing less, better", "Business", "Why constraint is the most underrated tool in modern product thinking, and how to apply it without stalling momentum.", 12),
  blog(2, "Reading the room in a distributed team", "Culture", "Remote work removed the hallway. Here is what replaces the signals we used to rely on.", 7),
  blog(3, "A practical take on local-first software", "Technology", "Sync engines are finally good enough to change how we build apps.", 4),
  blog(4, "Notes on writing that people finish", "Writing", "Structure beats style when you want a reader to reach the end.", 9),
];
const latest = [
  blog(5, "Small bets, compounding returns", "Business", "A framework for choosing what to build next when everything looks urgent.", 3),
  blog(6, "The interface is the argument", "Design", "Every layout is a claim about what matters most on the page.", 6),
  blog(7, "Why your side project stalled", "Culture", "It is almost never the code. It is the missing weekly loop.", 2),
  blog(8, "Databases for people who ship", "Technology", "Choosing storage without a three-day research spiral.", 1),
];
const mostCommented = [featured[0], featured[3], latest[1]];
const categories = [
  { name: "Technology", slug: "technology", article_count: 14 },
  { name: "Business", slug: "business", article_count: 9 },
  { name: "Culture", slug: "culture", article_count: 6 },
  { name: "Design", slug: "design", article_count: 5 },
  { name: "Writing", slug: "writing", article_count: 3 },
];
const popular_tags = [
  { name: "product", count: 18 }, { name: "remote", count: 11 },
  { name: "ai", count: 9 }, { name: "startups", count: 7 }, { name: "design", count: 5 },
];

const routes = {
  "/api/blogs/community-home": { featured, latest, most_commented: mostCommented, discover: featured[2], categories, popular_tags },
  "/api/blogs/site": { success: true, site: { full_name: "Anil Bhimani", professional_title: "Writer", short_intro: "Independent notes on technology, business, and the craft of building useful things.", welcome_message: null, website_title: "Geeky", profile_image: null, social_links: {} } },
  "/api/blog-author/me": { author: { id: 1, name: "Jordan Reeves", display_name: "Jordan Reeves", avatar_url: null, bio: "Writes about product and the craft of building." } },
};

createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  const path = req.url.split("?")[0];
  if (routes[path]) return res.end(JSON.stringify(routes[path]));
  res.statusCode = 404;
  res.end(JSON.stringify({ error: "not found" }));
}).listen(8000, "127.0.0.1", () => console.log("mock api on 8000"));
