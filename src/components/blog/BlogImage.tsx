import Image from "next/image";

export function BlogImage({
  src,
  alt,
  priority = false,
}: {
  src: string | null;
  alt: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <div className="blog-image-placeholder" aria-hidden="true">
        <span>AB</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
      priority={priority}
      className="blog-cover-image"
    />
  );
}
