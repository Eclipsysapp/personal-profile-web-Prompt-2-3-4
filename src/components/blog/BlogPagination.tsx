import Link from "next/link";

type BlogPaginationProps = {
  currentPage: number;
  lastPage: number;
  basePath: string;
  query?: Record<string, string | undefined>;
};

function hrefFor(
  basePath: string,
  page: number,
  query?: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  if (page > 1) params.set("page", String(page));

  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function BlogPagination({
  currentPage,
  lastPage,
  basePath,
  query,
}: BlogPaginationProps) {
  if (lastPage <= 1) return null;

  const pages = Array.from(
    { length: lastPage },
    (_, index) => index + 1,
  ).filter(
    (page) =>
      page === 1 ||
      page === lastPage ||
      Math.abs(page - currentPage) <= 2,
  );

  return (
    <nav
      className="geeky-pagination"
      aria-label="Blog pagination"
    >
      {currentPage > 1 ? (
        <Link
          href={hrefFor(basePath, currentPage - 1, query)}
        >
          ← Previous
        </Link>
      ) : null}

      <div>
        {pages.map((page, index) => {
          const previous = pages[index - 1];
          const gap =
            previous !== undefined && page - previous > 1;

          return (
            <span key={page}>
              {gap ? <i>…</i> : null}
              <Link
                href={hrefFor(basePath, page, query)}
                className={
                  page === currentPage ? "active" : ""
                }
              >
                {page}
              </Link>
            </span>
          );
        })}
      </div>

      {currentPage < lastPage ? (
        <Link
          href={hrefFor(basePath, currentPage + 1, query)}
        >
          Next →
        </Link>
      ) : null}
    </nav>
  );
}
