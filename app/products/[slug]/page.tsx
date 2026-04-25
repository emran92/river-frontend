import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { fetchProduct, fetchProducts } from "@/lib/api";
import { formatBDT, discountPercent, mediaUrl } from "@/lib/utils";
import ImageViewer from "@/components/ui/ImageViewer";
import ProductCard from "@/components/ui/ProductCard";
import AddToCartSection from "./AddToCartSection";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await fetchProduct(slug);
    return {
      title: product.meta_title ?? `${product.name} — River Electronics`,
      description: product.meta_description ?? product.short_description ?? undefined,
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  let product;
  try {
    product = await fetchProduct(slug);
  } catch {
    notFound();
  }

  const hasDiscount = !!product.sale_price;
  const discount = hasDiscount
    ? discountPercent(product.price, product.sale_price!)
    : 0;
  const displayPrice = product.sale_price ?? product.price;

  // Build image list — thumbnail first, then the rest of the gallery
  const thumbnailEntry = product.thumbnail_url
    ? {
        original: mediaUrl(product.thumbnail_url),
        thumb: mediaUrl(product.thumbnail_url),
        large: mediaUrl(product.thumbnail_url),
      }
    : null;

  const galleryEntries = (product.gallery_urls ?? []).map((g) => ({
    original: mediaUrl(g.original),
    thumb: mediaUrl(g.thumb),
    large: mediaUrl(g.large),
  }));

  const images =
    thumbnailEntry
      ? [thumbnailEntry, ...galleryEntries.filter((g) => g.original !== thumbnailEntry.original)]
      : galleryEntries.length > 0
      ? galleryEntries
      : [{ original: "/placeholder/product.jpg", thumb: "/placeholder/product.jpg", large: "/placeholder/product.jpg" }];

  // Related products (same category)
  let related: typeof product[] = [];
  try {
    const res = await fetchProducts({
      category: product.category?.slug,
      per_page: 5,
    });
    related = res.data.filter((p) => p.id !== product.id).slice(0, 4);
  } catch {
    related = [];
  }

  const inStock = product.stock_quantity > 0;

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link
              href={`/categories/${product.category.slug}`}
              className="hover:text-blue-600 transition-colors"
            >
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-600 line-clamp-1">{product.name}</span>
      </nav>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Left: Image viewer */}
        <div className="lg:sticky lg:top-8 self-start">
          <ImageViewer images={images} productName={product.name} />
        </div>

        {/* Right: Product info */}
        <div className="flex flex-col gap-5">
          {/* Brand + badges */}
          <div className="flex items-center gap-3 flex-wrap">
            {product.brand && (
              <Link
                href={`/brands/${product.brand.slug}`}
                className="text-xs font-semibold text-blue-600 bg-river-blue/10 px-3 py-1 rounded-full hover:bg-river-blue/20 transition-colors"
              >
                {product.brand.name}
              </Link>
            )}
            {product.is_featured && (
              <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                Featured
              </span>
            )}
            {!inStock && (
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Name */}
          <h1 className="text-2xl font-bold text-gray-900 leading-snug">
            {product.name}
          </h1>

          {/* Rating row */}
          {typeof product.average_rating === "number" && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    className={`w-4 h-4 ${s <= Math.round(product.average_rating!) ? "text-yellow-400" : "text-gray-200"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.average_rating.toFixed(1)} ({product.reviews_count ?? 0} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-3xl font-bold text-gray-900">
              {formatBDT(displayPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {formatBDT(product.price)}
                </span>
                <span className="bg-red-500 text-white text-sm font-bold px-2.5 py-1 rounded-lg">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Short description */}
          {product.short_description && (
            <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
              {product.short_description}
            </p>
          )}

          {/* Meta info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {product.model_number && (
              <div className="bg-[#F4F4F4] rounded-xl px-4 py-3">
                <p className="text-xs text-gray-400 mb-0.5">Model</p>
                <p className="font-semibold text-gray-800">{product.model_number}</p>
              </div>
            )}
            {product.sku && (
              <div className="bg-[#F4F4F4] rounded-xl px-4 py-3">
                <p className="text-xs text-gray-400 mb-0.5">SKU</p>
                <p className="font-semibold text-gray-800">{product.sku}</p>
              </div>
            )}
            {product.warranty_months > 0 && (
              <div className="bg-[#F4F4F4] rounded-xl px-4 py-3">
                <p className="text-xs text-gray-400 mb-0.5">Warranty</p>
                <p className="font-semibold text-gray-800">
                  {product.warranty_months >= 12
                    ? `${product.warranty_months / 12} Year${product.warranty_months > 12 ? "s" : ""}`
                    : `${product.warranty_months} Month${product.warranty_months > 1 ? "s" : ""}`}
                </p>
              </div>
            )}
            <div className="bg-[#F4F4F4] rounded-xl px-4 py-3">
              <p className="text-xs text-gray-400 mb-0.5">Availability</p>
              <p className={`font-semibold ${inStock ? "text-green-600" : "text-red-500"}`}>
                {inStock ? `In Stock (${product.stock_quantity})` : "Out of Stock"}
              </p>
            </div>
          </div>

          {/* Add to cart section (client) */}
          <AddToCartSection product={product} inStock={inStock} />

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-5 text-center">
            {[
              { icon: "M3 10h18M3 6h18M3 14h18M3 18h12", label: "Free Delivery" },
              { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", label: "14-Day Returns" },
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "Genuine Product" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-full bg-river-blue/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={icon} />
                  </svg>
                </div>
                <span className="text-xs text-gray-500 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: Description / Specification / Reviews */}
      <ProductTabs product={product} />

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Inline Tabs component (server-safe, progressive) ────────────────────────
import ProductTabs from "./ProductTabs";
