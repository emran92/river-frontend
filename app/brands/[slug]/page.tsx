import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { fetchBrand, fetchProducts } from "@/lib/api";
import { mediaUrl } from "@/lib/utils";
import ProductCard from "@/components/ui/ProductCard";
import Pagination from "@/components/ui/Pagination";
import ProductFiltersClient from "@/components/ui/ProductFiltersClient";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const brand = await fetchBrand(slug);
    return {
      title: `${brand.name} Products — River Electronics`,
      description:
        brand.description ?? `Shop all ${brand.name} products at River Electronics`,
    };
  } catch {
    return { title: "Brand Not Found" };
  }
}

function str(val: string | string[] | undefined): string | undefined {
  if (!val) return undefined;
  return Array.isArray(val) ? val[0] : val;
}

export default async function BrandProductsPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const sort = str(sp.sort);
  const page = parseInt(str(sp.page) ?? "1", 10);
  const minPrice = sp.min_price ? parseInt(str(sp.min_price)!, 10) : undefined;
  const maxPrice = sp.max_price ? parseInt(str(sp.max_price)!, 10) : undefined;

  // Collect attribute filter params (attr_<slug>=<value_id>)
  const currentAttributes: Record<string, string> = {};
  Object.entries(sp).forEach(([key, val]) => {
    if (key.startsWith("attr_")) {
      const v = str(val);
      if (v) currentAttributes[key.slice(5)] = v;
    }
  });

  const [brand, productsResult] = await Promise.all([
    fetchBrand(slug).catch(() => null),
    fetchProducts({
      brand: slug,
      sort,
      page,
      per_page: 20,
      min_price: minPrice,
      max_price: maxPrice,
    }).catch(() => null),
  ]);

  if (!brand) notFound();

  const products = productsResult?.data ?? [];
  const lastPage = productsResult?.last_page ?? 1;
  const total = productsResult?.total ?? 0;
  const currentPage = productsResult?.current_page ?? 1;

  function buildHref(p: number) {
    const qs = new URLSearchParams();
    if (sort) qs.set("sort", sort);
    if (minPrice) qs.set("min_price", String(minPrice));
    if (maxPrice) qs.set("max_price", String(maxPrice));
    Object.entries(currentAttributes).forEach(([k, v]) => qs.set(`attr_${k}`, v));
    qs.set("page", String(p));
    return `/brands/${slug}?${qs.toString()}`;
  }

  return (
    <main className="max-w-[1280px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex gap-2 text-sm text-gray-400 mb-6 flex-wrap">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/brands" className="hover:text-blue-600 transition-colors">
          Brands
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{brand.name}</span>
      </nav>

      {/* Brand header */}
      <div className="flex items-center gap-6 mb-8 bg-white border border-gray-100 rounded-2xl p-6">
        {brand.logo_url && (
          <div className="relative w-24 h-24 rounded-xl bg-[#F7F7F7] flex-shrink-0 overflow-hidden border border-gray-100">
            <Image
              src={mediaUrl(brand.logo_url)}
              alt={brand.name}
              fill
              className="object-contain p-3"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">{brand.name}</h1>
            {brand.country_of_origin && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                {brand.country_of_origin}
              </span>
            )}
          </div>
          {brand.description && (
            <p className="text-gray-500 text-sm mt-1 leading-relaxed line-clamp-2">
              {brand.description}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-2">{total} products available</p>
        </div>
      </div>

      {/* Products section */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Filters sidebar */}
        <ProductFiltersClient
          basePath={`/brands/${slug}`}
          currentSort={sort}
          currentMinPrice={minPrice}
          currentMaxPrice={maxPrice}
          currentAttributes={currentAttributes}
          filters={brand.filters}
        />

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {/* Active filter pills */}
          {(sort || minPrice || maxPrice || Object.keys(currentAttributes).length > 0) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {sort && (
                <span className="flex items-center gap-1 text-xs bg-river-blue/10 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full">
                  Sort: {sort.replace("_", " ")}
                  <Link
                    href={buildHref(1).replace(`sort=${sort}&`, "").replace(`sort=${sort}`, "")}
                    className="ml-0.5 hover:text-red-600"
                  >
                    ×
                  </Link>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="text-xs bg-river-blue/10 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full">
                  Price: {minPrice ? `Tk ${minPrice.toLocaleString()}` : "0"} –{" "}
                  {maxPrice ? `Tk ${maxPrice.toLocaleString()}` : "∞"}
                </span>
              )}
              {Object.entries(currentAttributes).map(([attrSlug, valueId]) => {
                const attr = brand.filters?.attributes?.find((a) => a.slug === attrSlug);
                const val = attr?.values.find((v) => String(v.id) === valueId);
                return (
                  <span key={attrSlug} className="flex items-center gap-1 text-xs bg-river-blue/10 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full">
                    {attr?.name ?? attrSlug}: {val?.label ?? valueId}
                    <Link
                      href={buildHref(1).replace(`attr_${attrSlug}=${valueId}&`, "").replace(`attr_${attrSlug}=${valueId}`, "")}
                      className="ml-0.5 hover:text-red-600"
                    >
                      ×
                    </Link>
                  </span>
                );
              })}
            </div>
          )}

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-400 text-sm mb-4">
                Try changing or removing some filters
              </p>
              <Link
                href={`/brands/${slug}`}
                className="px-4 py-2 bg-river-blue text-white rounded-xl text-sm hover:bg-river-blue transition-colors"
              >
                Clear filters
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-400">
                  Showing {products.length} of {total} products
                </p>
              </div>
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
