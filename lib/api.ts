import type {
  Product,
  Category,
  Brand,
  Banner,
  PaginatedResponse,
  ProductSortTab,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

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

// ─── Products ─────────────────────────────────────────────────────────────────

export async function fetchProducts(
  params: {
    page?: number;
    per_page?: number;
    sort?: ProductSortTab;
    category?: string;
    brand?: string;
  } = {},
): Promise<PaginatedResponse<Product>> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.per_page) qs.set("per_page", String(params.per_page));
  if (params.sort) qs.set("sort", params.sort);
  if (params.category) qs.set("category", params.category);
  if (params.brand) qs.set("brand", params.brand);
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

export async function searchProducts(q: string): Promise<{ data: Product[] }> {
  if (q.length < 2) return { data: [] };
  const qs = new URLSearchParams({ q });
  return apiFetch<{ data: Product[] }>(`/v1/products/search?${qs.toString()}`);
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
    type: "hero_side",
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
    type: "hero_side",
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
