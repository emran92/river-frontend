import Image from "next/image";
import Link from "next/link";
import type { Brand } from "@/types";
import { mediaUrl } from "@/lib/utils";

interface BrandCardProps {
  brand: Brand;
}

export default function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="flex items-center justify-center h-16 px-4 border border-gray-200 rounded-lg bg-white hover:border-blue-400 hover:shadow-sm transition-all duration-200 group"
    >
      {brand.logo_url ? (
        <div className="relative h-10 w-28">
          <Image
            src={mediaUrl(brand.logo_url)}
            alt={brand.name}
            fill
            className="object-contain grayscale group-hover:grayscale-0 transition-all duration-200"
            sizes="112px"
          />
        </div>
      ) : (
        <span className="text-sm font-semibold text-gray-500 group-hover:text-blue-700 transition-colors">
          {brand.name}
        </span>
      )}
    </Link>
  );
}
