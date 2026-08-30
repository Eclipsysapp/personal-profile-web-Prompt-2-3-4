"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";

export type BlockType = "heading" | "paragraph" | "rich_text" | "quote" | "image" | "youtube" | "twitter" | "facebook" | "instagram" | "pinterest" | "tiktok" | "embed";
export type ArticleBlock = {
  id: string;
  type: BlockType;
  text: string;
  level?: "h2" | "h3" | "h4";
  citation?: string;
  url?: string;
  alt?: string;
  caption?: string;
};

function id() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `block-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function emptyBlock(type: BlockType): ArticleBlock {
  return { id: id(), type, text: "", level: type === "heading" ? "h2" : undefined, url: "", alt: "", caption: "", citation: "" };
}

function escapeHtml(value = "") {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function paragraphHtml(value: string) {
  return escapeHtml(value.trim()).replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br>");
}

function parsedUrl(value: string) {
  try {
    const result = new URL(value.trim());
    return result.protocol === "https:" || (result.protocol === "http:" && ["localhost", "127.0.0.1"].includes(result.hostname)) ? result : null;
  } catch { return null; }
}

const hosts: Record<Exclude<BlockType, "heading" | "paragraph" | "rich_text" | "quote" | "image" | "embed">, string[]> = {
  youtube: ["youtube.com", "www.youtube.com", "youtu.be"],
  twitter: ["x.com", "www.x.com", "twitter.com", "www.twitter.com"],
  facebook: ["facebook.com", "www.facebook.com"],
  instagram: ["instagram.com", "www.instagram.com"],
  pinterest: ["pinterest.com", "www.pinterest.com", "pin.it"],
  tiktok: ["tiktok.com", "www.tiktok.com"],
};

export function detectPlatform(value: string): BlockType | null {
  const url = parsedUrl(value);
  if (!url) return null;
  for (const [type, allowed] of Object.entries(hosts)) if (allowed.includes(url.hostname.toLowerCase())) return type as BlockType;
  return "embed";
}

function safeProviderUrl(type: BlockType, value = "") {
  const url = parsedUrl(value);
  if (!url) return null;
  if (type === "embed") return url;
  const allowed = hosts[type as keyof typeof hosts];
  return allowed?.includes(url.hostname.toLowerCase()) ? url : null;
}

function youtubeEmbed(value = "") {
  const url = safeProviderUrl("youtube", value);
  if (!url) return null;
  let videoId = "";
  if (url.hostname === "youtu.be") videoId = url.pathname.split("/").filter(Boolean)[0] ?? "";
  else if (url.pathname.startsWith("/shorts/")) videoId = url.pathname.split("/")[2] ?? "";
  else videoId = url.searchParams.get("v") ?? (url.pathname.startsWith("/embed/") ? url.pathname.split("/")[2] ?? "" : "");
  return /^[A-Za-z0-9_-]{6,20}$/.test(videoId) ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
}

function richTextHtml(value: string) {
  let html = escapeHtml(value.trim());
  html = html.replace(/\[b\]([\s\S]*?)\[\/b\]/g, "<strong>$1</strong>")
    .replace(/\[i\]([\s\S]*?)\[\/i\]/g, "<em>$1</em>")
    .replace(/\[u\]([\s\S]*?)\[\/u\]/g, "<u>$1</u>")
    .replace(/\[s\]([\s\S]*?)\[\/s\]/g, "<s>$1</s>")
    .replace(/\[quote\]([\s\S]*?)\[\/quote\]/g, "<blockquote><p>$1</p></blockquote>")
    .replace(/\[link=(https:\/\/[^\]\s]+)\]([\s\S]*?)\[\/link\]/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>')
    .replace(/\[ul\]([\s\S]*?)\[\/ul\]/g, (_, body: string) => `<ul>${body.replace(/\[item\]([\s\S]*?)\[\/item\]/g, "<li>$1</li>")}</ul>`)
    .replace(/\[ol\]([\s\S]*?)\[\/ol\]/g, (_, body: string) => `<ol>${body.replace(/\[item\]([\s\S]*?)\[\/item\]/g, "<li>$1</li>")}</ol>`)
    .replace(/\n/g, "<br>");
  return html;
}

export function serializeBlocks(blocks: ArticleBlock[]) {
  const html = blocks.map((block) => {
    if (block.type === "heading") {
      const level = ["h2", "h3", "h4"].includes(block.level ?? "") ? block.level : "h2";
      return block.text.trim() ? `<${level}>${escapeHtml(block.text.trim())}</${level}>` : "";
    }
    if (block.type === "paragraph") return block.text.trim() ? `<p>${paragraphHtml(block.text)}</p>` : "";
    if (block.type === "rich_text") return block.text.trim() ? `<div class="blog-rich-text">${richTextHtml(block.text)}</div>` : "";
    if (block.type === "quote") return block.text.trim() ? `<blockquote><p>${paragraphHtml(block.text)}</p>${block.citation?.trim() ? `<cite>${escapeHtml(block.citation.trim())}</cite>` : ""}</blockquote>` : "";
    if (block.type === "image") {
      const url = parsedUrl(block.url ?? "");
      if (!url) return "";
      return `<figure><img src="${escapeHtml(url.href)}" alt="${escapeHtml(block.alt?.trim() ?? "")}" loading="lazy">${block.caption?.trim() ? `<figcaption>${escapeHtml(block.caption.trim())}</figcaption>` : ""}</figure>`;
    }
    if (block.type === "youtube") {
      const url = youtubeEmbed(block.url);
      return url ? `<div class="blog-video-embed"><iframe src="${url}" title="YouTube video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>` : "";
    }
    const url = safeProviderUrl(block.type, block.url);
    if (!url) return "";
    const platform = block.type === "embed" ? "embed" : block.type;
    const label = platformLabel(platform);
    return `<div class="blog-social-embed" data-platform="${platform}"><a href="${escapeHtml(url.href)}" target="_blank" rel="noopener noreferrer"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(url.hostname + url.pathname)}</span><em>Open post</em></a></div>`;
  }).filter(Boolean).join("\n");
  return html;
}

export function parseBlockContent(contentBlocks: unknown, content: string): { blocks: ArticleBlock[]; legacy: boolean } {
  if (!contentBlocks || typeof contentBlocks !== "object") return { blocks: [], legacy: Boolean(content.trim()) };
  const manifest = contentBlocks as { version?: unknown; blocks?: unknown };
  if (manifest.version !== 1 || !Array.isArray(manifest.blocks)) return { blocks: [], legacy: Boolean(content.trim()) };
  return { blocks: (manifest.blocks as ArticleBlock[]).map((block) => ({ ...block, id: block.id || id() })), legacy: false };
}

function platformLabel(type: BlockType) {
  return ({ heading: "Heading", paragraph: "Plain Text", rich_text: "Rich Text", quote: "Quote", image: "Image", youtube: "YouTube", twitter: "X / Twitter", facebook: "Facebook", instagram: "Instagram", pinterest: "Pinterest", tiktok: "TikTok", embed: "Embed" } as Record<BlockType, string>)[type];
}

const toolbarGroups: Array<{ label: string; blocks: Array<[BlockType, string]> }> = [
  { label: "Text", blocks: [["heading", "Heading"], ["paragraph", "Plain Text"], ["rich_text", "Rich Text"], ["quote", "Quote"]] },
  { label: "Media", blocks: [["image", "Image"], ["youtube", "YouTube"]] },
  { label: "Social", blocks: [["twitter", "X"], ["facebook", "Facebook"], ["instagram", "Instagram"], ["pinterest", "Pinterest"], ["tiktok", "TikTok"], ["embed", "Embed"]] },
];

export default function ArticleBlockBuilder({ blocks, onChange, legacyContent, legacyMode, onLegacyChange, onConvertLegacy, onUploadImage }: {
  blocks: ArticleBlock[];
  onChange: (blocks: ArticleBlock[]) => void;
  legacyContent: string;
  legacyMode: boolean;
  onLegacyChange: (value: string) => void;
  onConvertLegacy: () => void;
  onUploadImage: (file: File) => Promise<string>;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const previewHtml = useMemo(() => serializeBlocks(blocks), [blocks]);

  function add(type: BlockType) {
    const next = emptyBlock(type);
    const index = selected ? blocks.findIndex((block) => block.id === selected) : -1;
    const copy = [...blocks];
    copy.splice(index >= 0 ? index + 1 : copy.length, 0, next);
    onChange(copy); setSelected(next.id);
  }
  function update(blockId: string, changes: Partial<ArticleBlock>) { onChange(blocks.map((block) => block.id === blockId ? { ...block, ...changes } : block)); }
  function move(index: number, direction: -1 | 1) { const target = index + direction; if (target < 0 || target >= blocks.length) return; const copy = [...blocks]; [copy[index], copy[target]] = [copy[target], copy[index]]; onChange(copy); }
  function remove(block: ArticleBlock) {
    const meaningful = Boolean(block.text.trim() || block.url?.trim() || block.caption?.trim());
    if (meaningful && !window.confirm(`Remove this ${platformLabel(block.type)} block?`)) return;
    onChange(blocks.filter((item) => item.id !== block.id)); if (selected === block.id) setSelected(null);
  }

  if (legacyMode) return (
    <div className="admin-legacy-editor">
      <div className="admin-legacy-notice"><strong>Legacy article content</strong><p>This article predates the block builder. Its HTML is preserved exactly unless you deliberately convert it.</p></div>
      <textarea value={legacyContent} onChange={(event) => onLegacyChange(event.target.value)} rows={14} required className="admin-legacy-textarea font-mono text-sm leading-7" aria-label="Legacy article HTML" />
      <p className="admin-legacy-warning">Starting fresh changes editing mode now, but legacy content is replaced only after you explicitly save the article.</p>
      <button type="button" className="admin-outline-button" onClick={onConvertLegacy}>Start fresh with blocks</button>
    </div>
  );

  return (
    <div className="admin-block-builder">
      <div className="admin-builder-topline"><p>{blocks.length} content block{blocks.length === 1 ? "" : "s"}</p><button type="button" className="admin-outline-button" onClick={() => setPreview((value) => !value)}>{preview ? "Edit blocks" : "Preview article"}</button></div>
      {preview ? <div className="admin-article-preview gos-content" dangerouslySetInnerHTML={{ __html: previewHtml }} /> : (
        <div className="admin-block-list">
          {blocks.length === 0 && <p className="admin-empty-blocks">Add a heading or text block to begin your article.</p>}
          {blocks.map((block, index) => (
            <article key={block.id} data-block-type={block.type} className={`admin-block-card ${selected === block.id ? "is-selected" : ""}`} onClick={() => setSelected(block.id)}>
              <div className="admin-block-header"><span>{platformLabel(block.type)}</span><div><button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move ${platformLabel(block.type)} up`}>↑</button><button type="button" onClick={() => move(index, 1)} disabled={index === blocks.length - 1} aria-label={`Move ${platformLabel(block.type)} down`}>↓</button><button type="button" className="is-remove" onClick={() => remove(block)}>Remove</button></div></div>
              <BlockFields block={block} update={(changes) => update(block.id, changes)} onUploadImage={onUploadImage} />
            </article>
          ))}
        </div>
      )}
      {!preview && <div className="admin-add-more"><p>Add more</p><div className="admin-add-groups">{toolbarGroups.map((group) => <div className="admin-add-group" key={group.label}><span>{group.label}</span><div>{group.blocks.map(([type, label]) => <button key={type} type="button" title={`Add ${platformLabel(type)} block`} onClick={() => add(type)}><b aria-hidden="true">{type === "paragraph" ? "¶" : type === "rich_text" ? "Aa" : type === "quote" ? "❝" : type === "image" ? "▧" : type === "heading" ? "H2" : "↗"}</b>{label}</button>)}</div></div>)}</div></div>}
    </div>
  );
}

function BlockFields({ block, update, onUploadImage }: { block: ArticleBlock; update: (changes: Partial<ArticleBlock>) => void; onUploadImage: (file: File) => Promise<string> }) {
  if (block.type === "heading") return <div className="admin-block-fields compact"><select value={block.level} onChange={(event) => update({ level: event.target.value as ArticleBlock["level"] })} aria-label="Heading level"><option value="h2">H2</option><option value="h3">H3</option><option value="h4">H4</option></select><input value={block.text} onChange={(event) => update({ text: event.target.value })} placeholder="Section heading" aria-label="Heading text" /></div>;
  if (block.type === "paragraph") return <textarea value={block.text} onChange={(event) => update({ text: event.target.value })} rows={5} placeholder="Write a clear article paragraph…" aria-label="Paragraph text" />;
  if (block.type === "rich_text") return <RichTextField block={block} update={update} />;
  if (block.type === "quote") return <div className="admin-block-fields"><textarea value={block.text} onChange={(event) => update({ text: event.target.value })} rows={4} placeholder="Quote text" aria-label="Quote text" /><input value={block.citation} onChange={(event) => update({ citation: event.target.value })} placeholder="Citation or source (optional)" aria-label="Quote citation" /></div>;
  if (block.type === "image") return <ImageField block={block} update={update} onUploadImage={onUploadImage} />;
  const detected = detectPlatform(block.url ?? "");
  const youtubeUrl = block.type === "youtube" ? youtubeEmbed(block.url) : null;
  const socialUrl = block.type !== "youtube" ? safeProviderUrl(block.type, block.url) : null;
  const valid = Boolean(youtubeUrl || socialUrl);
  return <div className="admin-block-fields"><input type="url" value={block.url} onChange={(event) => update({ url: event.target.value })} placeholder={`Paste ${platformLabel(block.type)} HTTPS URL`} aria-label={`${platformLabel(block.type)} URL`} />{block.url && <p className={valid ? "admin-url-ok" : "admin-field-error"}>{valid ? `${platformLabel(detected ?? block.type)} link ready to embed.` : `Enter a valid ${platformLabel(block.type)} HTTPS URL.`}</p>}{socialUrl && <a className="admin-social-preview" href={socialUrl.href} target="_blank" rel="noopener noreferrer"><strong>{platformLabel(detected ?? block.type)}</strong><span>{socialUrl.hostname}{socialUrl.pathname}</span><em>Open preview ↗</em></a>}</div>;
}

function RichTextField({ block, update }: { block: ArticleBlock; update: (changes: Partial<ArticleBlock>) => void }) {
  const field = useRef<HTMLTextAreaElement>(null);
  function wrap(open: string, close: string, fallback: string) {
    const element = field.current;
    const start = element?.selectionStart ?? block.text.length;
    const end = element?.selectionEnd ?? start;
    const selected = block.text.slice(start, end) || fallback;
    update({ text: `${block.text.slice(0, start)}${open}${selected}${close}${block.text.slice(end)}` });
  }
  return <div className="admin-rich-editor"><div className="admin-rich-toolbar" role="toolbar" aria-label="Rich text formatting"><button type="button" onClick={() => wrap("[b]", "[/b]", "bold text")}><b>B</b></button><button type="button" onClick={() => wrap("[i]", "[/i]", "italic text")}><i>I</i></button><button type="button" onClick={() => wrap("[u]", "[/u]", "underlined text")}><u>U</u></button><button type="button" onClick={() => wrap("[s]", "[/s]", "struck text")}><s>S</s></button><button type="button" onClick={() => wrap("[quote]", "[/quote]", "quote")}>Quote</button><button type="button" onClick={() => wrap("[link=https://example.com]", "[/link]", "link text")}>Link</button><button type="button" onClick={() => wrap("[ul][item]", "[/item][/ul]", "list item")}>Bullets</button><button type="button" onClick={() => wrap("[ol][item]", "[/item][/ol]", "list item")}>Numbers</button></div><textarea ref={field} value={block.text} onChange={(event) => update({ text: event.target.value })} rows={7} placeholder="Write rich text, then select text and apply formatting…" aria-label="Rich text content" /><p>Formatting uses safe editor tokens and is converted to semantic HTML when saved.</p></div>;
}

function ImageField({ block, update, onUploadImage }: { block: ArticleBlock; update: (changes: Partial<ArticleBlock>) => void; onUploadImage: (file: File) => Promise<string> }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  async function upload(file?: File) {
    if (!file) return;
    setUploading(true); setUploadError("");
    try { update({ url: await onUploadImage(file) }); }
    catch (error) { setUploadError(error instanceof Error ? error.message : "Unable to upload image."); }
    finally { setUploading(false); }
  }
  return <div className="admin-image-block-layout">{block.url && parsedUrl(block.url) ? <div className="admin-inline-image-preview"><Image unoptimized src={block.url} alt={block.alt || "Article image preview"} width={280} height={200} /></div> : null}<div className="admin-block-fields"><label className="admin-inline-upload">{uploading ? "Uploading…" : "Upload article image"}<input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" disabled={uploading} onChange={(event) => void upload(event.target.files?.[0])} /></label><span className="admin-image-or">or use an existing HTTPS URL</span><input type="url" value={block.url} onChange={(event) => update({ url: event.target.value })} placeholder="https://… image URL" aria-label="Image URL" /><input value={block.alt} onChange={(event) => update({ alt: event.target.value })} placeholder="Alt text" aria-label="Image alt text" /><input value={block.caption} onChange={(event) => update({ caption: event.target.value })} placeholder="Caption (optional)" aria-label="Image caption" />{uploadError && <p className="admin-field-error">{uploadError}</p>}{block.url && !parsedUrl(block.url) && <p className="admin-field-error">Use a valid HTTPS image URL.</p>}</div></div>;
}
