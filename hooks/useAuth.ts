"use client";

import useSWR from "swr";
import { getMe, getToken } from "@/lib/auth";
import type { User } from "@/types";

export function useAuth() {
  const token = typeof window !== "undefined" ? getToken() : undefined;

  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR<User | null>(
    token ? "/v1/auth/me" : null,
    () => getMe().catch(() => null),
    { revalidateOnFocus: false },
  );

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    error,
    mutate,
  };
}
