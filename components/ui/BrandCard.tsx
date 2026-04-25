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
      className="group flex items-center justify-center aspect-square bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow duration-200 p-5"
    >
      {brand.logo_url ? (
        <div className="relative w-full h-full">
          <Image
            src={mediaUrl(brand.logo_url)}
            alt={brand.name}
            fill
            className="object-contain transition-all duration-200"
            sizes="(max-width: 640px) 33vw, 16vw"
          />
        </div>
      ) : (
        <span className="text-base font-bold text-[#00A89B] group-hover:text-[#007a72] transition-colors text-center leading-tight">
          {brand.name}
        </span>
      )}
    </Link>
  );
}
