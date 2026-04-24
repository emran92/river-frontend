import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },
};

export default nextConfig;
