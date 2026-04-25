"use client";

import { useState } from "react";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductCard from "@/components/ui/ProductCard";
import { PRODUCT_SORT_TABS } from "@/components/ui/TabFilter";
import { useFetch } from "@/hooks/useFetch";
import { fetchOnSaleProducts, fetchFeaturedProducts } from "@/lib/api";
import { formatBDT } from "@/lib/utils";
import type { PaginatedResponse, Product, ProductSortTab } from "@/types";

export default function TopSaleProducts() {
  const [activeTab, setActiveTab] = useState<ProductSortTab>("latest");

  const { data: onSaleData } = useFetch<PaginatedResponse<Product>>(
    "/v1/products/on-sale",
    fetchOnSaleProducts
  );

  const { data: featuredData, isLoading } = useFetch<PaginatedResponse<Product>>(
    `/v1/products/featured?sort=${activeTab}`,
    fetchFeaturedProducts
  );

  const featuredProduct = onSaleData?.data?.[0];
  const products = (featuredData?.data ?? []).slice(0, 8);

  return (
    <section className="max-w-[1280px] mx-auto px-4 py-10">
      <SectionHeader
        title="Top Sale Product"
        seeAllHref="/products/on-sale"
        tabs={PRODUCT_SORT_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left: Featured discount card */}
        <div className="bg-river-blue rounded-xl p-6 flex flex-col justify-between min-h-[280px]">
          <div>
            <p className="text-blue-200 text-xs font-semibold mb-1 uppercase tracking-wide">
              Customer Favorites
            </p>
            <div className="text-white font-extrabold text-4xl mb-1">40%</div>
            <div className="text-white font-bold text-lg mb-2">Discount</div>
            <p className="text-blue-200 text-sm">For all refrigerators</p>
          </div>

          {featuredProduct && (
            <div className="mt-4">
              <p className="text-white font-semibold text-sm line-clamp-2 mb-1">
                {featuredProduct.name}
              </p>
              <p className="text-yellow-300 font-bold">
                {formatBDT(featuredProduct.sale_price ?? featuredProduct.price)}
              </p>
            </div>
          )}

          <Link
            href="/products/on-sale"
            className="mt-4 inline-flex items-center gap-1 bg-white text-blue-700 text-sm font-semibold px-4 py-2 rounded-md hover:bg-river-blue/10 transition-colors w-fit"
          >
            Shop Now
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Right: Product grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="aspect-square bg-gray-200 animate-pulse" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
