"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ArticleBlockBuilder, { ArticleBlock, emptyBlock } from "@/app/admin/blogs/ArticleBlockBuilder";
import { useBlogAuthor } from "@/components/blog/BlogAuthorProvider";
import { BLOG_API_URL, BLOG_CATEGORIES } from "@/lib/blog-community";
import "../write-studio.css";

type Form = { title: string; slug: string; excerpt: string; category: string; post_type: "text" | "image" | "video"; featured_image: string; featured_image_alt: string; tags: string; seo_title: string; seo_description: string };
const empty: Form = { title: "", slug: "", excerpt: "", category: "Technology", post_type: "text", featured_image: "", featured_image_alt: "", tags: "", seo_title: "", seo_description: "" };
type SavedPost = Form & { id: number; content_blocks: { version: 1; blocks: ArticleBlock[] } | null; status: string };

const PROVIDERS: Array<[string, string]> = [["google", "Google"], ["facebook", "Facebook"], ["github", "GitHub"], ["x", "X / Twitter"]];

function slug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function BlogWritePage() {
  const { author, token, loading, signInUrl, signOut } = useBlogAuthor();
  const router = useRouter();
  const [form, setForm] = useState<Form>(empty);
  const [blocks, setBlocks] = useState<ArticleBlock[]>(() => [emptyBlock("paragraph")]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    const id = Number(new URLSearchParams(window.location.search).get("id"));
    if (!id) return;
    fetch(`${BLOG_API_URL}/api/blog-author/posts`, { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        const post = (data.blogs as SavedPost[]).find((item) => item.id === id);
        if (!post) return;
        setEditingId(post.id);
        setForm({ title: post.title, slug: post.slug, excerpt: post.excerpt ?? "", category: post.category, post_type: post.post_type, featured_image: post.featured_image ?? "", featured_image_alt: post.featured_image_alt ?? "", tags: Array.isArray(post.tags) ? post.tags.join(", ") : "", seo_title: post.seo_title ?? "", seo_description: post.seo_description ?? "" });
        setBlocks(post.content_blocks?.blocks ?? [emptyBlock("paragraph")]);
      });
  }, [token]);

  function update<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function upload(file: File) {
    const data = new FormData();
    data.append("image", file);
    const response = await fetch(`${BLOG_API_URL}/api/blog-author/media/article-image`, { method: "POST", headers: { Accept: "application/json", Authorization: `Bearer ${token}` }, body: data });
    const json = await response.json();
    if (!response.ok) throw new Error(json.message ?? "Upload failed.");
    return json.image.url as string;
  }

  async function featured(file?: File) {
    if (!file) return;
    try {
      update("featured_image", await upload(file));
      setMessage("Featured image uploaded.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    }
  }

  async function save(event?: FormEvent, submit = false) {
    event?.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = { ...form, slug: form.slug || slug(form.title), tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean), content_blocks: { version: 1, blocks } };
      const response = await fetch(`${BLOG_API_URL}/api/blog-author/posts${editingId ? `/${editingId}` : ""}`, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      const json = await response.json();
      if (!response.ok) throw new Error(json.message ?? "Unable to save draft.");
      const id = editingId ?? json.blog.id;
      setEditingId(id);
      if (submit) {
        const sent = await fetch(`${BLOG_API_URL}/api/blog-author/posts/${id}/submit`, { method: "POST", headers: { Accept: "application/json", Authorization: `Bearer ${token}` } });
        const sentJson = await sent.json();
        if (!sent.ok) throw new Error(sentJson.message ?? "Unable to submit.");
        router.push("/blog/my-posts");
        return;
      }
      setMessage("Draft saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="wstudio">
        <div className="wstudio-loading">Loading the writing studio&hellip;</div>
      </section>
    );
  }

  if (!author) {
    return (
      <section className="wstudio">
        <div className="wstudio-gate">
          <p className="ws-kicker">Community publishing</p>
          <h1>Share something useful</h1>
          <p>
            Sign in with a supported social account to draft and submit an
            article. This community account is used only for the public blog and
            does not unlock protected profile pages.
          </p>
          <div className="wstudio-gate-providers">
            {PROVIDERS.map(([provider, label]) => (
              <a key={provider} href={signInUrl(provider)}>
                <b aria-hidden="true">{label.charAt(0)}</b>
                Continue with {label}
              </a>
            ))}
          </div>
          <p className="wstudio-gate-alt">
            Prefer the full page? <Link href="/blog/login">Go to author sign in</Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="wstudio">
      <div className="wstudio-bar">
        <Link href="/blog" className="wstudio-back">
          Back to blog
        </Link>
        <div className="wstudio-identity">
          <div className="wstudio-identity-copy">
            <small>{editingId ? "Editing article" : "New article"}</small>
            <strong>{author.display_name || author.name}</strong>
          </div>
          <button type="button" className="wstudio-signout" onClick={() => void signOut()}>
            Sign out
          </button>
        </div>
      </div>

      <form className="wstudio-grid" onSubmit={(e) => void save(e)}>
        <div className="wstudio-main">
          <div className="wstudio-surface">
            <input
              className="wstudio-title-input"
              required
              placeholder="Your article title"
              aria-label="Article title"
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((current) => ({ ...current, title, slug: current.slug === "" || current.slug === slug(current.title) ? slug(title) : current.slug }));
              }}
            />
            <textarea
              className="wstudio-excerpt-input"
              rows={2}
              placeholder="Add a short summary or excerpt (optional)"
              aria-label="Article excerpt"
              value={form.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
            />
          </div>

          <div className="wstudio-card">
            <div className="wstudio-card-head">
              <h2>Article content</h2>
              <span>Build your story block by block</span>
            </div>
            <ArticleBlockBuilder
              blocks={blocks}
              onChange={setBlocks}
              legacyContent=""
              legacyMode={false}
              onLegacyChange={() => undefined}
              onConvertLegacy={() => undefined}
              onUploadImage={upload}
            />
          </div>
        </div>

        <aside className="wstudio-panel">
          <div className="wstudio-card">
            <div className="wstudio-card-head">
              <h2>Publishing</h2>
            </div>
            <div className="ws-two">
              <label className="ws-field">
                <span>Category</span>
                <select value={form.category} onChange={(e) => update("category", e.target.value)}>
                  {BLOG_CATEGORIES.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label className="ws-field">
                <span>Post type</span>
                <select value={form.post_type} onChange={(e) => update("post_type", e.target.value as Form["post_type"])}>
                  <option value="text">Text post</option>
                  <option value="image">Image post</option>
                  <option value="video">Video post</option>
                </select>
              </label>
            </div>
          </div>

          <div className="wstudio-card">
            <div className="wstudio-card-head">
              <h2>Featured image</h2>
            </div>
            <div className="ws-stack">
              {form.featured_image ? (
                <div className="ws-featured">
                  <Image unoptimized src={form.featured_image} alt={form.featured_image_alt || "Featured preview"} width={900} height={500} />
                  <button type="button" onClick={() => update("featured_image", "")}>
                    Remove
                  </button>
                </div>
              ) : null}
              <label className="ws-upload">
                {form.featured_image ? "Replace image" : "Upload JPG, PNG or WebP"}
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => void featured(e.target.files?.[0])} />
              </label>
              <label className="ws-field">
                <span>Image alt text</span>
                <input value={form.featured_image_alt} onChange={(e) => update("featured_image_alt", e.target.value)} />
              </label>
            </div>
          </div>

          <div className="wstudio-card">
            <div className="wstudio-card-head">
              <h2>Search appearance</h2>
            </div>
            <div className="ws-stack">
              <label className="ws-field">
                <span>SEO URL slug</span>
                <input value={form.slug} onChange={(e) => update("slug", slug(e.target.value))} />
              </label>
              <label className="ws-field">
                <span>SEO title</span>
                <input value={form.seo_title} onChange={(e) => update("seo_title", e.target.value)} />
              </label>
              <label className="ws-field">
                <span>Meta description</span>
                <textarea rows={3} value={form.seo_description} onChange={(e) => update("seo_description", e.target.value)} />
              </label>
              <label className="ws-field">
                <span>Tags</span>
                <input value={form.tags} onChange={(e) => update("tags", e.target.value)} placeholder="nextjs, seo, web development" />
                <small>Separate tags with commas.</small>
              </label>
            </div>
          </div>

          <div className="wstudio-card">
            <div className="ws-stack">
              <p className="ws-notice">Your article stays private until an administrator approves it for publication.</p>
              {error ? <div className="ws-alert ws-alert-error" role="alert">{error}</div> : null}
              {message ? <div className="ws-alert ws-alert-success" role="status">{message}</div> : null}
              <div className="wstudio-actions">
                <button className="ws-btn ws-btn-primary" disabled={saving} type="submit">
                  {saving ? "Saving\u2026" : "Save draft"}
                </button>
                <button className="ws-btn ws-btn-ghost" disabled={saving} type="button" onClick={() => void save(undefined, true)}>
                  Submit for review
                </button>
              </div>
            </div>
          </div>
        </aside>
      </form>
    </section>
  );
}
