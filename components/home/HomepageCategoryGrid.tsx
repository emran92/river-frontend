import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { mediaUrl } from "@/lib/utils";
import type { HomepageCategoryGridItem } from "@/types";

interface HomepageCategoryGridProps {
  items: HomepageCategoryGridItem[];
}

export default function HomepageCategoryGrid({ items }: HomepageCategoryGridProps) {
  if (items.length === 0) return null;

  return (
    <section className="relative max-w-[1280px] mx-auto px-4 py-8">
      <SectionHeader
        title="Popular Category"
        subtitle="BROWSE BY"
        seeAllHref="/categories"
        seeAllLabel="All Categories"
      />

      <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-8 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/${item.slug}`}
            className="group block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden p-3 flex flex-col items-center gap-2"
          >
            <div className="relative w-full aspect-square bg-white dark:bg-gray-800 flex items-center justify-center p-4">
              {item.logo_url ? (
                <Image
                  src={mediaUrl(item.logo_url)}
                  alt={item.name}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-200 bg-[#F7F7F7] dark:bg-transparent rounded-lg p-3"
                  sizes="(max-width: 640px) 25vw, 12vw"
                />
              ) : (
                <span className="text-4xl text-gray-300">📦</span>
              )}
            </div>
            <div className="px-3 pb-3 text-center">
              <p className="text-xs md:text-sm font-medium leading-tight">{item.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
