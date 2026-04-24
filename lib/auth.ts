import Cookies from "js-cookie";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export const TOKEN_COOKIE = "river_token";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getToken(): string | undefined {
  return Cookies.get(TOKEN_COOKIE);
}

async function authFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw error;
  }

  return res.json() as Promise<T>;
}

// ─── Auth actions ─────────────────────────────────────────────────────────────

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const data = await authFetch<AuthResponse>("/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  Cookies.set(TOKEN_COOKIE, data.token, { expires: 30, sameSite: "lax" });
  return data;
}

export async function register(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const data = await authFetch<AuthResponse>("/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  Cookies.set(TOKEN_COOKIE, data.token, { expires: 30, sameSite: "lax" });
  return data;
}

export async function logout(): Promise<void> {
  try {
    await authFetch<{ message: string }>("/v1/auth/logout", { method: "POST" });
  } finally {
    Cookies.remove(TOKEN_COOKIE);
  }
}

export async function getMe(): Promise<User> {
  return authFetch<User>("/v1/auth/me");
}

export async function updateMe(payload: {
  name?: string;
  phone?: string;
}): Promise<User | null> {
  return authFetch<User | null>("/v1/auth/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export { getToken };
