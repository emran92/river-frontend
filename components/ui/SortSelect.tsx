"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Dropdown from "@/components/ui/Dropdown";

const SORT_OPTIONS = [
  { label: "Default", value: "" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Most Popular", value: "popular" },
  { label: "Featured", value: "featured" },
];

interface SortSelectProps {
  basePath: string;
  currentSort?: string;
}

export default function SortSelect({ basePath, currentSort }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  };

  return (
    <Dropdown
      label="Sort by:"
      options={SORT_OPTIONS}
      value={currentSort ?? ""}
      onChange={handleChange}
    />
  );
}
