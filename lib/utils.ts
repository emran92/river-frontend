/**
 * Format a price string as BDT (Bangladeshi Taka)
 * e.g. "24500" or 24500 → "Tk 24,500"
 */
export function formatBDT(price: string | number | null | undefined): string {
  if (price === null || price === undefined || price === "") return "Tk 0";
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num)) return "Tk 0";
  return (
    "Tk " +
    num.toLocaleString("en-BD", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  );
}

/**
 * Calculate discount percentage between original price and sale price
 */
export function discountPercent(price: string, salePrice: string): number {
  const p = parseFloat(price);
  const s = parseFloat(salePrice);
  if (!p || !s || s >= p) return 0;
  return Math.round(((p - s) / p) * 100);
}

/**
 * Build a full media URL from a relative path returned by the API.
 * e.g. "products/abc.jpg" → "http://localhost:8000/storage/products/abc.jpg"
 */
export function mediaUrl(path: string | null | undefined): string {
  if (!path) return "/placeholder/placeholder.jpg";
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_URL;
  return `${base}/${path.replace(/^\//, "")}`;
}
