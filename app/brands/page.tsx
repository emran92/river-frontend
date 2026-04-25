"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchBrands } from "@/lib/api";
import { useFetch } from "@/hooks/useFetch";
import { mediaUrl } from "@/lib/utils";
import type { Brand } from "@/types";

type SortKey = "default" | "name_asc" | "name_desc" | "products_desc";

function BrandGridCard({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="group flex flex-col items-center bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-100 transition-all duration-200"
    >
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#F7F7F7] flex items-center justify-center mb-3">
        {brand.logo_url ? (
          <Image
            src={mediaUrl(brand.logo_url)}
            alt={brand.name}
            fill
            className="object-contain p-5 group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          />
        ) : (
          <span className="text-base font-bold text-[#00A89B] group-hover:text-[#007a72] transition-colors text-center leading-tight px-4">
            {brand.name}
          </span>
        )}
      </div>
      <p className="text-sm font-semibold text-gray-900 text-center leading-tight mb-1">
        {brand.name}
      </p>
      {brand.country_of_origin && (
        <p className="text-xs text-gray-400">{brand.country_of_origin}</p>
      )}
      {brand.products_count !== undefined && (
        <p className="text-xs text-blue-500 font-medium mt-0.5">
          {brand.products_count} products
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

export default function BrandsPage() {
  const { data: brands, isLoading, error } = useFetch<Brand[]>("brands", fetchBrands);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("default");
  const [country, setCountry] = useState<string>("all");

  const countries = useMemo(() => {
    if (!brands) return [];
    const set = new Set(
      brands.map((b) => b.country_of_origin).filter((c): c is string => !!c),
    );
    return Array.from(set).sort();
  }, [brands]);

  const filtered = useMemo(() => {
    if (!brands) return [];
    let list = [...brands];

    // Country filter
    if (country !== "all") list = list.filter((b) => b.country_of_origin === country);

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          (b.country_of_origin?.toLowerCase().includes(q) ?? false),
      );
    }

    // Sort
    if (sort === "name_asc") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "name_desc") list.sort((a, b) => b.name.localeCompare(a.name));
    else if (sort === "products_desc") {
      list.sort((a, b) => (b.products_count ?? 0) - (a.products_count ?? 0));
    } else {
      list.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    }

    return list;
  }, [brands, search, sort, country]);

  const hasProducts = brands?.some((b) => b.products_count !== undefined);

  return (
    <main className="max-w-[1280px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Brands</span>
      </nav>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">All Brands</h1>
        <p className="text-gray-500 text-sm">
          Explore products from our trusted brand partners
        </p>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap">
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
            placeholder="Search brands..."
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

        {/* Country filter */}
        {countries.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 whitespace-nowrap">Country:</span>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-400"
            >
              <option value="all">All countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sort */}
        <div className="flex items-center gap-2 sm:ml-auto">
          <span className="text-sm text-gray-500 whitespace-nowrap">Sort:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-400"
          >
            <option value="default">Default Order</option>
            <option value="name_asc">Name A → Z</option>
            <option value="name_desc">Name Z → A</option>
            {hasProducts && (
              <option value="products_desc">Most Products</option>
            )}
          </select>
        </div>

        {/* Active filters clear */}
        {(search || country !== "all" || sort !== "default") && (
          <button
            onClick={() => {
              setSearch("");
              setCountry("all");
              setSort("default");
            }}
            className="text-sm text-red-500 hover:text-red-700 whitespace-nowrap"
          >
            × Clear filters
          </button>
        )}
      </div>

      {/* Results count */}
      {!isLoading && (
        <p className="text-sm text-gray-400 mb-4">
          {filtered.length} brand{filtered.length === 1 ? "" : "s"} found
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-20 text-red-500">
          Failed to load brands. Please try again.
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map((brand) => <BrandGridCard key={brand.id} brand={brand} />)}
      </div>

      {/* Empty state */}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No brands found</h3>
          <p className="text-gray-400 text-sm mb-4">Try adjusting your filters</p>
          <button
            onClick={() => {
              setSearch("");
              setCountry("all");
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
