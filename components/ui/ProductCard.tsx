"use client";

import { useState, useEffect, useRef } from "react";
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
  const primarySrc = product.thumbnail_url
    ? mediaUrl(product.thumbnail_url)
    : "/placeholder/product.jpg";

  const galleryImages = product.gallery_urls?.map(
    (g) => mediaUrl(g.medium ?? g.original),
  ) ?? [];

  const [activeIndex, setActiveIndex] = useState<number>(-1); // -1 = primary
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleMouseEnter = () => {
    if (galleryImages.length === 0) return;
    setActiveIndex(0);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev + 1;
        return next >= galleryImages.length ? 0 : next;
      });
    }, 1000);
  };

  const handleMouseLeave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActiveIndex(-1);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const displaySrc = activeIndex >= 0 ? galleryImages[activeIndex] : primarySrc;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white border border-[#E6E8EB] rounded-lg overflow-hidden transition-shadow duration-200"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image */}
      <div className="relative w-full aspect-square">
        <Image
          src={displaySrc}
          alt={product.name}
          fill
          className={`object-contain p-4 transition-opacity duration-300 ${galleryImages.length === 0 ? "group-hover:scale-105 transition-transform" : ""}`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        {/* Dot indicators */}
        {galleryImages.length > 1 && activeIndex >= 0 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {galleryImages.map((_, i) => (
              <span
                key={i}
                className={`block w-1.5 h-1.5 rounded-full transition-colors duration-200 ${i === activeIndex ? "bg-gray-700" : "bg-gray-300"}`}
              />
            ))}
          </div>
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
