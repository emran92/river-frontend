import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { mediaUrl } from "@/lib/utils";
import type { HomepageBrandGridItem } from "@/types";

interface HomepageBrandGridProps {
  brands: HomepageBrandGridItem[];
}

export default function HomepageBrandGrid({ brands }: HomepageBrandGridProps) {
  if (brands.length === 0) return null;

  return (
    <section className="max-w-[1280px] mx-auto px-4 py-8">
      <SectionHeader
        title="Shop By Brand"
        seeAllHref="/brands"
        seeAllLabel="See All Brands"
        subtitle="Top brands"
      />

      <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/${brand.slug}`}
            className="group flex items-center justify-center h-[88px] bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 duration-200 p-4"
          >
            {brand.logo_url ? (
              <div className="relative w-full h-full">
                <Image
                  src={mediaUrl(brand.logo_url)}
                  alt={brand.name}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform"
                  sizes="(max-width: 640px) 20vw, 10vw"
                />
              </div>
            ) : (
              <span className="text-base font-bold text-[#00A89B] group-hover:text-[#007a72] transition-colors text-center leading-tight">
                {brand.name}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
