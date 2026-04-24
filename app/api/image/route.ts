import { NextRequest } from "next/server";

const BACKEND_BASE = process.env.NEXT_PUBLIC_URL ?? "http://localhost:8000";

// Optional: a server-side token for authenticating with the backend.
// Set MEDIA_API_TOKEN in .env.local if your backend requires it.
const MEDIA_API_TOKEN = process.env.MEDIA_API_TOKEN;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const src = searchParams.get("src");

  if (!src) {
    return new Response("Missing src parameter", { status: 400 });
  }

  // Build the full backend URL — accept both absolute and relative paths
  const targetUrl = src.startsWith("http")
    ? src
    : `${BACKEND_BASE}${src.startsWith("/") ? "" : "/"}${src}`;

  // Security: only proxy to the configured backend host
  if (!targetUrl.startsWith(BACKEND_BASE)) {
    return new Response("Forbidden", { status: 403 });
  }

  const headers: HeadersInit = {
    Accept: "image/*",
  };

  if (MEDIA_API_TOKEN) {
    headers["Authorization"] = `Bearer ${MEDIA_API_TOKEN}`;
  }

  try {
    const res = await fetch(targetUrl, {
      headers,
      // Keep signed URLs working by not stripping query params
    });

    if (!res.ok) {
      return new Response("Image unavailable", { status: res.status });
    }

    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const body = await res.arrayBuffer();

    return new Response(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new Response("Failed to fetch image", { status: 502 });
  }
}
