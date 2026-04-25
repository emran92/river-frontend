import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types";
import { mediaUrl } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden p-3 flex flex-col items-center gap-2"
    >
      {/* Image area */}
      <div className="relative w-full aspect-square bg-white flex items-center justify-center p-4">
        {category.image_url ? (
          <Image
            src={mediaUrl(category.image_url)}
            alt={category.name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-200 bg-[#F7F7F7] rounded-lg p-3"
            sizes="(max-width: 640px) 25vw, 12vw"
          />
        ) : (
          <span className="text-4xl text-gray-300">📦</span>
        )}
      </div>
      {/* Label */}
      <div className="px-3 pb-3 text-center">
        <p className="text-xs md:text-sm font-medium leading-tight">{category.name}</p>
        <p className="text-[10px] md:text-xs text-gray-500 mt-1">{category.products_count} products</p>
      </div>
    </Link>
  );
}
