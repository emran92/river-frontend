import SectionHeader from "@/components/ui/SectionHeader";
import ProductCard from "@/components/ui/ProductCard";
import type { Product } from "@/types";

interface HomepageProductGridProps {
  products: Product[];
  title: string;
  subtitle?: string;
  seeAllHref?: string;
}

export default function HomepageProductGrid({
  products,
  title,
  subtitle,
  seeAllHref = "/products",
}: HomepageProductGridProps) {
  if (products.length === 0) return null;

  return (
    <section className="max-w-[1280px] mx-auto px-4 py-8">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        seeAllHref={seeAllHref}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
