import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { fetchCategory, fetchProducts, fetchBrands } from "@/lib/api";
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
    const category = await fetchCategory(slug);
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

export default async function CategoryProductsPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const sort = str(sp.sort);
  const brand = str(sp.brand);
  const page = parseInt(str(sp.page) ?? "1", 10);
  const minPrice = sp.min_price ? parseInt(str(sp.min_price)!, 10) : undefined;
  const maxPrice = sp.max_price ? parseInt(str(sp.max_price)!, 10) : undefined;

  const [category, productsResult, brands] = await Promise.all([
    fetchCategory(slug).catch(() => null),
    fetchProducts({
      category: slug,
      sort,
      brand,
      page,
      per_page: 20,
      min_price: minPrice,
      max_price: maxPrice,
    }).catch(() => null),
    fetchBrands().catch(() => []),
  ]);

  if (!category) notFound();

  const products = productsResult?.data ?? [];
  const lastPage = productsResult?.last_page ?? 1;
  const total = productsResult?.total ?? 0;
  const currentPage = productsResult?.current_page ?? 1;

  function buildHref(p: number) {
    const qs = new URLSearchParams();
    if (sort) qs.set("sort", sort);
    if (brand) qs.set("brand", brand);
    if (minPrice) qs.set("min_price", String(minPrice));
    if (maxPrice) qs.set("max_price", String(maxPrice));
    qs.set("page", String(p));
    return `/categories/${slug}?${qs.toString()}`;
  }

  const subcategories = category.children?.filter((c) => c.is_active) ?? [];

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

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">
            Sub-categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/categories/${sub.slug}`}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                {sub.image_url && (
                  <div className="relative w-5 h-5 flex-shrink-0">
                    <Image
                      src={mediaUrl(sub.image_url)}
                      alt={sub.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products section */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Filters sidebar */}
        <ProductFiltersClient
          basePath={`/categories/${slug}`}
          currentSort={sort}
          currentBrand={brand}
          currentMinPrice={minPrice}
          currentMaxPrice={maxPrice}
          brands={brands}
        />

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {/* Active filter pills */}
          {(sort || brand || minPrice || maxPrice) && (
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
              {brand && (
                <span className="flex items-center gap-1 text-xs bg-river-blue/10 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full">
                  Brand: {brands.find((b) => b.slug === brand)?.name ?? brand}
                  <Link
                    href={buildHref(1).replace(`brand=${brand}&`, "").replace(`brand=${brand}`, "")}
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
                href={`/categories/${slug}`}
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
