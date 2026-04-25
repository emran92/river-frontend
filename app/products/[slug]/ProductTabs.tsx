"use client";

import { useState } from "react";
import type { Product } from "@/types";

interface Props {
  product: Product;
}

type TabKey = "description" | "specifications" | "reviews";

export default function ProductTabs({ product }: Props) {
  const [active, setActive] = useState<TabKey>("description");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "description", label: "Description" },
    { key: "specifications", label: "Specifications" },
    { key: "reviews", label: `Reviews (${product.reviews_count ?? 0})` },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E6E8EB] overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-[#E6E8EB]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-6 py-4 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              active === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6">
        {active === "description" && (
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            {product.description ? (
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            ) : product.short_description ? (
              <p>{product.short_description}</p>
            ) : (
              <p className="text-gray-400">No description available.</p>
            )}
          </div>
        )}

        {active === "specifications" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-100 rounded-xl overflow-hidden text-sm">
            {[
              { label: "Model Number", value: product.model_number },
              { label: "SKU", value: product.sku },
              { label: "Brand", value: product.brand?.name },
              { label: "Category", value: product.category?.name },
              { label: "Weight", value: product.weight ? `${product.weight} kg` : null },
              {
                label: "Warranty",
                value:
                  product.warranty_months > 0
                    ? product.warranty_months >= 12
                      ? `${product.warranty_months / 12} Year${product.warranty_months > 12 ? "s" : ""}`
                      : `${product.warranty_months} Month${product.warranty_months > 1 ? "s" : ""}`
                    : null,
              },
              { label: "Stock", value: `${product.stock_quantity} units` },
            ]
              .filter((row) => !!row.value)
              .map(({ label, value }) => (
                <div key={label} className="flex bg-white">
                  <div className="w-40 shrink-0 bg-[#F4F4F4] px-4 py-3 text-gray-500 font-medium">
                    {label}
                  </div>
                  <div className="px-4 py-3 text-gray-800 flex-1">{value}</div>
                </div>
              ))}
          </div>
        )}

        {active === "reviews" && (
          <div className="flex flex-col gap-4">
            {/* Rating summary */}
            {typeof product.average_rating === "number" && (
              <div className="flex items-center gap-6 p-5 bg-[#F4F4F4] rounded-2xl mb-2">
                <div className="text-center">
                  <p className="text-5xl font-extrabold text-gray-900">
                    {product.average_rating.toFixed(1)}
                  </p>
                  <div className="flex gap-0.5 justify-center mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg
                        key={s}
                        className={`w-4 h-4 ${s <= Math.round(product.average_rating!) ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {product.reviews_count ?? 0} reviews
                  </p>
                </div>
              </div>
            )}
            <p className="text-sm text-gray-400 text-center py-8">
              Customer reviews will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
