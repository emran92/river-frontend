import Link from "next/link";
import TabFilter, { type Tab } from "./TabFilter";

interface SectionHeaderProps<T extends string = string> {
  title: string;
  seeAllHref?: string;
  seeAllLabel?: string;
  tabs?: Tab<T>[];
  activeTab?: T;
  onTabChange?: (key: T) => void;
  className?: string;
}

export default function SectionHeader<T extends string = string>({
  title,
  seeAllHref,
  seeAllLabel = "See All Products",
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: SectionHeaderProps<T>) {
  return (
    <div className={`flex items-center justify-between mb-5 flex-wrap gap-3 ${className}`}>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>

      <div className="flex items-center gap-3 flex-wrap">
        {tabs && activeTab && onTabChange && (
          <TabFilter tabs={tabs} active={activeTab} onChange={onTabChange} />
        )}
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
          >
            {seeAllLabel} →
          </Link>
        )}
      </div>
    </div>
  );
}
