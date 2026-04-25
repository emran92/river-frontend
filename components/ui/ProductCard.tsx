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
  const hoverSrc = product.gallery_urls?.[0]
    ? mediaUrl(product.gallery_urls[0].medium ?? product.gallery_urls[0].original)
    : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white border border-[#E6E8EB] rounded-lg overflow-hidden transition-shadow duration-200"
    >
      {/* Image */}
      <div className="relative w-full aspect-square">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className={`object-contain p-4 transition-opacity duration-300 ${hoverSrc ? "group-hover:opacity-0" : "group-hover:scale-105 transition-transform"}`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        {hoverSrc && (
          <Image
            src={hoverSrc}
            alt={`${product.name} alternate view`}
            fill
            className="object-contain p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        )}
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1">
          {product.is_featured && (
            <span className="bg-river-blue text-white text-[10px] font-medium px-2 py-0.5 rounded self-start">NEW</span>
          )}
          {hasDiscount && discount > 0 && (
            <span className="bg-river-blue text-white text-[10px] font-medium px-2 py-0.5 rounded">
              {discount}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm text-black font-medium line-clamp-2 leading-snug mb-2 min-h-[2.5rem]">
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
