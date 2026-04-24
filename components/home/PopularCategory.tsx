"use client";

import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import CategoryCard from "@/components/ui/CategoryCard";
import { useFetch } from "@/hooks/useFetch";
import { fetchCategories } from "@/lib/api";
import type { Category } from "@/types";

export default function PopularCategory() {
  const { data: categories, isLoading } = useFetch<Category[]>(
    "/v1/categories",
    fetchCategories
  );

  const activeCategories = (categories ?? [])
    .filter((c) => c.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .slice(0, 8);

  return (
    <section className="max-w-[1280px] mx-auto px-4 py-6">
      <SectionHeader
        title="Popular Category"
        seeAllHref="/categories"
        seeAllLabel="All Categories"
      />

      {isLoading ? (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200 animate-pulse" />
              <div className="w-14 h-3 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
          {activeCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </section>
  );
}
