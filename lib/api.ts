import type {
  Product,
  Category,
  Brand,
  Banner,
  PaginatedResponse,
  ProductSortTab,
  CatalogResponse,
  CartSummary,
  Address,
  Order,
  CollectionMeta,
  CollectionDetail,
  BannerSectionData,
  HomepageSection,
} from "@/types";
import { getToken } from "@/lib/auth";

// Server-side: call the backend directly (no CORS).
// Client-side: use the same-origin rewrite proxy to avoid CORS.
const API_BASE =
  typeof window === "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api")
    : "/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw error;
  }

  return res.json() as Promise<T>;
}

/** Build auth headers from a Bearer token */
export function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function fetchCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/v1/categories");
}

export async function fetchCategory(slug: string): Promise<Category> {
  return apiFetch<Category>(`/v1/categories/${slug}`);
}

// ─── Brands ───────────────────────────────────────────────────────────────────

export async function fetchBrands(): Promise<Brand[]> {
  return apiFetch<Brand[]>("/v1/brands");
}

export async function fetchBrand(slug: string): Promise<Brand> {
  return apiFetch<Brand>(`/v1/brands/${slug}`);
}

// ─── Universal Catalog ────────────────────────────────────────────────────────

export async function fetchCatalog(
  slug: string,
  params: {
    brand?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
    on_sale?: 1 | 0;
    in_stock?: 1 | 0;
    sort?: string;
    per_page?: number;
    page?: number;
    /** Dynamic attribute filters, e.g. { "screen-size": "55,65" } */
    attributes?: Record<string, string>;
  } = {},
): Promise<CatalogResponse> {
  const qs = new URLSearchParams();
  if (params.brand) qs.set("brand", params.brand);
  if (params.category) qs.set("category", params.category);
  if (params.min_price) qs.set("min_price", String(params.min_price));
  if (params.max_price) qs.set("max_price", String(params.max_price));
  if (params.on_sale) qs.set("on_sale", String(params.on_sale));
  if (params.in_stock) qs.set("in_stock", String(params.in_stock));
  if (params.sort) qs.set("sort", params.sort);
  if (params.per_page) qs.set("per_page", String(params.per_page));
  if (params.page) qs.set("page", String(params.page));
  if (params.attributes) {
    Object.entries(params.attributes).forEach(([k, v]) => {
      if (v) qs.set(k, v);
    });
  }
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<CatalogResponse>(`/v1/${slug}${query}`);
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function fetchProducts(
  params: {
    page?: number;
    per_page?: number;
    sort?: ProductSortTab | string;
    category?: string;
    brand?: string;
    min_price?: number;
    max_price?: number;
    search?: string;
  } = {},
): Promise<PaginatedResponse<Product>> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.per_page) qs.set("per_page", String(params.per_page));
  if (params.sort) qs.set("sort", params.sort);
  if (params.category) qs.set("category", params.category);
  if (params.brand) qs.set("brand", params.brand);
  if (params.min_price) qs.set("min_price", String(params.min_price));
  if (params.max_price) qs.set("max_price", String(params.max_price));
  if (params.search) qs.set("search", params.search);
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<PaginatedResponse<Product>>(`/v1/products${query}`);
}

export async function fetchFeaturedProducts(): Promise<
  PaginatedResponse<Product>
> {
  return apiFetch<PaginatedResponse<Product>>("/v1/products/featured");
}

export async function fetchOnSaleProducts(): Promise<
  PaginatedResponse<Product>
> {
  return apiFetch<PaginatedResponse<Product>>("/v1/products/on-sale");
}

export async function fetchProduct(slug: string): Promise<Product> {
  return apiFetch<Product>(`/v1/products/${slug}`);
}

export async function searchProducts(
  q: string,
  params: {
    category?: string;
    category_id?: number;
    page?: number;
    per_page?: number;
  } = {},
): Promise<PaginatedResponse<Product>> {
  if (q.length < 2)
    return {
      data: [],
      current_page: 1,
      first_page_url: "",
      last_page: 1,
      last_page_url: "",
      links: [],
      next_page_url: null,
      path: null,
      per_page: 20,
      prev_page_url: null,
      from: null,
      to: null,
      total: 0,
    };
  const qs = new URLSearchParams({ q });
  if (params.category) qs.set("category", params.category);
  if (params.category_id != null)
    qs.set("category_id", String(params.category_id));
  if (params.page != null) qs.set("page", String(params.page));
  if (params.per_page != null) qs.set("per_page", String(params.per_page));
  return apiFetch<PaginatedResponse<Product>>(
    `/v1/products/search?${qs.toString()}`,
  );
}

// ─── Banners (placeholder — no real endpoint yet) ─────────────────────────────
// These will be replaced with real API calls when the endpoint is available.

const MOCK_BANNERS: Banner[] = [
  {
    id: 1,
    type: "hero",
    title: "Upgrade Your Everyday",
    subtitle:
      "Discover reliable, energy-efficient appliances designed to simplify your everyday life.",
    badge: "40% OFF",
    cta_label: "Shop Now",
    cta_href: "/products",
    image: "/placeholder/1.png",
    bg_color: "#0d47a1",
    sort_order: 1,
  },
  {
    id: 2,
    type: "hero_secondary",
    title: "EID SALES — Hitachi Refrigerator",
    badge: "15% OFF",
    cta_label: "Shop Now",
    cta_href: "/products?category=refrigerators",
    image: "/placeholder/2.png",
    bg_color: "#1565c0",
    sort_order: 2,
  },
  {
    id: 3,
    type: "hero_secondary",
    title: "Samsung New Refrigerators",
    subtitle: "10,000 Tk CASHBACK",
    cta_label: "Shop Now",
    cta_href: "/products?brand=samsung",
    image: "/placeholder/3.png",
    bg_color: "#1e3a5f",
    sort_order: 3,
  },
  {
    id: 4,
    type: "promo",
    title: "Everything Your Home Needs",
    subtitle:
      "Carefully selected appliances for comfort, convenience, and care.",
    cta_label: "Shop Now",
    cta_href: "/products",
    image: "/placeholder/4.png",
    bg_color: "#0d1b3e",
    sort_order: 1,
  },
  {
    id: 5,
    type: "split",
    title: "Choose What Fits Your Life",
    subtitle: "Smart solutions tailored for modern households.",
    cta_label: "Shop Now",
    cta_href: "/products",
    image: "/placeholder/5.png",
    sort_order: 1,
  },
  {
    id: 6,
    type: "split",
    title: "Smart Appliances Smarter Choice",
    subtitle: "Energy saving technology that keeps your home running smoothly.",
    badge: "25% OFF",
    cta_label: "Shop Now",
    cta_href: "/products/on-sale",
    image: "/placeholder/6.png",
    bg_color: "#0d1b2a",
    sort_order: 2,
  },
  {
    id: 7,
    type: "triple",
    title: "Smart Appliances Smarter Choice",
    subtitle: "Energy saving technology that keeps your home running smoothly.",
    cta_label: "Shop Now",
    cta_href: "/products",
    image: "/placeholder/7.png",
    sort_order: 1,
  },
  {
    id: 8,
    type: "triple",
    title: "Smart Appliances Smarter Choice",
    subtitle: "Energy saving technology that keeps your home running smoothly.",
    cta_label: "Shop Now",
    cta_href: "/products",
    image: "/placeholder/8.png",
    sort_order: 2,
  },
  {
    id: 9,
    type: "triple",
    title: "Smart Appliances Smarter Choice",
    subtitle: "Energy saving technology that keeps your home running smoothly.",
    cta_label: "Shop Now",
    cta_href: "/products",
    image: "/placeholder/9.png",
    sort_order: 3,
  },
  {
    id: 10,
    type: "long",
    title: "Smart Appliances Smarter Choice",
    subtitle: "Energy saving technology that keeps your home running smoothly.",
    cta_label: "Shop Now",
    cta_href: "/products",
    image: "/placeholder/10.png",
    sort_order: 1,
  },
];

export async function fetchBanners(type: Banner["type"]): Promise<Banner[]> {
  // TODO: Replace with real API call when endpoint is available
  // return apiFetch<Banner[]>(`/v1/banners?type=${type}`);
  return Promise.resolve(
    MOCK_BANNERS.filter((b) => b.type === type).sort(
      (a, b) => a.sort_order - b.sort_order,
    ),
  );
}

// ─── Collections ──────────────────────────────────────────────────────────────

export async function fetchCollectionsMeta(): Promise<CollectionMeta[]> {
  return apiFetch<CollectionMeta[]>("/v1/collections");
}

export async function fetchCollectionDetail(
  slug: string,
  filter?: string,
): Promise<CollectionDetail> {
  const qs = filter ? `?filter=${filter}` : "";
  return apiFetch<CollectionDetail>(`/v1/collections/${slug}${qs}`);
}

// ─── Banner Sections ──────────────────────────────────────────────────────────

export async function fetchBannerSections(): Promise<BannerSectionData[]> {
  return apiFetch<BannerSectionData[]>("/v1/banner-sections");
}

// ─── Homepage ─────────────────────────────────────────────────────────────────

export async function fetchHomepage(): Promise<HomepageSection[]> {
  return apiFetch<HomepageSection[]>("/v1/homepage");
}

// ─── Authenticated fetch helper ────────────────────────────────────────────────

async function authApiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw error;
  }
  return res.json() as Promise<T>;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export async function getCart(): Promise<CartSummary> {
  return authApiFetch<CartSummary>("/v1/cart");
}

export async function addToCart(payload: {
  product_id: number;
  quantity: number;
  variant_id?: number | null;
}): Promise<CartSummary["cart"]> {
  return authApiFetch("/v1/cart", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCartItem(
  id: number,
  quantity: number,
): Promise<void> {
  await authApiFetch(`/v1/cart/${id}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(id: number): Promise<void> {
  await authApiFetch(`/v1/cart/${id}`, { method: "DELETE" });
}

export async function applyCoupon(
  code: string,
): Promise<{ message: string; discount_amount: string }> {
  return authApiFetch("/v1/cart/apply-coupon", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export async function removeCoupon(): Promise<{ message: string }> {
  return authApiFetch("/v1/cart/remove-coupon", { method: "DELETE" });
}

// ─── Addresses ────────────────────────────────────────────────────────────────

export async function getAddresses(): Promise<Address[]> {
  return authApiFetch<Address[]>("/v1/addresses");
}

export async function createAddress(
  data: Omit<Address, "id" | "user_id" | "created_at" | "updated_at">,
): Promise<Address> {
  return authApiFetch<Address>("/v1/addresses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAddress(
  id: number,
  data: Partial<Omit<Address, "id" | "user_id" | "created_at" | "updated_at">>,
): Promise<Address> {
  return authApiFetch<Address>(`/v1/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteAddress(id: number): Promise<void> {
  await authApiFetch(`/v1/addresses/${id}`, { method: "DELETE" });
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function getOrders(page = 1): Promise<PaginatedResponse<Order>> {
  return authApiFetch<PaginatedResponse<Order>>(`/v1/orders?page=${page}`);
}

export async function getOrder(id: number): Promise<Order> {
  return authApiFetch<Order>(`/v1/orders/${id}`);
}

export async function cancelOrder(id: number): Promise<void> {
  await authApiFetch(`/v1/orders/${id}/cancel`, { method: "POST" });
}

export async function checkout(payload: {
  address_id: number;
  payment_method: string;
  notes?: string | null;
  redeem_points?: boolean;
}): Promise<Order> {
  return authApiFetch<Order>("/v1/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
