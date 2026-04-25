"use client";

import { useState } from "react";
import type { Product } from "@/types";

interface Props {
  product: Product;
  inStock: boolean;
}

export default function AddToCartSection({ product, inStock }: Props) {
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const max = product.stock_quantity;

  async function handleAddToCart() {
    if (!inStock) return;
    setAdding(true);
    // TODO: wire up real cart API
    await new Promise((r) => setTimeout(r, 600));
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 font-medium w-20">Quantity</span>
        <div className="flex items-center border border-[#E6E8EB] rounded-xl overflow-hidden">
          <button
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="w-12 text-center text-sm font-semibold text-gray-900 select-none">
            {qty}
          </span>
          <button
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30"
            onClick={() => setQty((q) => Math.min(max, q + 1))}
            disabled={qty >= max || !inStock}
            aria-label="Increase quantity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!inStock || adding}
          className="flex-1 bg-river-blue hover:bg-river-blue disabled:bg-gray-300 text-white font-semibold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {adding ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : added ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Added!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </>
          )}
        </button>

        {/* Wishlist */}
        <button
          className="w-12 h-12 rounded-xl border border-[#E6E8EB] flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-300 transition-colors"
          aria-label="Add to wishlist"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {!inStock && (
        <p className="text-sm text-red-500 font-medium">
          This product is currently out of stock.
        </p>
      )}
    </div>
  );
}
