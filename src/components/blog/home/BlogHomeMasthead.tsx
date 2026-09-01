import Link from "next/link";
import type { BlogCategory } from "@/types/blog";

type Props = {
  intro: string;
  categories: BlogCategory[];
  totalArticles: number;
};

export function BlogHomeMasthead({ intro, categories, totalArticles }: Props) {
  return (
    <header className="bhome-masthead-wrap">
      <div className="bhome-masthead">
        <div className="bhome-masthead-intro">
          <p className="bh-kicker">The Journal</p>
          <h1>
            Writing on technology, <span>building</span> &amp; ideas
          </h1>
          <p>{intro}</p>
        </div>

        <div className="bhome-masthead-aside">
          {totalArticles > 0 ? (
            <span className="bhome-count">
              <b>{totalArticles}</b> article{totalArticles === 1 ? "" : "s"} published
            </span>
          ) : null}
          <Link className="bh-btn bh-btn-primary" href="/blog/write">
            Start writing
          </Link>
        </div>
      </div>

      {categories.length ? (
        <nav className="bhome-chips" aria-label="Browse categories">
          <span className="bhome-chip is-active">All articles</span>
          {categories.map((category) => (
            <Link
              key={category.slug}
              className="bhome-chip"
              href={`/blog/category/${category.slug}`}
            >
              {category.name}
              <b>{category.article_count}</b>
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
