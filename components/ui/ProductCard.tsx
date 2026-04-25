import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { formatBDT, discountPercent, mediaUrl } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = !!product.sale_price;
  const discount = hasDiscount
    ? discountPercent(product.price, product.sale_price!)
    : 0;

  const displayPrice = product.sale_price ?? product.price;
  const imageSrc = product.thumbnail_url
    ? mediaUrl(product.thumbnail_url)
    : "/placeholder/product.jpg";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* Image */}
      <div className="relative w-full aspect-square bg-[#F7F7F7]">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_featured && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              NEW
            </span>
          )}
          {hasDiscount && discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              {discount}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm text-gray-700 line-clamp-2 leading-snug mb-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base font-bold text-gray-900">
            {formatBDT(displayPrice)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              {formatBDT(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
