"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Brand, Category } from "@/types";

interface ProductFiltersClientProps {
  basePath: string;
  currentSort?: string;
  currentBrand?: string;
  currentCategory?: string;
  currentMinPrice?: number;
  currentMaxPrice?: number;
  brands?: Brand[];
  categories?: Category[];
}

const SORT_OPTIONS = [
  { label: "Latest", value: "latest" },
  { label: "Best Selling", value: "best_selling" },
  { label: "Top Rated", value: "top_rating" },
];

export default function ProductFiltersClient({
  basePath,
  currentSort,
  currentBrand,
  currentCategory,
  currentMinPrice,
  currentMaxPrice,
  brands = [],
  categories = [],
}: ProductFiltersClientProps) {
  const router = useRouter();
  const [minPrice, setMinPrice] = useState(currentMinPrice?.toString() ?? "");
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice?.toString() ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);

  const buildUrl = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const params = new URLSearchParams();
      const merged: Record<string, string | undefined> = {
        sort: currentSort,
        brand: currentBrand,
        category: currentCategory,
        min_price: currentMinPrice?.toString(),
        max_price: currentMaxPrice?.toString(),
        ...overrides,
      };
      Object.entries(merged).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      const qs = params.toString();
      return qs ? `${basePath}?${qs}` : basePath;
    },
    [basePath, currentSort, currentBrand, currentCategory, currentMinPrice, currentMaxPrice],
  );

  const navigate = (overrides: Record<string, string | undefined>) => {
    router.push(buildUrl({ ...overrides, page: undefined }));
  };

  const applyPrice = () => {
    navigate({ min_price: minPrice || undefined, max_price: maxPrice || undefined });
  };

  const clearAll = () => {
    setMinPrice("");
    setMaxPrice("");
    router.push(basePath);
  };

  const hasFilters = !!(
    currentSort ||
    currentBrand ||
    currentCategory ||
    currentMinPrice ||
    currentMaxPrice
  );

  const filterContent = (
    <div className="space-y-6">
      {hasFilters && (
        <button
          onClick={clearAll}
          className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear all filters
        </button>
      )}

      {/* Sort */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-widest">
          Sort By
        </h3>
        <div className="space-y-1.5">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                navigate({ sort: opt.value === currentSort ? undefined : opt.value })
              }
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                currentSort === opt.value
                  ? "bg-river-blue text-white font-medium"
                  : "text-gray-700 hover:bg-[#F4F4F4]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-widest">
          Price Range (Tk)
        </h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          />
          <span className="text-gray-400 flex-shrink-0 text-xs">–</span>
          <input
            type="number"
            placeholder="Max"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          />
        </div>
        <button
          onClick={applyPrice}
          className="mt-2 w-full bg-river-blue text-white text-sm py-2 rounded-lg hover:bg-river-blue transition-colors"
        >
          Apply
        </button>
        {(currentMinPrice || currentMaxPrice) && (
          <button
            onClick={() => {
              setMinPrice("");
              setMaxPrice("");
              navigate({ min_price: undefined, max_price: undefined });
            }}
            className="mt-1 w-full text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Reset price
          </button>
        )}
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-widest">
            Brand
          </h3>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={currentBrand === brand.slug}
                  onChange={() =>
                    navigate({ brand: brand.slug === currentBrand ? undefined : brand.slug })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors leading-none">
                  {brand.name}
                </span>
                {brand.products_count !== undefined && (
                  <span className="ml-auto text-xs text-gray-400">{brand.products_count}</span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-widest">
            Category
          </h3>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={currentCategory === cat.slug}
                  onChange={() =>
                    navigate({ category: cat.slug === currentCategory ? undefined : cat.slug })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors leading-none">
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="w-full lg:hidden">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium shadow-sm"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h18M7 12h10M11 20h2"
            />
          </svg>
          Filters
          {hasFilters && (
            <span className="bg-river-blue text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
              !
            </span>
          )}
          <svg
            className={`w-4 h-4 ml-auto text-gray-400 transition-transform ${mobileOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {mobileOpen && (
          <div className="mt-3 p-4 bg-white border border-gray-200 rounded-xl shadow-lg">
            {filterContent}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-52 flex-shrink-0 bg-white border border-gray-200 rounded-xl p-5 sticky top-20">
        <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 12h10M11 20h2" />
          </svg>
          Filters
          {hasFilters && (
            <span className="ml-auto bg-river-blue/20 text-blue-700 text-[10px] font-semibold rounded-full px-1.5 py-0.5">
              Active
            </span>
          )}
        </h2>
        {filterContent}
      </aside>
    </>
  );
}
