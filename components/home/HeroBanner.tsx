"use client";

import { useState, useEffect, useCallback } from "react";
import BannerCard from "@/components/ui/BannerCard";
import { useFetch } from "@/hooks/useFetch";
import { fetchBanners } from "@/lib/api";
import type { Banner } from "@/types";

export default function HeroBanner() {
  const { data: heroBanners } = useFetch<Banner[]>(
    "/banners/hero",
    () => fetchBanners("hero")
  );
  const { data: sideBanners } = useFetch<Banner[]>(
    "/banners/hero_secondary",
    () => fetchBanners("hero_secondary")
  );

  const [activeSlide, setActiveSlide] = useState(0);
  const slides = heroBanners ?? [];

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % Math.max(slides.length, 1));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [slides.length, nextSlide]);

  return (
    <section className="max-w-[1280px] mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-auto">
        {/* Left: Main carousel */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-xl bg-gray-100">
          {slides.length === 0 ? (
            <div className="h-[240px] lg:h-full animate-pulse bg-gray-200 rounded-xl" />
          ) : (
            <>
              <div
                className="flex transition-transform duration-500 ease-in-out h-[240px] lg:h-full"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {slides.map((banner, i) => (
                  <div key={banner.id} className="flex-shrink-0 w-full h-full">
                    <BannerCard
                      banner={banner}
                      aspect="aspect-[16/9]"
                      priority={i === 0}
                      className="h-full"
                    />
                  </div>
                ))}
              </div>

              {/* Dots */}
              {slides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === activeSlide ? "bg-white scale-125" : "bg-white/50"
                      }`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Arrows */}
              {slides.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
                    aria-label="Previous"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
                    aria-label="Next"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {/* Right: 2 stacked side banners */}
        <div className="hidden lg:flex flex-col gap-4">
          {(sideBanners ?? [{ id: 0, type: "hero_secondary" as const, title: "", image: "", sort_order: 0 }, { id: 1, type: "hero_secondary" as const, title: "", image: "", sort_order: 1 }])
            .slice(0, 2)
            .map((banner, i) =>
              banner.image ? (
                <BannerCard
                  key={banner.id}
                  banner={banner}
                  aspect="aspect-[16/9]"
                  priority={i === 0}
                  className="flex-1"
                />
              ) : (
                <div key={i} className="flex-1 animate-pulse bg-gray-200 rounded-xl" />
              )
            )}
        </div>
      </div>
    </section>
  );
}
