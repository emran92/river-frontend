"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { mediaUrl, formatBDT } from "@/lib/utils";

export default function CartPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { items, subtotal, discountAmount, total, isLoading, updateItem, removeItem, applyCoupon, removeCoupon, summary } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [removingCoupon, setRemovingCoupon] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login?redirect=/cart");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-river-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  async function handleQtyChange(itemId: number, newQty: number) {
    if (newQty < 1) return;
    setUpdatingId(itemId);
    try { await updateItem(itemId, newQty); }
    finally { setUpdatingId(null); }
  }

  async function handleRemove(itemId: number) {
    setRemovingId(itemId);
    try { await removeItem(itemId); }
    finally { setRemovingId(null); }
  }

  async function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError("");
    setCouponLoading(true);
    try {
      await applyCoupon(couponInput.trim());
      setCouponInput("");
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message;
      setCouponError(msg ?? "Invalid coupon code.");
    } finally {
      setCouponLoading(false);
    }
  }

  async function handleRemoveCoupon() {
    setRemovingCoupon(true);
    try { await removeCoupon(); }
    finally { setRemovingCoupon(false); }
  }

  const hasCoupon = Boolean(summary?.cart.coupon);

  if (!isLoading && items.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-16 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-sm text-gray-500 mb-6">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/products" className="inline-block bg-river-blue text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-river-blue/90 transition-colors">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="w-8 h-8 border-4 border-river-blue border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4">
                {item.product && (
                  <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
                    <Image
                      src={mediaUrl(item.product.thumbnail_url ?? "")}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-contain rounded-lg bg-gray-50"
                    />
                  </Link>
                )}
                <div className="flex-1 min-w-0">
                  {item.product ? (
                    <Link href={`/products/${item.product.slug}`} className="font-semibold text-sm text-gray-900 line-clamp-2 hover:text-river-blue transition-colors">
                      {item.product.name}
                    </Link>
                  ) : (
                    <p className="font-semibold text-sm text-gray-900">Product #{item.product_id}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-0.5">{formatBDT(Number(item.price))}</p>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                        onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updatingId === item.id}
                        aria-label="Decrease"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-10 text-center text-sm font-semibold select-none">
                        {updatingId === item.id ? "…" : item.quantity}
                      </span>
                      <button
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                        onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                        disabled={updatingId === item.id}
                        aria-label="Increase"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={removingId === item.id}
                      className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
                    >
                      {removingId === item.id ? "Removing…" : "Remove"}
                    </button>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-900 text-sm">
                    {formatBDT(Number(item.price) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="font-semibold text-sm text-gray-900 mb-3">Coupon Code</h3>
              {hasCoupon ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700 font-medium">Coupon applied!</span>
                  <button
                    onClick={handleRemoveCoupon}
                    disabled={removingCoupon}
                    className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
                  >
                    {removingCoupon ? "Removing…" : "Remove"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter coupon"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-river-blue focus:ring-2 focus:ring-river-blue/20"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="bg-river-blue text-white text-sm px-3 py-2 rounded-lg hover:bg-river-blue/90 disabled:opacity-60 transition-colors"
                  >
                    {couponLoading ? "…" : "Apply"}
                  </button>
                </form>
              )}
              {couponError && <p className="mt-2 text-xs text-red-600">{couponError}</p>}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
              <h3 className="font-semibold text-sm text-gray-900">Order Summary</h3>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatBDT(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{formatBDT(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500 border-t border-gray-100 pt-3">
                <span>Shipping</span>
                <span className="text-green-600">Calculated at checkout</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-3">
                <span>Total</span>
                <span>{formatBDT(total)}</span>
              </div>
              <Link
                href="/checkout"
                className="block w-full bg-river-blue text-white text-center text-sm font-semibold py-3 rounded-xl hover:bg-river-blue/90 transition-colors mt-2"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/products"
                className="block w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
