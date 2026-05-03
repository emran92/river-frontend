"use client";

import { useEffect, useState } from "react";
import Link from "next/link";import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getOrder, cancelOrder } from "@/lib/api";
import { formatBDT, mediaUrl } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-700",
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderDetailPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(`/login?redirect=/orders/${id}`);
    }
  }, [authLoading, isAuthenticated, router, id]);

  useEffect(() => {
    if (!isAuthenticated || !id) return;
    setLoading(true);
    setError("");
    getOrder(id)
      .then(setOrder)
      .catch(() => setError("Order not found."))
      .finally(() => setLoading(false));
  }, [isAuthenticated, id]);

  async function handleCancel() {
    if (!order) return;
    setCancelError("");
    setCancelling(true);
    try {
      await cancelOrder(order.id);
      setOrder((o) => o ? { ...o, status: "cancelled" } : o);
    } catch (err: unknown) {
      setCancelError((err as { message?: string }).message ?? "Failed to cancel order.");
    } finally {
      setCancelling(false);
    }
  }

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-river-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-river-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-[900px] mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 text-sm mb-4">{error || "Order not found."}</p>
        <Link href="/account/orders" className="text-sm text-river-blue hover:underline">← Back to Orders</Link>
      </div>
    );
  }

  const canCancel = order.status === "pending" || order.status === "processing";

  return (
    <div className="max-w-[900px] mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/account/orders" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">← Orders</Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-600">#{order.order_number}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Order #{order.order_number}</h1>
          <p className="text-sm text-gray-400 mt-1">Placed on {formatDate(order.created_at)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-semibold px-3 py-1.5 rounded-full capitalize ${STATUS_STYLES[order.status]}`}>
            {order.status}
          </span>
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="text-sm text-red-500 border border-red-300 px-3 py-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              {cancelling ? "Cancelling…" : "Cancel Order"}
            </button>
          )}
        </div>
      </div>

      {cancelError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{cancelError}</div>
      )}

      {/* Items */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Items</h2>
        <div className="divide-y divide-gray-100">
          {order.items.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4 text-sm">{item.product ? (
                  <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                          
                                  <Image
                                      src={mediaUrl(item.product.thumbnail_url ?? "")}
                                      alt={item.product.name}
                                      width={72}
                                      height={72}
                                      className="w-16 h-16 object-contain rounded-xl bg-gray-50"
                                  />
                              
                          <div className="flex flex-col min-w-0">
                              <p className="font-medium text-gray-900 truncate">{item.product_name}</p>
                              {item.sku && <p className="text-xs text-gray-400 mt-0.5">SKU: {item.sku}</p>}
                          </div>
                      </div>
                      </Link>): (
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-16 h-16 rounded-xl bg-gray-50 flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                          <p className="font-medium text-gray-900 truncate">{item.product_name}</p>
                          {item.sku && <p className="text-xs text-gray-400 mt-0.5">SKU: {item.sku}</p>}
                      </div>
                  </div>
              )}
              <div className="text-right flex-shrink-0">
                  <p className="text-gray-500">{item.quantity} × {formatBDT(Number(item.unit_price))}</p>
                  <p className="font-semibold text-gray-900">{formatBDT(Number(item.total_price))}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Shipping */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Shipping To</h2>
          <p className="text-sm text-gray-700 font-medium">{order.shipping_name}</p>
          <p className="text-sm text-gray-500">{order.shipping_phone}</p>
          <p className="text-sm text-gray-500 mt-1">{order.shipping_address}</p>
          <p className="text-sm text-gray-500">{order.shipping_city}, {order.shipping_district}</p>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Payment Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>{formatBDT(Number(order.subtotal))}</span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span><span>-{formatBDT(Number(order.discount))}</span>
              </div>
            )}
            {Number(order.shipping_fee) > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span><span>{formatBDT(Number(order.shipping_fee))}</span>
              </div>
            )}
            {Number(order.tax) > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Tax</span><span>{formatBDT(Number(order.tax))}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2">
              <span>Total</span><span>{formatBDT(Number(order.total))}</span>
            </div>
            <div className="flex justify-between text-gray-500 pt-1">
              <span>Payment</span>
              <span className="capitalize">{order.payment_method.replace(/_/g, " ")}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Payment Status</span>
              <span className="capitalize">{order.payment_status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
