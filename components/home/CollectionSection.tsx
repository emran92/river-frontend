"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductCard from "@/components/ui/ProductCard";
import { COLLECTION_FILTER_TABS } from "@/components/ui/TabFilter";
import { useFetch } from "@/hooks/useFetch";
import { fetchCollectionDetail } from "@/lib/api";
import { mediaUrl } from "@/lib/utils";
import type { HomepageCollectionData, CollectionDetail, CollectionFilterTab } from "@/types";

interface CollectionSectionProps {
  data: HomepageCollectionData;
}

const SKELETON_CARDS = Array.from({ length: 5 });

function ProductSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
      </div>
    </div>
  );
}

export default function CollectionSection({ data: collection }: CollectionSectionProps) {
  const [activeTab, setActiveTab] = useState<CollectionFilterTab | null>(null);

  function handleTabChange(key: CollectionFilterTab) {
    setActiveTab((prev) => (prev === key ? null : key));
  }

  const { data: fetchedData, isLoading } = useFetch<CollectionDetail>(
    activeTab ? `/v1/collections/${collection.slug}?filter=${activeTab}` : null,
    () => fetchCollectionDetail(collection.slug, activeTab ?? undefined),
  );

  const products = activeTab
    ? (fetchedData?.products.data ?? [])
    : collection.products;
  const hasBanner =
    collection.banner_enabled && collection.banner_image_url;
  const maxProducts = hasBanner ? 8 : 5;
  const displayProducts = products.slice(0, maxProducts);

  return (
    <section className="max-w-[1280px] mx-auto px-4 py-8">
      <SectionHeader
        title={collection.title}
        subtitle={collection.subtitle ?? undefined}
        seeAllHref={`/${collection.slug}`}
        tabs={COLLECTION_FILTER_TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {hasBanner ? (
        // Layout with vertical side banner
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
          {/* Vertical banner */}
          <div className="relative overflow-hidden rounded-xl">
            {collection.banner_cta_url ? (
              <Link href={collection.banner_cta_url} className="block h-full">
                <div className="relative w-full aspect-[1/2] overflow-hidden rounded-xl">
                  <Image
                    src={mediaUrl(collection.banner_image_url!)}
                    alt={collection.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 25vw"
                  />
                </div>
              </Link>
            ) : (
              <div className="relative w-full aspect-[1/2] overflow-hidden rounded-xl">
                <Image
                  src={mediaUrl(collection.banner_image_url!)}
                  alt={collection.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                />
              </div>
            )}
          </div>

          {/* Product grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
                No products found.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 content-start">
                {displayProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        // Simple grid layout
        <>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {SKELETON_CARDS.map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
              No products found.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
