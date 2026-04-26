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
import { fetchBanners } from "@/lib/api";
import type { Banner } from "@/types";
import BannerCard from "@/components/ui/BannerCard";

export default function TopSaleProducts() {
  const [activeTab, setActiveTab] = useState<ProductSortTab>("latest");

  const { data: banners, isLoading: bannersLoading } = useFetch<Banner[]>(
    "/banners/sidebanner",
    () => fetchBanners("long")
  );

  const banner = banners?.[0];

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

  if (isLoading) {
    return (
      <section className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="w-full aspect-[16/5] bg-gray-200 animate-pulse rounded-xl" />
      </section>
    );
  }

  if (!banner) return null;

  return (
    <section className="max-w-[1280px] mx-auto px-4 py-8">
      <SectionHeader
        title="Top Sale Product"
        seeAllHref="/products/on-sale"
        tabs={PRODUCT_SORT_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
        {/* Left: Featured discount card */}
        <BannerCard banner={banner} aspect="aspect-[1/2]" className="h-full w-full" priority={false} />

        {/* Right: Product grid */}
        <div className="lg:col-span-3 bg-white rounded-lg flex flex-col">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 content-start flex-1">
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
