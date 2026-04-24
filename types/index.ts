// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: Record<string, unknown>;
  next_page_url: string | null;
  path: string | null;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  phone: string | null;
  loyalty_points: number;
  email: string;
  email_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  image_url: string | null;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
  children?: Category[];
  media?: unknown[];
}

// ─── Brand ────────────────────────────────────────────────────────────────────

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url?: string | null;
  country_of_origin: string | null;
  description: string | null;
  is_active: boolean;
  sort_order?: number;
  products_count?: number;
  created_at: string | null;
  updated_at: string | null;
  media?: unknown[];
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  category_id: number;
  brand_id: number | null;
  name: string;
  slug: string;
  sku: string | null;
  model_number: string | null;
  short_description: string | null;
  description: string | null;
  price: string;
  sale_price: string | null;
  cost_price: string | null;
  stock_quantity: number;
  low_stock_threshold: number;
  weight: string | null;
  warranty_months: number;
  is_active: boolean;
  is_featured: boolean;
  views_count: number;
  sales_count: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  thumbnail_url?: string | null;
  gallery_urls?: Array<{
    original: string;
    thumb: string;
    medium: string;
    large: string;
  }>;
  average_rating?: number;
  reviews_count?: number;
  category?: Category;
  brand?: Brand;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  variant_id: number | null;
  quantity: number;
  product?: Product;
}

export interface Cart {
  id: number;
  user_id: number | null;
  session_id: string | null;
  coupon_id: number | null;
  created_at: string | null;
  updated_at: string | null;
  items?: CartItem[];
}

export interface CartSummary {
  cart: Cart;
  subtotal: string;
  discount_amount: string;
  total: string;
}

// ─── Address ──────────────────────────────────────────────────────────────────

export interface Address {
  id: number;
  user_id: number;
  label: string;
  recipient_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  district: string | null;
  postal_code: string | null;
  is_default: boolean;
  created_at: string | null;
  updated_at: string | null;
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  order_item_id: number | null;
  rating: number;
  title: string | null;
  body: string | null;
  is_approved: boolean;
  helpful_count: number;
  created_at: string | null;
  updated_at: string | null;
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export interface Wishlist {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string | null;
  updated_at: string | null;
}

// ─── Banner (placeholder — no API endpoint yet) ───────────────────────────────

export type BannerType = "hero" | "hero_side" | "promo" | "split" | "triple";

export interface Banner {
  id: number;
  type: BannerType;
  title: string;
  subtitle?: string;
  badge?: string;
  cta_label?: string;
  cta_href?: string;
  image: string;
  bg_color?: string;
  sort_order: number;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

// ─── API Error ────────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// ─── Product sort tabs ────────────────────────────────────────────────────────

export type ProductSortTab = "latest" | "best_selling" | "top_rating";
