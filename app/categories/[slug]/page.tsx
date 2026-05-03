import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { fetchCatalog } from "@/lib/api";
import { mediaUrl } from "@/lib/utils";
import ProductCard from "@/components/ui/ProductCard";
import Pagination from "@/components/ui/Pagination";
import ProductFiltersClient from "@/components/ui/ProductFiltersClient";
import SortSelect from "@/components/ui/SortSelect";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const catalog = await fetchCatalog(slug);
    if (catalog.type !== "category") {
      return { title: "Category Not Found" };
    }
    const category = catalog.resource;
    return {
      title: `${category.name} — River Electronics`,
      description: category.description ?? `Shop ${category.name} products at River Electronics`,
    };
  } catch {
    return { title: "Category Not Found" };
  }
}

function str(val: string | string[] | undefined): string | undefined {
  if (!val) return undefined;
  return Array.isArray(val) ? val[0] : val;
}

const RESERVED_PARAMS = new Set([
  "sort", "page", "per_page", "brand", "category",
  "min_price", "max_price", "on_sale", "in_stock",
]);

export default async function CategoryProductsPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const sort = str(sp.sort);
  const page = parseInt(str(sp.page) ?? "1", 10);
  const minPrice = sp.min_price ? parseInt(str(sp.min_price)!, 10) : undefined;
  const maxPrice = sp.max_price ? parseInt(str(sp.max_price)!, 10) : undefined;
  const brandParam = str(sp.brand);

  // Collect dynamic attribute filters (all non-reserved params)
  const attributeFilters: Record<string, string> = {};
  Object.entries(sp).forEach(([key, val]) => {
    if (!RESERVED_PARAMS.has(key)) {
      const v = str(val);
      if (v) attributeFilters[key] = v;
    }
  });

  const catalog = await fetchCatalog(slug, {
    brand: brandParam,
    sort,
    page,
    per_page: 20,
    min_price: minPrice,
    max_price: maxPrice,
    attributes: attributeFilters,
  }).catch(() => null);

  if (!catalog || catalog.type !== "category") notFound();

  const category = catalog.resource;

  const products = catalog.products.data ?? [];
  const lastPage = catalog.products.last_page ?? 1;
  const total = catalog.products.total ?? 0;
  const currentPage = catalog.products.current_page ?? 1;

  const currentBrands = brandParam ? brandParam.split(",").filter(Boolean) : [];
  const currentAttributes: Record<string, string[]> = {};
  Object.entries(attributeFilters).forEach(([k, v]) => {
    currentAttributes[k] = v.split(",").filter(Boolean);
  });

  function buildHref(p: number) {
    const qs = new URLSearchParams();
    if (sort) qs.set("sort", sort);
    if (brandParam) qs.set("brand", brandParam);
    if (minPrice) qs.set("min_price", String(minPrice));
    if (maxPrice) qs.set("max_price", String(maxPrice));
    Object.entries(attributeFilters).forEach(([k, v]) => qs.set(k, v));
    qs.set("page", String(p));
    return `/categories/${slug}?${qs.toString()}`;
  }

  function buildFilterHref(overrides: Record<string, string | null | undefined>) {
    const qs = new URLSearchParams();
    const base: Record<string, string | undefined> = {
      sort,
      brand: brandParam,
      min_price: minPrice?.toString(),
      max_price: maxPrice?.toString(),
      ...attributeFilters,
    };
    const merged = { ...base, ...overrides };
    Object.entries(merged).forEach(([k, v]) => { if (v) qs.set(k, v); });
    const s = qs.toString();
    return s ? `/categories/${slug}?${s}` : `/categories/${slug}`;
  }

  const hasActiveFilters =
    currentBrands.length > 0 ||
    !!minPrice ||
    !!maxPrice ||
    Object.values(currentAttributes).some((v) => v.length > 0);

  return (
    <main className="max-w-[1280px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex gap-2 text-sm text-gray-400 mb-6 flex-wrap">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-blue-600 transition-colors">
          Categories
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{category.name}</span>
      </nav>

      {/* Category header */}
      <div className="flex items-start gap-5 mb-8 bg-white border border-gray-100 rounded-2xl p-5">
        {category.image_url && (
          <div className="relative w-20 h-20 rounded-xl bg-[#F7F7F7] flex-shrink-0 overflow-hidden">
            <Image
              src={mediaUrl(category.image_url)}
              alt={category.name}
              fill
              className="object-contain p-2"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
          {category.description && (
            <p className="text-gray-500 text-sm mt-1 leading-relaxed">{category.description}</p>
          )}
          <p className="text-xs text-gray-400 mt-2">{total} products</p>
        </div>
      </div>

      {/* Products section */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Filters sidebar */}
        <ProductFiltersClient
          basePath={`/categories/${slug}`}
          pageType="category"
          currentBrands={currentBrands}
          currentMinPrice={minPrice}
          currentMaxPrice={maxPrice}
          currentAttributes={currentAttributes}
          filters={catalog.filters}
        />

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {/* Active filter pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {currentBrands.map((brandSlug) => {
                const brandLabel =
                  catalog.filters?.brands?.find((b) => b.slug === brandSlug)?.name ?? brandSlug;
                return (
                  <span
                    key={brandSlug}
                    className="flex items-center gap-1 text-xs bg-river-blue/10 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full"
                  >
                    {brandLabel}
                    <Link
                      href={buildFilterHref({
                        brand: currentBrands.filter((s) => s !== brandSlug).join(",") || null,
                      })}
                      className="ml-0.5 hover:text-red-600"
                    >
                      ×
                    </Link>
                  </span>
                );
              })}
              {(minPrice || maxPrice) && (
                <span className="text-xs bg-river-blue/10 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full">
                  Price: {minPrice ? `Tk ${minPrice.toLocaleString()}` : "0"} –{" "}
                  {maxPrice ? `Tk ${maxPrice.toLocaleString()}` : "∞"}
                </span>
              )}
              {Object.entries(currentAttributes).flatMap(([attrSlug, values]) =>
                values.map((v) => {
                  const attr = catalog.filters?.attributes?.find((a) => a.slug === attrSlug);
                  const label = attr?.values.find((av) => av.value === v)?.label ?? v;
                  return (
                    <span
                      key={`${attrSlug}:${v}`}
                      className="flex items-center gap-1 text-xs bg-river-blue/10 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full"
                    >
                      {attr?.name ?? attrSlug}: {label}
                      <Link
                        href={buildFilterHref({
                          [attrSlug]:
                            currentAttributes[attrSlug].filter((x) => x !== v).join(",") || null,
                        })}
                        className="ml-0.5 hover:text-red-600"
                      >
                        ×
                      </Link>
                    </span>
                  );
                }),
              )}
            </div>
          )}

          {/* Results header with sort on the right */}
          <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
            <p className="text-sm text-gray-400">
              {total > 0
                ? `Showing ${products.length} of ${total} products`
                : "No products found"}
            </p>
            <Suspense fallback={null}>
              <SortSelect basePath={`/categories/${slug}`} currentSort={sort} />
            </Suspense>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-400 text-sm mb-4">
                Try changing or removing some filters
              </p>
              <Link
                href={`/categories/${slug}`}
                className="px-4 py-2 bg-river-blue text-white rounded-xl text-sm hover:bg-river-blue transition-colors"
              >
                Clear filters
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination currentPage={currentPage} lastPage={lastPage} buildHref={buildHref} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
