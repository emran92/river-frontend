"use client";

import BannerCard from "@/components/ui/BannerCard";
import { mediaUrl } from "@/lib/utils";
import type { BannerSectionData, BannerItem, Banner } from "@/types";

interface DynamicBannerSectionProps {
  section: BannerSectionData;
}

function bannerItemToCard(item: BannerItem): Banner {
  return {
    id: item.id,
    type: "promo",
    title: item.title ?? "",
    subtitle: item.subtitle ?? undefined,
    badge: item.badge_text ?? undefined,
    cta_label: item.cta_text ?? undefined,
    cta_href: item.cta_url ?? undefined,
    image: mediaUrl(item.image_url),
    sort_order: item.sort_order,
  };
}

export default function DynamicBannerSection({ section }: DynamicBannerSectionProps) {
  const { layout_type, banners } = section;

  if (!banners || banners.length === 0) return null;

  const sorted = [...banners].sort((a, b) => a.sort_order - b.sort_order);

  if (layout_type === "full-width") {
    const banner = sorted[0];
    return (
      <section className="max-w-[1280px] mx-auto px-4 py-4">
        <BannerCard banner={bannerItemToCard(banner)} aspect="aspect-[16/5]" />
      </section>
    );
  }

  if (layout_type === "two-column") {
    const [first, second] = sorted;
    return (
      <section className="max-w-[1280px] mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {first && (
            <BannerCard banner={bannerItemToCard(first)} aspect="aspect-[16/9]" />
          )}
          {second && (
            <BannerCard banner={bannerItemToCard(second)} aspect="aspect-[16/9]" />
          )}
        </div>
      </section>
    );
  }

  if (layout_type === "three-column") {
    return (
      <section className="max-w-[1280px] mx-auto px-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {sorted.map((item) => (
            <BannerCard
              key={item.id}
              banner={bannerItemToCard(item)}
              fit="object-fill"
              aspect="aspect-[4/3]"
            />
          ))}
        </div>
      </section>
    );
  }

  // Fallback: render first banner full-width for unknown layout types
  const banner = sorted[0];
  return (
    <section className="max-w-[1280px] mx-auto px-4 py-4">
      <BannerCard banner={bannerItemToCard(banner)} aspect="aspect-[16/5]" />
    </section>
  );
}
