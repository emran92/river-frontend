"use client";

import BannerCard from "@/components/ui/BannerCard";
import { mediaUrl } from "@/lib/utils";
import type { HomepageBannerSection, HomepageBannerGroup, BannerItem, Banner } from "@/types";

interface DynamicBannerSectionProps {
  data: HomepageBannerSection;
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

function sortedCards(group: HomepageBannerGroup): Banner[] {
  return [...group.banners]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(bannerItemToCard);
}

export default function DynamicBannerSection({ data }: DynamicBannerSectionProps) {
  if (data.full_width) {
    const cards = sortedCards(data.full_width);
    if (cards.length === 0) return null;
    return (
      <section className="max-w-[1280px] mx-auto px-4 py-4">
        <BannerCard banner={cards[0]} aspect="aspect-[16/5]" />
      </section>
    );
  }

  if (data.two_column) {
    const cards = sortedCards(data.two_column);
    if (cards.length === 0) return null;
    return (
      <section className="max-w-[1280px] mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.slice(0, 2).map((banner) => (
            <BannerCard key={banner.id} banner={banner} aspect="aspect-[16/9]" />
          ))}
        </div>
      </section>
    );
  }

  if (data.three_column) {
    const cards = sortedCards(data.three_column);
    if (cards.length === 0) return null;
    return (
      <section className="max-w-[1280px] mx-auto px-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map((banner) => (
            <BannerCard
              key={banner.id}
              banner={banner}
              fit="object-fill"
              aspect="aspect-[4/3]"
            />
          ))}
        </div>
      </section>
    );
  }

  return null;
}
