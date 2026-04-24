import HeroBanner from "@/components/home/HeroBanner";
import PopularCategory from "@/components/home/PopularCategory";
import NewArrival from "@/components/home/NewArrival";
import PromoBanner from "@/components/home/PromoBanner";
import TopSaleProducts from "@/components/home/TopSaleProducts";
import SplitBanners from "@/components/home/SplitBanners";
import ShopByBrand from "@/components/home/ShopByBrand";
import TripleBanners from "@/components/home/TripleBanners";
import WorldCupSeries from "@/components/home/WorldCupSeries";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <PopularCategory />
      <NewArrival />
      <PromoBanner />
      <TopSaleProducts />
      <SplitBanners />
      <ShopByBrand />
      <TripleBanners />
      <WorldCupSeries />
    </>
  );
}
