"use client";

import BannerCard from "@/components/ui/BannerCard";
import { useFetch } from "@/hooks/useFetch";
import { fetchBanners } from "@/lib/api";
import type { Banner } from "@/types";

export default function PromoBanner() {
  const { data: banners, isLoading } = useFetch<Banner[]>(
    "/banners/promo",
    () => fetchBanners("promo")
  );

  const banner = banners?.[0];

  if (isLoading) {
    return (
      <section className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="w-full aspect-[16/5] bg-gray-200 animate-pulse rounded-xl" />
      </section>
    );
  }

  if (!banner) return null;

  return (
    <section className="max-w-[1280px] mx-auto px-4 py-4">
      <BannerCard banner={banner} aspect="aspect-[16/5]" priority={false} />
    </section>
  );
}
