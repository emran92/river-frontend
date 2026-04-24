import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/types";

interface BannerCardProps {
  banner: Banner;
  className?: string;
  /** Aspect ratio class, e.g. "aspect-[16/7]" */
  aspect?: string;
  priority?: boolean;
}

export default function BannerCard({
  banner,
  className = "",
  aspect = "aspect-[16/7]",
  priority = false,
}: BannerCardProps) {
  const content = (
    <div
      className={`relative overflow-hidden rounded-xl ${aspect} ${className}`}
      style={banner.bg_color ? { backgroundColor: banner.bg_color } : {}}
    >
      {/* Background image */}
      <Image
        src={banner.image}
        alt={banner.title}
        fill
        className="object-fill object-center"
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Overlay + content */}
      {/* <div className="relative z-10 h-full flex flex-col justify-center p-6 md:p-8">
        {banner.badge && (
          <span className="inline-block bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded mb-3 w-fit">
            {banner.badge}
          </span>
        )}
        <h2 className="text-white font-bold text-lg md:text-2xl leading-tight max-w-xs">
          {banner.title}
        </h2>
        {banner.subtitle && (
          <p className="text-blue-100 text-sm mt-2 max-w-xs leading-relaxed">
            {banner.subtitle}
          </p>
        )}
        {banner.cta_label && (
          <button className="mt-4 inline-flex items-center gap-1 bg-white text-blue-700 text-sm font-semibold px-4 py-2 rounded-md hover:bg-blue-50 transition-colors w-fit">
            {banner.cta_label}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div> */}
    </div>
  );

  if (banner.cta_href) {
    return <Link href={banner.cta_href}>{content}</Link>;
  }

  return content;
}
