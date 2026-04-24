"use client";

import type { ProductSortTab } from "@/types";

export interface Tab<T extends string = string> {
  key: T;
  label: string;
}

interface TabFilterProps<T extends string = string> {
  tabs: Tab<T>[];
  active: T;
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
          className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${
            active === tab.key
              ? "bg-blue-600 text-white"
              : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
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
