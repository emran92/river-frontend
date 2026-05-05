"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrders } from "@/lib/api";
import { formatBDT } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string; dot: string }> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-400" },
  processing: { label: "Processing", className: "bg-blue-100 text-blue-800", dot: "bg-blue-500" },
  shipped: { label: "Shipped", className: "bg-indigo-100 text-indigo-800", dot: "bg-indigo-500" },
  delivered: { label: "Delivered", className: "bg-green-100 text-green-800", dot: "bg-green-500" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700", dot: "bg-red-400" },
  refunded: { label: "Refunded", className: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    getOrders(page)
      .then((res) => {
        setOrders(res.data);
        setLastPage(res.last_page);
        setTotal(res.total);
      })
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Orders</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {total > 0 ? `${total} order${total !== 1 ? "s" : ""} in total` : "Your order history"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="w-8 h-8 border-4 border-river-blue border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center">
          <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">No orders yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">When you place an order it will appear here.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-river-blue text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-river-blue/90 transition-all shadow-sm shadow-river-blue/20"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[1fr_120px_100px_90px_40px] gap-4 px-5 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              <span>Order</span>
              <span>Date</span>
              <span>Total</span>
              <span>Status</span>
              <span />
            </div>

            <div className="divide-y divide-gray-50 dark:divide-gray-700">
              {orders.map((order) => {
                const { className, dot } = STATUS_CONFIG[order.status];
                return (
                  <div key={order.id} className="grid grid-cols-1 sm:grid-cols-[1fr_120px_100px_90px_40px] gap-3 sm:gap-4 px-5 py-4 hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors">
                    {/* Order info */}
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">#{order.order_number}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 sm:hidden">{formatDate(order.created_at)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        {order.items[0] ? ` · ${order.items[0].product_name}${order.items.length > 1 ? ` +${order.items.length - 1} more` : ""}` : ""}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="hidden sm:flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(order.created_at)}</span>
                    </div>

                    {/* Total */}
                    <div className="flex sm:items-center justify-between sm:justify-start">
                      <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{formatBDT(Number(order.total))}</span>
                      {/* Status on mobile */}
                      <span className={`sm:hidden inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${className}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                        {STATUS_CONFIG[order.status].label}
                      </span>
                    </div>

                    {/* Status on desktop */}
                    <div className="hidden sm:flex items-center">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${className}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                        {STATUS_CONFIG[order.status].label}
                      </span>
                    </div>

                    {/* View link */}
                    <div className="hidden sm:flex items-center justify-end">
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-gray-400 dark:text-gray-500 hover:text-river-blue transition-colors"
                        aria-label="View order"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>

                    {/* Mobile: view link inline */}
                    <div className="sm:hidden">
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-sm font-medium text-river-blue hover:underline transition-colors"
                      >
                        View details →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Prev
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400 px-2">
                Page {page} of {lastPage}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                disabled={page === lastPage}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
