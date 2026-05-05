"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { ProductFilters, FilterCategory } from "@/types";

interface ProductFiltersClientProps {
  basePath: string;
  /** "category" pages show brand filters; "brand" pages show category filters */
  pageType: "brand" | "category";
  currentBrands?: string[];
  currentCategories?: string[];
  currentMinPrice?: number;
  currentMaxPrice?: number;
  /** attr-slug → array of selected values (e.g. { "screen-size": ["55", "65"] }) */
  currentAttributes?: Record<string, string[]>;
  filters?: ProductFilters;
}

function CategoryFilterTree({
  cat,
  currentCategories,
  onToggle,
}: {
  cat: FilterCategory;
  currentCategories: string[];
  onToggle: (slug: string) => void;
}) {
  return (
    <div>
      <label className="flex items-center gap-2.5 cursor-pointer group">
        <input
          type="checkbox"
          checked={currentCategories.includes(cat.slug)}
          onChange={() => onToggle(cat.slug)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer"
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-none">
          {cat.name}
        </span>
        {cat.count > 0 && (
          <span className="ml-auto text-xs text-gray-400">{cat.count}</span>
        )}
      </label>
      {cat.children.length > 0 && (
        <div className="ml-5 mt-1.5 space-y-1.5">
          {cat.children.map((child) => (
            <label key={child.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={currentCategories.includes(child.slug)}
                onChange={() => onToggle(child.slug)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer"
              />
              <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-none">
                {child.name}
              </span>
              {child.count > 0 && (
                <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">{child.count}</span>
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductFiltersClient({
  basePath,
  pageType,
  currentBrands = [],
  currentCategories = [],
  currentMinPrice,
  currentMaxPrice,
  currentAttributes = {},
  filters,
}: ProductFiltersClientProps) {
  const router = useRouter();
  const [minPrice, setMinPrice] = useState(currentMinPrice?.toString() ?? "");
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice?.toString() ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);

  const buildUrl = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const params = new URLSearchParams();
      const base: Record<string, string | undefined> = {
        ...(pageType === "category" && currentBrands.length > 0
          ? { brand: currentBrands.join(",") }
          : {}),
        ...(pageType === "brand" && currentCategories.length > 0
          ? { category: currentCategories.join(",") }
          : {}),
        min_price: currentMinPrice?.toString(),
        max_price: currentMaxPrice?.toString(),
        ...Object.fromEntries(
          Object.entries(currentAttributes).map(([k, v]) => [
            k,
            v.length > 0 ? v.join(",") : undefined,
          ]),
        ),
      };
      const merged = { ...base, ...overrides };
      Object.entries(merged).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      const qs = params.toString();
      return qs ? `${basePath}?${qs}` : basePath;
    },
    [basePath, pageType, currentBrands, currentCategories, currentMinPrice, currentMaxPrice, currentAttributes],
  );

  const navigate = (overrides: Record<string, string | undefined>) => {
    router.push(buildUrl({ ...overrides, page: undefined }));
  };

  const toggleBrand = (slug: string) => {
    const updated = currentBrands.includes(slug)
      ? currentBrands.filter((s) => s !== slug)
      : [...currentBrands, slug];
    navigate({ brand: updated.length > 0 ? updated.join(",") : undefined });
  };

  const toggleCategory = (slug: string) => {
    const updated = currentCategories.includes(slug)
      ? currentCategories.filter((s) => s !== slug)
      : [...currentCategories, slug];
    navigate({ category: updated.length > 0 ? updated.join(",") : undefined });
  };

  const toggleAttribute = (attrSlug: string, value: string) => {
    const current = currentAttributes[attrSlug] ?? [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    navigate({ [attrSlug]: updated.length > 0 ? updated.join(",") : undefined });
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
    currentBrands.length > 0 ||
    currentCategories.length > 0 ||
    currentMinPrice ||
    currentMaxPrice ||
    Object.values(currentAttributes).some((v) => v.length > 0)
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

      {/* Price Range */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-widest">
          Price Range (Tk)
        </h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white dark:bg-gray-800 text-foreground"
          />
          <span className="text-gray-400 dark:text-gray-500 flex-shrink-0 text-xs">–</span>
          <input
            type="number"
            placeholder="Max"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white dark:bg-gray-800 text-foreground"
          />
        </div>
        {filters?.price_range && (
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
            Range: Tk {filters.price_range.min.toLocaleString()} – Tk{" "}
            {filters.price_range.max.toLocaleString()}
          </p>
        )}
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
            className="mt-1 w-full text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"
          >
            Reset price
          </button>
        )}
      </div>

      {/* Brands (shown on category pages) */}
      {pageType === "category" && (filters?.brands ?? []).length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-widest">
            Brand
          </h3>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {filters!.brands!.map((brand) => (
              <label key={brand.id} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={currentBrands.includes(brand.slug)}
                  onChange={() => toggleBrand(brand.slug)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer"
                />
                <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-none">
                  {brand.name}
                </span>
                <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">{brand.count}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Categories with hierarchy (shown on brand pages) */}
      {pageType === "brand" && (filters?.categories ?? []).length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-widest">
            Category
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {filters!.categories!.map((cat) => (
              <CategoryFilterTree
                key={cat.id}
                cat={cat}
                currentCategories={currentCategories}
                onToggle={toggleCategory}
              />
            ))}
          </div>
        </div>
      )}

      {/* Attributes */}
      {(filters?.attributes ?? []).map((attr) => (
        <div key={attr.slug}>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-widest">
            {attr.name}
          </h3>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {attr.values.map((val) => {
              const isChecked = (currentAttributes[attr.slug] ?? []).includes(val.value);
              return (
                <label key={val.id} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleAttribute(attr.slug, val.value)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-none">
                    {val.label}
                  </span>
                  <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">{val.count}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="w-full lg:hidden">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium shadow-sm text-gray-700 dark:text-gray-200"
        >
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div className="mt-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
            {filterContent}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-52 flex-shrink-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 sticky top-20">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
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
