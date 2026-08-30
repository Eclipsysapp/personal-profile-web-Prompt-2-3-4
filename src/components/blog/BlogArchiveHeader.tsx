type BlogArchiveHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function BlogArchiveHeader({
  eyebrow,
  title,
  description,
}: BlogArchiveHeaderProps) {
  return (
    <section className="geeky-archive-hero">
      <div className="geeky-container">
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
    </section>
  );
}
