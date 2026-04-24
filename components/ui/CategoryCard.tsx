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
      className="flex flex-col items-center gap-2 group cursor-pointer"
    >
      <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center border border-gray-200 group-hover:border-blue-400 transition-colors">
        {category.image_url ? (
          <Image
            src={mediaUrl(category.image_url)}
            alt={category.name}
            fill
            className="object-contain p-2"
            sizes="80px"
          />
        ) : (
          <span className="text-2xl text-gray-400">📦</span>
        )}
      </div>
      <span className="text-xs text-center text-gray-700 font-medium group-hover:text-blue-700 transition-colors leading-tight max-w-[80px]">
        {category.name}
      </span>
    </Link>
  );
}
