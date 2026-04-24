"use client";

import useSWR, { type SWRConfiguration } from "swr";

type Fetcher<T> = () => Promise<T>;

export function useFetch<T>(
  key: string | null,
  fetcher: Fetcher<T>,
  config?: SWRConfiguration<T>,
) {
  const { data, error, isLoading, mutate } = useSWR<T>(key, fetcher, {
    revalidateOnFocus: false,
    ...config,
  });

  return {
    data,
    error: error as { message?: string } | undefined,
    isLoading,
    mutate,
  };
}
