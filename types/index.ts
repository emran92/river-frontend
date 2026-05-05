// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
  }>;
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

// ─── Product Filters ──────────────────────────────────────────────────────────

export interface FilterAttributeValue {
  id: number;
  value: string;
  label: string;
  count: number;
}

export interface FilterAttribute {
  name: string;
  slug: string;
  type: string;
  sort_order: number;
  values: FilterAttributeValue[];
}

export interface FilterBrand {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  count: number;
}

export interface FilterCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  children: FilterCategory[];
}

export interface ProductFilters {
  price_range?: { min: number; max: number };
  brands?: FilterBrand[];
  categories?: FilterCategory[];
  attributes?: FilterAttribute[];
}

export interface CatalogBrandResponse {
  type: "brand";
  resource: Brand[];
  filters: ProductFilters;
  products: PaginatedResponse<Product>;
}

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  count: number;
  logo_url?: string | null;
  icon_url?: string | null;
  banner_url?: string | null;
}

export interface CatalogCategoryResponse {
  type: "category";
  resource: Category;
  filters: ProductFilters;
  products: PaginatedResponse<Product>;
  subcategories?: Subcategory[];
}

export type CatalogResponse = CatalogBrandResponse | CatalogCategoryResponse;

// ─── Category ─────────────────────────────────────────────────────────────────

export interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  logo_url: string | null;
  banner_url: string | null;
  icon_url: string | null;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
  products_count?: number;
  children?: Category[];
  media?: unknown[];
  filters?: ProductFilters;
}

// ─── Brand ────────────────────────────────────────────────────────────────────

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  banner_url: string | null;
  icon_url: string | null;
  country_of_origin: string | null;
  description: string | null;
  is_active: boolean;
  sort_order?: number;
  products_count?: number;
  created_at: string | null;
  updated_at: string | null;
  media?: unknown[];
  filters?: ProductFilters;
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
  price: string;
  created_at: string | null;
  updated_at: string | null;
  product?: Product;
  variant?: null;
}

export interface Cart {
  id: number;
  user_id: number | null;
  session_id: string | null;
  coupon_id: number | null;
  created_at: string | null;
  updated_at: string | null;
  items: CartItem[];
  coupon: unknown | null;
}

export interface CartSummary {
  cart: Cart;
  subtotal: number;
  discount_amount: number;
  total: number;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  variant_id: number | null;
  product_name: string;
  sku: string | null;
  quantity: number;
  unit_price: string;
  total_price: string;
  created_at: string | null;
  updated_at: string | null;
  product?: Product;
  variant?: null;
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  transaction_id: string | null;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_district: string;
  subtotal: string;
  discount: string;
  shipping_fee: string;
  tax: string;
  total: string;
  coupon_code: string | null;
  notes: string | null;
  items: OrderItem[];
  created_at: string | null;
  updated_at: string | null;
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

export type BannerType =
  | "hero"
  | "hero_secondary"
  | "promo"
  | "split"
  | "triple"
  | "long";

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

export type CollectionFilterTab = "latest" | "best_selling" | "top_rated";

// ─── Collections ──────────────────────────────────────────────────────────────

export interface CollectionMeta {
  id: number;
  title: string;
  slug: string;
  subtitle: string | null;
  sort_order: number;
  banner_enabled: boolean;
  banner_type: string | null;
  banner_image_url: string | null;
  banner_cta_url: string | null;
}

export interface CollectionDetail {
  collection: CollectionMeta;
  products: PaginatedResponse<Product>;
}

// ─── Banner Sections ──────────────────────────────────────────────────────────

export interface BannerItem {
  id: number;
  title: string | null;
  subtitle: string | null;
  badge_text: string | null;
  cta_text: string | null;
  cta_url: string | null;
  sort_order: number;
  image_url: string | null;
}

export interface BannerSectionData {
  id: number;
  title: string;
  identifier: string;
  layout_type: string;
  sort_order: number;
  banners: BannerItem[];
}
