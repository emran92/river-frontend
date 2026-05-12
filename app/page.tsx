"use client";

import { useEffect, useRef, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { fetchHomepage } from "@/lib/api";
import type { HomepageSection } from "@/types";
import HeroBanner from "@/components/home/HeroBanner";
import CollectionSection from "@/components/home/CollectionSection";
import DynamicBannerSection from "@/components/home/DynamicBannerSection";
import HomepageCategoryGrid from "@/components/home/HomepageCategoryGrid";
import HomepageBrandGrid from "@/components/home/HomepageBrandGrid";
import HomepageProductGrid from "@/components/home/HomepageProductGrid";

// ─── Animated section wrapper ───────────────────────────────────────────────

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Wait one frame so the browser paints the initial hidden state first
    const raf = requestAnimationFrame(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.06 },
      );
      observer.observe(el);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function HomepageSkeleton() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 aspect-[16/9] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl" />
          <div className="hidden lg:flex flex-col gap-4">
            <div className="flex-1 aspect-[16/9] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl" />
            <div className="flex-1 aspect-[16/9] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl" />
          </div>
        </div>
      </section>

      {/* Category grid skeleton */}
      <section className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-5">
          <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-8 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 dark:border-gray-700 p-3 animate-pulse">
              <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="h-3 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* Banner skeleton */}
      <section className="max-w-[1280px] mx-auto px-4 py-4">
        <div className="aspect-[16/5] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl" />
      </section>

      {/* Collection skeleton */}
      <section className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-5">
          <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// ─── Title helper ─────────────────────────────────────────────────────────────

function titleFromReferenceType(ref: string | null, fallback: string | null): string {
  if (fallback) return fallback;
  if (!ref) return "Products";
  return ref
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ─── Section renderer ─────────────────────────────────────────────────────────

function renderSection(section: HomepageSection, index: number) {
  switch (section.type) {
    case "banner_section": {
      const { hero_left, hero_right } = section.data;
      if (hero_left || hero_right) {
        return (
          <HeroBanner
            key={`banner-hero-${section.sort_order}`}
            carousel={hero_left}
            sidebar={hero_right}
          />
        );
      }
      return (
        <DynamicBannerSection
          key={`banner-${section.sort_order}`}
          data={section.data}
        />
      );
    }
    case "collection":
      return (
        <CollectionSection
          key={`col-${section.data.id}`}
          data={section.data}
        />
      );
    case "category_grid":
      return (
        <HomepageCategoryGrid
          key={`catgrid-${section.sort_order}`}
          items={section.data}
        />
      );
    case "brand_grid":
      return (
        <HomepageBrandGrid
          key={`brandgrid-${section.sort_order}`}
          brands={section.data}
        />
      );
    case "product_grid":
      return (
        <HomepageProductGrid
          key={`prodgrid-${section.sort_order}`}
          products={section.data}
          title={titleFromReferenceType(section.reference_type, section.title)}
        />
      );
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const { data: sections, isLoading } = useFetch<HomepageSection[]>(
    "/v1/homepage",
    fetchHomepage,
  );

  if (isLoading || !sections) {
    return <HomepageSkeleton />;
  }

  return (
    <>
      {sections.map((section, i) => (
        <AnimatedSection key={i} delay={i === 0 ? 0 : 60}>
          {renderSection(section, i)}
        </AnimatedSection>
      ))}
    </>
  );
}

