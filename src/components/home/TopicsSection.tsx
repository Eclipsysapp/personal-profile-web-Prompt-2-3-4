import Link from "next/link";
import type { BlogCategory } from "@/types/blog";

export function TopicsSection({
  categories,
}: {
  categories: BlogCategory[];
}) {
  const topics = categories.filter((category) => category.article_count > 0);

  if (topics.length === 0) return null;

  return (
    <section className="home-topics">
      <div className="home-container">
        <div className="home-section-head">
          <div>
            <span className="home-kicker">Writing topics</span>
            <h2>The subjects I keep coming back to.</h2>
          </div>
          <Link href="/blog#categories" className="home-section-link">
            Browse categories
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="home-topics-list">
          {topics.map((category) => (
            <Link
              key={category.slug}
              href={`/blog/category/${category.slug}`}
              className="home-topic"
            >
              {category.name}
              <b>{String(category.article_count).padStart(2, "0")}</b>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
