import Link from "next/link";
import TabFilter, { type Tab } from "./TabFilter";

interface SectionHeaderProps<T extends string = string> {
  title: string;
  subtitle?: string;
  seeAllHref?: string;
  seeAllLabel?: string;
  tabs?: Tab<T>[];
  activeTab?: T;
  onTabChange?: (key: T) => void;
  className?: string;
}

export default function SectionHeader<T extends string = string>({
  title,
  subtitle,
  seeAllHref,
  seeAllLabel = "See All Products",
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: SectionHeaderProps<T>) {
  return (
    <div className={`flex items-center justify-between mb-5 flex-wrap gap-3 ${className}`}>
      <div>
        {subtitle && (
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">{subtitle}</p>
        )}
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {tabs && activeTab && onTabChange && (
          <TabFilter tabs={tabs} active={activeTab} onChange={onTabChange} />
        )}
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="bg-[#F4F4F4] rounded-lg text-black text-sm font-medium hover:bg-blue-700 hover:text-white transition-colors px-4 py-2 border border-gray-200"
          >
            {seeAllLabel} →
          </Link>
        )}
      </div>
    </div>
  );
}
