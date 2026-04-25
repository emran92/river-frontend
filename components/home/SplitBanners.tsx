"use client";

import BannerCard from "@/components/ui/BannerCard";
import { useFetch } from "@/hooks/useFetch";
import { fetchBanners } from "@/lib/api";
import type { Banner } from "@/types";

export default function SplitBanners() {
  const { data: banners, isLoading } = useFetch<Banner[]>(
    "/banners/split",
    () => fetchBanners("split")
  );

  if (isLoading) {
    return (
      <section className="max-w-[1280px] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="aspect-[16/7] bg-gray-200 animate-pulse rounded-xl" />
          <div className="aspect-[16/7] bg-gray-200 animate-pulse rounded-xl" />
        </div>
      </section>
    );
  }

  const [first, second] = banners ?? [];

  return (
    <section className="max-w-[1280px] mx-auto px-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {first && <BannerCard banner={first} aspect="aspect-[16/7]" />}
        {second && <BannerCard banner={second} aspect="aspect-[16/7]" />}
      </div>
    </section>
  );
}
