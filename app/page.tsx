import HeroBanner from "@/components/home/HeroBanner";
import PopularCategory from "@/components/home/PopularCategory";
import CollectionSection from "@/components/home/CollectionSection";
import DynamicBannerSection from "@/components/home/DynamicBannerSection";
import ShopByBrand from "@/components/home/ShopByBrand";
import { fetchCollectionsMeta, fetchBannerSections } from "@/lib/api";
import type { CollectionMeta, BannerSectionData } from "@/types";

type DynamicItem =
  | { kind: "collection"; sort_order: number; data: CollectionMeta }
  | { kind: "banner"; sort_order: number; data: BannerSectionData };

const HERO_LAYOUT_TYPES = new Set(["hero-carousel", "hero-sidebar"]);

export default async function Home() {
  const [collections, bannerSections] = await Promise.all([
    fetchCollectionsMeta().catch((): CollectionMeta[] => []),
    fetchBannerSections().catch((): BannerSectionData[] => []),
  ]);

  const heroCarousel =
    bannerSections.find((s) => s.layout_type === "hero-carousel") ?? null;
  const heroSidebar =
    bannerSections.find((s) => s.layout_type === "hero-sidebar") ?? null;

  const sortedCollections = collections
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order);

  const sortedBanners = bannerSections
    .filter((s) => !HERO_LAYOUT_TYPES.has(s.layout_type))
    .sort((a, b) => a.sort_order - b.sort_order);

  // Interleave: collection, banner, collection, banner, …
  const items: DynamicItem[] = [];
  const maxLen = Math.max(sortedCollections.length, sortedBanners.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < sortedCollections.length) {
      items.push({ kind: "collection", sort_order: i, data: sortedCollections[i] });
    }
    if (i < sortedBanners.length) {
      items.push({ kind: "banner", sort_order: i, data: sortedBanners[i] });
    }
  }

  return (
    <>
      <HeroBanner carousel={heroCarousel} sidebar={heroSidebar} />
      <PopularCategory />
      {items.map((item) =>
        item.kind === "collection" ? (
          <CollectionSection key={`col-${item.data.id}`} collection={item.data} />
        ) : (
          <DynamicBannerSection key={`ban-${item.data.id}`} section={item.data} />
        ),
      )}
      <ShopByBrand />
    </>
  );
}
