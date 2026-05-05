"use client";

import type { ProductSortTab, CollectionFilterTab } from "@/types";

export interface Tab<T extends string = string> {
  key: T;
  label: string;
}

interface TabFilterProps<T extends string = string> {
  tabs: Tab<T>[];
  active: T | null;
  onChange: (key: T) => void;
  className?: string;
}

export default function TabFilter<T extends string = string>({
  tabs,
  active,
  onChange,
  className = "",
}: TabFilterProps<T>) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
            active === tab.key
              ? "bg-[#F4F4F4] dark:bg-gray-700 text-black dark:text-gray-100 border border-gray-200 dark:border-gray-600"
              : "text-black dark:text-gray-200 hover:bg-river-blue hover:text-white hover:border-blue-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export const PRODUCT_SORT_TABS: Tab<ProductSortTab>[] = [
  { key: "latest", label: "Latest Products" },
  { key: "best_selling", label: "Best Selling" },
  { key: "top_rating", label: "Top Rating" },
];

export const COLLECTION_FILTER_TABS: Tab<CollectionFilterTab>[] = [
  { key: "latest", label: "Latest" },
  { key: "best_selling", label: "Best Selling" },
  { key: "top_rated", label: "Top Rated" },
];
