"use client";

import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import BrandCard from "@/components/ui/BrandCard";
import { useFetch } from "@/hooks/useFetch";
import { fetchBrands } from "@/lib/api";
import type { Brand } from "@/types";

export default function ShopByBrand() {
  const { data: brands, isLoading } = useFetch<Brand[]>(
    "/v1/brands",
    fetchBrands
  );

  const activebrands = (brands ?? []).filter((b) => b.is_active).slice(0, 10);

  return (
    <section className="max-w-[1280px] mx-auto px-4 py-8">
      <SectionHeader
        title="Shop By Brand"
        seeAllHref="/brands"
        seeAllLabel="See All Brands"
        subtitle="Top brands"
      />

      {isLoading ? (
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-[88px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
          {activebrands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      )}
    </section>
  );
}
