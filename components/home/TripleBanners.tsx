"use client";

import BannerCard from "@/components/ui/BannerCard";
import { useFetch } from "@/hooks/useFetch";
import { fetchBanners } from "@/lib/api";
import type { Banner } from "@/types";

export default function TripleBanners() {
  const { data: banners, isLoading } = useFetch<Banner[]>(
    "/banners/triple",
    () => fetchBanners("triple")
  );

  if (isLoading) {
    return (
      <section className="max-w-[1280px] mx-auto px-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-gray-200 animate-pulse rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-[1280px] mx-auto px-4 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(banners ?? []).map((banner) => (
          <BannerCard key={banner.id} banner={banner} aspect="aspect-[4/3]" />
        ))}
      </div>
    </section>
  );
}
