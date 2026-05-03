"use client";

import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";
import useSWR from "swr";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  applyCoupon as apiApplyCoupon,
  removeCoupon as apiRemoveCoupon,
} from "@/lib/api";
import type { CartSummary, CartItem } from "@/types";

interface CartContextValue {
  summary: CartSummary | undefined;
  items: CartItem[];
  count: number;
  subtotal: number;
  total: number;
  discountAmount: number;
  isLoading: boolean;
  addItem: (productId: number, quantity: number, variantId?: number | null) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  refresh: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const { data: summary, isLoading, mutate } = useSWR<CartSummary>(
    isAuthenticated ? "/v1/cart" : null,
    getCart,
    { revalidateOnFocus: false }
  );

  const items = summary?.cart.items ?? [];
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = useCallback(
    async (productId: number, quantity: number, variantId?: number | null) => {
      if (!isAuthenticated) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      await apiAddToCart({ product_id: productId, quantity, variant_id: variantId });
      await mutate();
    },
    [isAuthenticated, router, pathname, mutate]
  );

  const updateItem = useCallback(
    async (itemId: number, quantity: number) => {
      await apiUpdateCartItem(itemId, quantity);
      await mutate();
    },
    [mutate]
  );

  const removeItem = useCallback(
    async (itemId: number) => {
      await apiRemoveCartItem(itemId);
      await mutate();
    },
    [mutate]
  );

  const applyCoupon = useCallback(
    async (code: string) => {
      await apiApplyCoupon(code);
      await mutate();
    },
    [mutate]
  );

  const removeCoupon = useCallback(
    async () => {
      await apiRemoveCoupon();
      await mutate();
    },
    [mutate]
  );

  return (
    <CartContext.Provider
      value={{
        summary,
        items,
        count,
        subtotal: summary?.subtotal ?? 0,
        total: summary?.total ?? 0,
        discountAmount: summary?.discount_amount ?? 0,
        isLoading,
        addItem,
        updateItem,
        removeItem,
        applyCoupon,
        removeCoupon,
        refresh: mutate,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
