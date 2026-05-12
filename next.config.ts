import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Proxy /api/v1/* through Next.js so browser requests stay same-origin
    // and avoid CORS. The backend URL is read server-side only.
    const backendApi =
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendApi}/v1/:path*`,
      },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    dangerouslyAllowLocalIP: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy:
      "default-src 'none'; style-src 'unsafe-inline'; sandbox;",
    // Allow our local proxy route with any query string
    localPatterns: [
      {
        pathname: "/**",
      },
    ],
    // Keep remote patterns for any direct backend URLs
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "river-electronics.sgp1.cdn.digitaloceanspaces.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "river-electronics.sgp1.digitaloceanspaces.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
