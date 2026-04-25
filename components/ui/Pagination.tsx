import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  buildHref: (page: number) => string;
}

export default function Pagination({ currentPage, lastPage, buildHref }: PaginationProps) {
  if (lastPage <= 1) return null;

  const pages: (number | "ellipsis")[] = [];

  if (lastPage <= 7) {
    for (let i = 1; i <= lastPage; i++) pages.push(i);
  } else if (currentPage <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i);
    pages.push("ellipsis");
    pages.push(lastPage);
  } else if (currentPage >= lastPage - 3) {
    pages.push(1);
    pages.push("ellipsis");
    for (let i = lastPage - 4; i <= lastPage; i++) pages.push(i);
  } else {
    pages.push(1);
    pages.push("ellipsis");
    for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
    pages.push("ellipsis");
    pages.push(lastPage);
  }

  return (
    <div className="flex items-center justify-center gap-1 flex-wrap mt-8">
      <Link
        href={buildHref(currentPage - 1)}
        className={`px-3 py-2 rounded-lg text-sm border border-gray-200 transition-colors ${
          currentPage === 1
            ? "pointer-events-none opacity-40 bg-[#F4F4F4]"
            : "bg-white hover:bg-river-blue/10 text-gray-700"
        }`}
        aria-disabled={currentPage === 1}
      >
        ← Prev
      </Link>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e${i}`} className="px-2 py-2 text-gray-400 text-sm select-none">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm border transition-colors ${
              p === currentPage
                ? "bg-river-blue text-white border-blue-600 font-semibold"
                : "bg-white border-gray-200 text-gray-700 hover:bg-river-blue/10"
            }`}
          >
            {p}
          </Link>
        ),
      )}

      <Link
        href={buildHref(currentPage + 1)}
        className={`px-3 py-2 rounded-lg text-sm border border-gray-200 transition-colors ${
          currentPage === lastPage
            ? "pointer-events-none opacity-40 bg-[#F4F4F4]"
            : "bg-white hover:bg-river-blue/10 text-gray-700"
        }`}
        aria-disabled={currentPage === lastPage}
      >
        Next →
      </Link>
    </div>
  );
}
