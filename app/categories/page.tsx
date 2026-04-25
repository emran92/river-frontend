"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchCategories } from "@/lib/api";
import { useFetch } from "@/hooks/useFetch";
import { mediaUrl } from "@/lib/utils";
import type { Category } from "@/types";

type SortKey = "default" | "name_asc" | "name_desc";
type TypeFilter = "all" | "top" | "sub";

function CategoryGridCard({ category }: { category: Category }) {
  const childCount = category.children?.length ?? 0;
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex flex-col items-center bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-100 transition-all duration-200"
    >
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#F7F7F7] mb-3">
        {category.image_url ? (
          <Image
            src={mediaUrl(category.image_url)}
            alt={category.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
            📦
          </div>
        )}
        {category.parent_id === null && (
          <span className="absolute top-2 left-2 bg-river-blue text-white text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide">
            Main
          </span>
        )}
      </div>
      <p className="text-sm font-semibold text-gray-900 text-center leading-tight line-clamp-2 mb-1">
        {category.name}
      </p>
      {childCount > 0 && (
        <p className="text-xs text-blue-500 font-medium">{childCount} sub-categories</p>
      )}
      {category.description && (
        <p className="text-xs text-gray-400 text-center line-clamp-2 mt-1">
          {category.description}
        </p>
      )}
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col items-center bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
      <div className="w-full aspect-square rounded-xl bg-gray-100 mb-3" />
      <div className="h-4 bg-gray-100 rounded w-3/4 mb-1" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
    </div>
  );
}

export default function CategoriesPage() {
  const { data: categories, isLoading, error } = useFetch<Category[]>(
    "categories",
    fetchCategories,
  );

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("default");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const filtered = useMemo(() => {
    if (!categories) return [];
    let list = [...categories];

    // Type filter
    if (typeFilter === "top") list = list.filter((c) => c.parent_id === null);
    else if (typeFilter === "sub") list = list.filter((c) => c.parent_id !== null);

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.description?.toLowerCase().includes(q) ?? false),
      );
    }

    // Sort
    if (sort === "name_asc") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "name_desc") list.sort((a, b) => b.name.localeCompare(a.name));
    else list.sort((a, b) => a.sort_order - b.sort_order);

    return list;
  }, [categories, search, sort, typeFilter]);

  const topCount = categories?.filter((c) => c.parent_id === null).length ?? 0;
  const subCount = categories?.filter((c) => c.parent_id !== null).length ?? 0;

  return (
    <main className="max-w-[1280px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Categories</span>
      </nav>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">All Categories</h1>
        <p className="text-gray-500 text-sm">
          Browse our full range of product categories
        </p>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-xs">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-[#F9F9F9]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              ×
            </button>
          )}
        </div>

        {/* Type tabs */}
        <div className="flex gap-1 bg-[#F4F4F4] p-1 rounded-xl">
          {(
            [
              { key: "all", label: `All (${(categories?.length ?? 0)})` },
              { key: "top", label: `Top-level (${topCount})` },
              { key: "sub", label: `Sub-categories (${subCount})` },
            ] as { key: TypeFilter; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTypeFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === key
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-500 whitespace-nowrap">Sort:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-400"
          >
            <option value="default">Default Order</option>
            <option value="name_asc">Name A → Z</option>
            <option value="name_desc">Name Z → A</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      {!isLoading && (
        <p className="text-sm text-gray-400 mb-4">
          {filtered.length} categor{filtered.length === 1 ? "y" : "ies"} found
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-20 text-red-500">
          Failed to load categories. Please try again.
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.length === 0
            ? null
            : filtered.map((cat) => <CategoryGridCard key={cat.id} category={cat} />)}
      </div>

      {/* Empty state */}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No categories found</h3>
          <p className="text-gray-400 text-sm mb-4">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={() => {
              setSearch("");
              setTypeFilter("all");
              setSort("default");
            }}
            className="px-4 py-2 bg-river-blue text-white rounded-xl text-sm hover:bg-river-blue transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </main>
  );
}
