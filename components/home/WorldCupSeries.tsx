"use client";

import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductCard from "@/components/ui/ProductCard";
import { PRODUCT_SORT_TABS } from "@/components/ui/TabFilter";
import { useFetch } from "@/hooks/useFetch";
import { fetchProducts } from "@/lib/api";
import type { PaginatedResponse, Product, ProductSortTab } from "@/types";

export default function WorldCupSeries() {
  const [activeTab, setActiveTab] = useState<ProductSortTab>("latest");

  const { data, isLoading } = useFetch<PaginatedResponse<Product>>(
    `/v1/products/world-cup?sort=${activeTab}&per_page=10`,
    () => fetchProducts({ sort: activeTab, per_page: 10 })
  );

  const products = data?.data ?? [];

  return (
    <section className="max-w-[1280px] mx-auto px-4 py-8">
      <SectionHeader
        title="World Cup Series"
        seeAllHref="/products"
        tabs={PRODUCT_SORT_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
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
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
