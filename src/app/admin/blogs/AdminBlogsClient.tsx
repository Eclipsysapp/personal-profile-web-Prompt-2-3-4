"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api.anilbhimani.com";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://anilbhimani.com";

type BlogStatus = "draft" | "published" | "archived";
type BlogVisibility = "private" | "public";

type Blog = {
  id: number;
  title: string;
  slug: string;
  category: string | null;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  tags: string[];
  status: BlogStatus;
  visibility: BlogVisibility;
  is_featured: boolean | number;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_url?: string | null;
  canonical_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type BlogForm = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  featured_image: string;
  featured_image_alt: string;
  tags: string;
  status: BlogStatus;
  visibility: BlogVisibility;
  is_featured: boolean;
  published_at: string;
  seo_title: string;
  seo_description: string;
};

const emptyForm: BlogForm = {
  title: "",
  slug: "",
  category: "",
  excerpt: "",
  content: "",
  featured_image: "",
  featured_image_alt: "",
  tags: "",
  status: "draft",
  visibility: "private",
  is_featured: false,
  published_at: "",
  seo_title: "",
  seo_description: "",
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function normalizeTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function inputDateTime(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const local = new Date(
    date.getTime() - offset * 60_000
  );

  return local.toISOString().slice(0, 16);
}

export default function AdminBlogsClient() {
  const [adminToken, setAdminToken] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] =
    useState("");

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [form, setForm] =
    useState<BlogForm>(emptyForm);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loginLoading, setLoginLoading] =
    useState(false);

  const [imageUploading, setImageUploading] =
    useState(false);

  const [selectedImageName, setSelectedImageName] =
    useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const editingBlog = useMemo(
    () =>
      blogs.find((blog) => blog.id === editingId) ??
      null,
    [blogs, editingId]
  );

  const publicUrl = useMemo(() => {
    const slug =
      form.slug.trim() ||
      toSlug(form.title) ||
      "article-slug";

    return `${SITE_URL.replace(/\/$/, "")}/blog/${slug}`;
  }, [form.slug, form.title]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const existing =
        sessionStorage.getItem("admin_token") ?? "";

      setAdminToken(existing);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const authorizedFetch = useCallback(
    async (
      path: string,
      options: RequestInit = {}
    ) => {
      const isFormData =
        options.body instanceof FormData;

      const response = await fetch(
        `${API_URL}${path}`,
        {
          ...options,
          headers: {
            Accept: "application/json",

            ...(!isFormData && options.body
              ? {
                  "Content-Type":
                    "application/json",
                }
              : {}),

            Authorization:
              `Bearer ${adminToken}`,

            ...(options.headers ?? {}),
          },

          cache: "no-store",
        }
      );

      let data: Record<string, unknown> = {};

      try {
        data = await response.json();
      } catch {
        // Empty or non-JSON response.
      }

      if (!response.ok) {
        let apiMessage =
          typeof data.message === "string"
            ? data.message
            : `Request failed with status ${response.status}.`;

        if (
          data.errors &&
          typeof data.errors === "object"
        ) {
          const errors = data.errors as Record<
            string,
            unknown
          >;

          const firstError = Object.values(
            errors
          ).flat()[0];

          if (typeof firstError === "string") {
            apiMessage = firstError;
          }
        }

        throw new Error(apiMessage);
      }

      return data;
    },
    [adminToken]
  );

  const loadBlogs = useCallback(async () => {
    if (!adminToken) return;

    setLoading(true);
    setError("");

    try {
      const data = await authorizedFetch(
        "/api/admin/blogs"
      );

      const raw =
        (Array.isArray(data.blogs) &&
          data.blogs) ||
        (Array.isArray(data.data) &&
          data.data) ||
        [];

      setBlogs(raw as Blog[]);
    } catch (requestError) {
      const text =
        requestError instanceof Error
          ? requestError.message
          : "Unable to load blogs.";

      setError(text);

      if (
        text.toLowerCase().includes("invalid") ||
        text.toLowerCase().includes("expired") ||
        text
          .toLowerCase()
          .includes("unauthorized")
      ) {
        sessionStorage.removeItem(
          "admin_token"
        );

        setAdminToken("");
      }
    } finally {
      setLoading(false);
    }
  }, [adminToken, authorizedFetch]);

  useEffect(() => {
    if (!adminToken) {
      return;
    }

    const timer = window.setTimeout(() => {
      void loadBlogs();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [adminToken, loadBlogs]);

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoginLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            email: loginEmail.trim(),
            password: loginPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.admin_token) {
        throw new Error(
          data.message ?? "Admin login failed."
        );
      }

      sessionStorage.setItem(
        "admin_token",
        data.admin_token
      );

      setAdminToken(data.admin_token);
      setLoginPassword("");
      setMessage("Admin login successful.");
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Admin login failed."
      );
    } finally {
      setLoginLoading(false);
    }
  }

  function logout() {
    sessionStorage.removeItem("admin_token");

    setAdminToken("");
    setBlogs([]);
    setEditingId(null);
    setForm(emptyForm);
    setSelectedImageName("");
    setMessage("");
    setError("");
  }

  function updateForm<K extends keyof BlogForm>(
    key: K,
    value: BlogForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleTitleChange(value: string) {
    setForm((current) => {
      const oldAutomaticSlug = toSlug(
        current.title
      );

      const shouldUpdateSlug =
        editingId === null &&
        (
          current.slug === "" ||
          current.slug === oldAutomaticSlug
        );

      return {
        ...current,
        title: value,
        slug: shouldUpdateSlug
          ? toSlug(value)
          : current.slug,

        featured_image_alt:
          current.featured_image_alt === "" ||
          current.featured_image_alt ===
            current.title
            ? value
            : current.featured_image_alt,
      };
    });
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setSelectedImageName("");
    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function startEdit(blog: Blog) {
    setEditingId(blog.id);

    setForm({
      title: blog.title ?? "",
      slug: blog.slug ?? "",
      category: blog.category ?? "",
      excerpt: blog.excerpt ?? "",
      content: blog.content ?? "",
      featured_image:
        blog.featured_image ?? "",

      /*
       * Alt text is not stored in the blogs
       * table yet, so title is a safe SEO
       * default for the UI.
       */
      featured_image_alt:
        blog.title ?? "",

      tags: Array.isArray(blog.tags)
        ? blog.tags.join(", ")
        : "",

      status: blog.status ?? "draft",

      visibility:
        blog.visibility ?? "private",

      is_featured:
        Boolean(blog.is_featured),

      published_at: inputDateTime(
        blog.published_at
      ),

      seo_title: blog.seo_title ?? "",

      seo_description:
        blog.seo_description ?? "",
    });

    setSelectedImageName("");
    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleImageSelect(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0] ?? null;

    /*
     * Allows selecting the same file again.
     */
    event.target.value = "";

    if (!file) return;

    setError("");
    setMessage("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please choose a JPG, PNG or WebP image."
      );
      return;
    }

    const maxBytes = 5 * 1024 * 1024;

    if (file.size > maxBytes) {
      setError(
        "Featured image must be 5 MB or smaller."
      );
      return;
    }

    setImageUploading(true);
    setSelectedImageName(file.name);

    try {
      const uploadData = new FormData();

      uploadData.append("image", file);

      const altText =
        form.featured_image_alt.trim() ||
        form.title.trim();

      if (altText) {
        uploadData.append(
          "alt_text",
          altText
        );
      }

      const data = await authorizedFetch(
        "/api/admin/blogs/media/featured-image",
        {
          method: "POST",
          body: uploadData,
        }
      );

      const nestedImage =
  data.image &&
  typeof data.image === "object"
    ? (data.image as Record<string, unknown>)
    : null;

const imageUrl =
  typeof data.url === "string"
    ? data.url
    : nestedImage &&
        typeof nestedImage.url === "string"
      ? nestedImage.url
      : "";

if (!imageUrl) {
  throw new Error(
    "Upload completed but image URL was not returned."
  );
}
      setForm((current) => ({
        ...current,

        featured_image:
          imageUrl,

        featured_image_alt:
          current.featured_image_alt.trim()
            ? current.featured_image_alt
            : current.title,
      }));

      setMessage(
        "Featured image uploaded successfully."
      );
    } catch (uploadError) {
      setSelectedImageName("");

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload featured image."
      );
    } finally {
      setImageUploading(false);
    }
  }

  function removeFeaturedImage() {
    setForm((current) => ({
      ...current,
      featured_image: "",
    }));

    setSelectedImageName("");
    setMessage(
      "Featured image removed from this article."
    );
    setError("");
  }

  async function saveBlog(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Blog title is required.");
      return;
    }

    if (!form.content.trim()) {
      setError("Blog content is required.");
      return;
    }

    if (imageUploading) {
      setError(
        "Please wait for the image upload to finish."
      );
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      /*
       * New posts may send an empty slug.
       * Laravel will generate it automatically.
       *
       * Existing posts keep their stable slug
       * unless admin explicitly changes it.
       */
      const slugValue =
        form.slug.trim() !== ""
          ? toSlug(form.slug)
          : null;

      const payload = {
        title: form.title.trim(),

        ...(slugValue
          ? { slug: slugValue }
          : {}),

        category:
          form.category.trim() || null,

        excerpt:
          form.excerpt.trim() || null,

        content: form.content,

        featured_image:
          form.featured_image.trim() || null,

        tags: normalizeTags(form.tags),

        status: form.status,

        visibility: form.visibility,

        is_featured:
          form.is_featured,

        published_at:
          form.published_at || null,

        seo_title:
          form.seo_title.trim() || null,

        seo_description:
          form.seo_description.trim() ||
          null,
      };

      if (editingId) {
        await authorizedFetch(
          `/api/admin/blogs/${editingId}`,
          {
            /*
             * Backend route is POST, not PUT.
             */
            method: "POST",
            body: JSON.stringify(payload),
          }
        );

        setMessage(
          "Blog updated successfully."
        );
      } else {
        await authorizedFetch(
          "/api/admin/blogs",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );

        setMessage(
          "Blog created successfully."
        );
      }

      setEditingId(null);
      setForm(emptyForm);
      setSelectedImageName("");

      await loadBlogs();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save blog."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteBlog(blog: Blog) {
    const confirmed = window.confirm(
      `Delete "${blog.title}"?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await authorizedFetch(
        `/api/admin/blogs/${blog.id}`,
        {
          method: "DELETE",
        }
      );

      if (editingId === blog.id) {
        setEditingId(null);
        setForm(emptyForm);
        setSelectedImageName("");
      }

      setMessage(
        "Blog deleted successfully."
      );

      await loadBlogs();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete blog."
      );
    }
  }

  if (!adminToken) {
    return (
      <main className="min-h-screen bg-zinc-50 px-4 py-16 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
        <div className="mx-auto max-w-md">
          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Administration
            </p>

            <h1 className="text-3xl font-semibold tracking-tight">
              Blog Manager
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Sign in to create, edit and
              publish SEO-ready blog content.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <label className="mb-5 block">
              <FieldLabel>Email</FieldLabel>

              <input
                type="email"
                value={loginEmail}
                onChange={(event) =>
                  setLoginEmail(
                    event.target.value
                  )
                }
                autoComplete="username"
                required
                className={inputClass}
              />
            </label>

            <label className="mb-6 block">
              <FieldLabel>Password</FieldLabel>

              <input
                type="password"
                value={loginPassword}
                onChange={(event) =>
                  setLoginPassword(
                    event.target.value
                  )
                }
                autoComplete="current-password"
                required
                className={inputClass}
              />
            </label>

            {error && (
              <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full rounded-xl bg-zinc-950 px-5 py-3 font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              {loginLoading
                ? "Signing in..."
                : "Sign in"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Admin
            </p>

            <h1 className="mt-1 text-xl font-semibold">
              Blogs
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={startCreate}
              className="rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              New blog
            </button>

            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
        <section>
          <form
            onSubmit={saveBlog}
            className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="border-b border-zinc-200 p-6 dark:border-zinc-800">
              <p className="text-sm text-zinc-500">
                {editingBlog
                  ? `Editing #${editingBlog.id}`
                  : "New article"}
              </p>

              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                {editingBlog
                  ? editingBlog.title
                  : "Create blog post"}
              </h2>
            </div>

            <div className="space-y-8 p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="md:col-span-2">
                  <FieldLabel>Title</FieldLabel>

                  <input
                    value={form.title}
                    onChange={(event) =>
                      handleTitleChange(
                        event.target.value
                      )
                    }
                    required
                    className={inputClass}
                    placeholder="A clear, useful article title"
                  />
                </label>

                <label>
                  <FieldLabel>
                    SEO URL slug
                  </FieldLabel>

                  <input
                    value={form.slug}
                    onChange={(event) =>
                      updateForm(
                        "slug",
                        toSlug(
                          event.target.value
                        )
                      )
                    }
                    className={inputClass}
                    placeholder="Automatically generated"
                  />

                  <p className="mt-2 break-all text-xs text-zinc-500">
                    {publicUrl}
                  </p>

                  {editingId && (
                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                      Change this only if you
                      intentionally want to change
                      the article URL.
                    </p>
                  )}
                </label>

                <label>
                  <FieldLabel>
                    Category
                  </FieldLabel>

                  <input
                    value={form.category}
                    onChange={(event) =>
                      updateForm(
                        "category",
                        event.target.value
                      )
                    }
                    className={inputClass}
                    placeholder="Technology"
                  />
                </label>
              </div>

              <div>
                <FieldLabel>Excerpt</FieldLabel>

                <textarea
                  value={form.excerpt}
                  onChange={(event) =>
                    updateForm(
                      "excerpt",
                      event.target.value
                    )
                  }
                  rows={3}
                  className={inputClass}
                  placeholder="Short summary used on blog cards and search results."
                />

                <CharCount
                  value={form.excerpt}
                  recommended={160}
                />
              </div>

              <div>
                <FieldLabel>
                  Article content
                </FieldLabel>

                <textarea
                  value={form.content}
                  onChange={(event) =>
                    updateForm(
                      "content",
                      event.target.value
                    )
                  }
                  rows={18}
                  required
                  className={`${inputClass} font-mono text-sm leading-7`}
                  placeholder="Write article content here..."
                />

                <p className="mt-2 text-xs text-zinc-500">
                  Rich text / Markdown editor can
                  be added later.
                </p>
              </div>

              {/* Featured image */}
              <div className="border-t border-zinc-200 pt-8 dark:border-zinc-800">
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Media
                  </p>

                  <h3 className="mt-1 text-lg font-semibold">
                    Featured image
                  </h3>

                  <p className="mt-2 text-sm text-zinc-500">
                    JPG, PNG or WebP. Maximum
                    file size 5 MB.
                  </p>
                </div>

                {form.featured_image ? (
                  <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700">
                    <div className="relative aspect-[16/9] bg-zinc-100 dark:bg-zinc-950">
                      {/* Standard img is intentional
                          for admin preview because the
                          remote image host may vary. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          form.featured_image
                        }
                        alt={
                          form.featured_image_alt ||
                          form.title ||
                          "Featured image"
                        }
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="space-y-4 p-4">
                      <div>
                        <p className="text-xs font-medium text-zinc-500">
                          Uploaded image
                        </p>

                        <p className="mt-1 break-all text-xs text-zinc-600 dark:text-zinc-400">
                          {form.featured_image}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <label className="cursor-pointer rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
                          {imageUploading
                            ? "Uploading..."
                            : "Change image"}

                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            disabled={
                              imageUploading
                            }
                            onChange={
                              handleImageSelect
                            }
                            className="hidden"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={
                            removeFeaturedImage
                          }
                          disabled={
                            imageUploading
                          }
                          className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                        >
                          Remove image
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label
                    className={`flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center transition hover:border-zinc-500 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-zinc-500 dark:hover:bg-zinc-900 ${
                      imageUploading
                        ? "pointer-events-none opacity-60"
                        : ""
                    }`}
                  >
                    <span className="text-base font-semibold">
                      {imageUploading
                        ? "Uploading image..."
                        : "Choose featured image"}
                    </span>

                    <span className="mt-2 text-sm text-zinc-500">
                      Click to select JPG, PNG or
                      WebP
                    </span>

                    {selectedImageName && (
                      <span className="mt-3 text-xs text-zinc-500">
                        {selectedImageName}
                      </span>
                    )}

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      disabled={imageUploading}
                      onChange={
                        handleImageSelect
                      }
                      className="hidden"
                    />
                  </label>
                )}

                <div className="mt-5">
                  <FieldLabel>
                    Image alt text
                  </FieldLabel>

                  <input
                    value={
                      form.featured_image_alt
                    }
                    onChange={(event) =>
                      updateForm(
                        "featured_image_alt",
                        event.target.value
                      )
                    }
                    className={inputClass}
                    placeholder={
                      form.title ||
                      "Describe the image"
                    }
                  />

                  <p className="mt-2 text-xs leading-5 text-zinc-500">
                    Used for accessibility and
                    image SEO. The article title
                    is used as the default.
                  </p>
                </div>
              </div>

              <div>
                <FieldLabel>Tags</FieldLabel>

                <input
                  value={form.tags}
                  onChange={(event) =>
                    updateForm(
                      "tags",
                      event.target.value
                    )
                  }
                  className={inputClass}
                  placeholder="nextjs, seo, web"
                />

                <p className="mt-2 text-xs text-zinc-500">
                  Separate tags with commas.
                </p>
              </div>

              <div className="border-t border-zinc-200 pt-8 dark:border-zinc-800">
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Publishing
                  </p>

                  <h3 className="mt-1 text-lg font-semibold">
                    Visibility & status
                  </h3>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <label>
                    <FieldLabel>
                      Status
                    </FieldLabel>

                    <select
                      value={form.status}
                      onChange={(event) =>
                        updateForm(
                          "status",
                          event.target
                            .value as BlogStatus
                        )
                      }
                      className={inputClass}
                    >
                      <option value="draft">
                        Draft
                      </option>

                      <option value="published">
                        Published
                      </option>

                      <option value="archived">
                        Archived
                      </option>
                    </select>
                  </label>

                  <label>
                    <FieldLabel>
                      Visibility
                    </FieldLabel>

                    <select
                      value={form.visibility}
                      onChange={(event) =>
                        updateForm(
                          "visibility",
                          event.target
                            .value as BlogVisibility
                        )
                      }
                      className={inputClass}
                    >
                      <option value="private">
                        Private
                      </option>

                      <option value="public">
                        Public
                      </option>
                    </select>
                  </label>

                  <label>
                    <FieldLabel>
                      Publish date
                    </FieldLabel>

                    <input
                      type="datetime-local"
                      value={
                        form.published_at
                      }
                      onChange={(event) =>
                        updateForm(
                          "published_at",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </label>

                  <label className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-700">
                    <input
                      type="checkbox"
                      checked={
                        form.is_featured
                      }
                      onChange={(event) =>
                        updateForm(
                          "is_featured",
                          event.target.checked
                        )
                      }
                      className="h-4 w-4"
                    />

                    <span>
                      <span className="block text-sm font-medium">
                        Featured post
                      </span>

                      <span className="text-xs text-zinc-500">
                        Highlight this article on
                        the blog homepage.
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-8 dark:border-zinc-800">
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Search optimization
                  </p>

                  <h3 className="mt-1 text-lg font-semibold">
                    SEO
                  </h3>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                    These fields control the
                    article metadata, canonical
                    search result title and meta
                    description.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <FieldLabel>
                      SEO title
                    </FieldLabel>

                    <input
                      value={form.seo_title}
                      onChange={(event) =>
                        updateForm(
                          "seo_title",
                          event.target.value
                        )
                      }
                      className={inputClass}
                      placeholder={
                        form.title ||
                        "SEO title"
                      }
                    />

                    <CharCount
                      value={form.seo_title}
                      recommended={60}
                    />
                  </div>

                  <div>
                    <FieldLabel>
                      Meta description
                    </FieldLabel>

                    <textarea
                      value={
                        form.seo_description
                      }
                      onChange={(event) =>
                        updateForm(
                          "seo_description",
                          event.target.value
                        )
                      }
                      rows={4}
                      className={inputClass}
                      placeholder="Concise description for search engines."
                    />

                    <CharCount
                      value={
                        form.seo_description
                      }
                      recommended={160}
                    />
                  </div>

                  <SearchPreview
                    form={form}
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </div>
              )}

              {message && (
                <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                  {message}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-zinc-200 bg-zinc-50 px-6 py-5 dark:border-zinc-800 dark:bg-zinc-950/50">
              <button
                type="submit"
                disabled={
                  saving || imageUploading
                }
                className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                {saving
                  ? "Saving..."
                  : imageUploading
                    ? "Uploading image..."
                    : editingId
                      ? "Update article"
                      : "Create article"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={startCreate}
                  disabled={
                    saving || imageUploading
                  }
                  className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </section>

        <aside>
          <div className="sticky top-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-200 p-5 dark:border-zinc-800">
              <div>
                <h2 className="font-semibold">
                  Articles
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  {blogs.length} total
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  void loadBlogs()
                }
                disabled={loading}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
              >
                {loading
                  ? "Loading..."
                  : "Refresh"}
              </button>
            </div>

            <div className="max-h-[calc(100vh-170px)] overflow-y-auto">
              {!loading &&
                blogs.length === 0 && (
                  <div className="p-8 text-center text-sm text-zinc-500">
                    No blog posts yet.
                  </div>
                )}

              {blogs.map((blog) => (
                <article
                  key={blog.id}
                  className="border-b border-zinc-100 p-5 last:border-b-0 dark:border-zinc-800"
                >
                  {blog.featured_image && (
                    <div className="mb-4 aspect-[16/9] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          blog.featured_image
                        }
                        alt={blog.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="mb-3 flex flex-wrap gap-2">
                    <StatusBadge
                      value={blog.status}
                    />

                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {blog.visibility}
                    </span>

                    {Boolean(
                      blog.is_featured
                    ) && (
                      <span className="rounded-full bg-zinc-950 px-2.5 py-1 text-[11px] font-medium text-white dark:bg-white dark:text-zinc-950">
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="line-clamp-2 font-semibold leading-6">
                    {blog.title}
                  </h3>

                  <p className="mt-1 truncate text-xs text-zinc-500">
                    /blog/{blog.slug}
                  </p>

                  <p className="mt-3 text-xs text-zinc-500">
                    Updated{" "}
                    {formatDate(
                      blog.updated_at
                    )}
                  </p>

                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        startEdit(blog)
                      }
                      className="text-sm font-medium underline-offset-4 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        void deleteBlog(blog)
                      }
                      className="text-sm font-medium text-red-600 underline-offset-4 hover:underline dark:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function FieldLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="mb-2 block text-sm font-medium">
      {children}
    </span>
  );
}

function CharCount({
  value,
  recommended,
}: {
  value: string;
  recommended: number;
}) {
  const count = value.length;

  return (
    <p
      className={`mt-2 text-xs ${
        count > recommended
          ? "text-amber-600 dark:text-amber-400"
          : "text-zinc-500"
      }`}
    >
      {count} characters · recommended around{" "}
      {recommended}
    </p>
  );
}

function SearchPreview({
  form,
}: {
  form: BlogForm;
}) {
  const title =
    form.seo_title.trim() ||
    form.title.trim() ||
    "Article title";

  const description =
    form.seo_description.trim() ||
    form.excerpt.trim() ||
    "Search description will appear here.";

  const slug =
    form.slug.trim() ||
    toSlug(form.title) ||
    "article-slug";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-950">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
        Search preview
      </p>

      <p className="text-sm text-emerald-700 dark:text-emerald-400">
        anilbhimani.com › blog › {slug}
      </p>

      <p className="mt-1 text-xl font-medium text-blue-700 dark:text-blue-400">
        {title.slice(0, 70)}
      </p>

      <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {description.slice(0, 180)}
      </p>
    </div>
  );
}

function StatusBadge({
  value,
}: {
  value: BlogStatus;
}) {
  const style =
    value === "published"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
      : value === "archived"
        ? "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200"
        : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${style}`}
    >
      {value}
    </span>
  );
}

const inputClass =
  "w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 dark:border-zinc-700 dark:focus:border-zinc-100 dark:focus:ring-zinc-100";