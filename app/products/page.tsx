import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { fetchProducts } from "@/lib/api";
import ProductCard from "@/components/ui/ProductCard";
import Pagination from "@/components/ui/Pagination";
import SortSelect from "@/components/ui/SortSelect";

export const metadata: Metadata = {
  title: "All Products — River Electronics",
  description: "Browse our full range of electronics and home appliances.",
};

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function str(val: string | string[] | undefined): string | undefined {
  if (!val) return undefined;
  return Array.isArray(val) ? val[0] : val;
}

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const sort = str(sp.sort);
  const page = parseInt(str(sp.page) ?? "1", 10);

  const result = await fetchProducts({ sort, page, per_page: 20 }).catch(() => null);

  const products = result?.data ?? [];
  const total = result?.total ?? 0;
  const lastPage = result?.last_page ?? 1;
  const currentPage = result?.current_page ?? 1;

  function buildHref(p: number) {
    const qs = new URLSearchParams();
    if (sort) qs.set("sort", sort);
    qs.set("page", String(p));
    return `/products?${qs.toString()}`;
  }

  return (
    <main className="max-w-[1280px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">All Products</span>
      </nav>

      <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">All Products</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{total > 0 ? `${total} products available` : "No products found"}</p>
        </div>
        <Suspense fallback={null}>
          <SortSelect basePath="/products" currentSort={sort} />
        </Suspense>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No products found</h3>
          <p className="text-gray-400 dark:text-gray-500 text-sm">Check back soon or browse by category.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {lastPage > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                buildHref={buildHref}
              />
            </div>
          )}
        </>
      )}
    </main>
  );
}
