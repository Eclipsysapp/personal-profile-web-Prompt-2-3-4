export const BLOG_CATEGORIES = ["Technology","Programming","AI","Web Development","Mobile","Engineering","Product","Design","Business","Learning","Writing","Photography","Travel","Lifestyle"] as const;
export const BLOG_API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");
