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
    <section className="max-w-[1280px] mx-auto px-4 py-6">
      <SectionHeader
        title="Shop By Brand"
        seeAllHref="/brands"
        seeAllLabel="See All Brands"
      />

      {isLoading ? (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {activebrands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      )}
    </section>
  );
}
