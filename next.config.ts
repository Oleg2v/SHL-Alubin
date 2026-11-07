import type { NextConfig } from "next";

/**
 * Static export: the concept ships as plain files (a static-assets Cloudflare Worker; Vercel works too).
 * trailingSlash makes /style-tile resolve to /style-tile/index.html on any static host.
 * globalNotFound: the root layouts live in route groups (later one per locale), so the 404 is its own
 * document (src/app/global-not-found.tsx) and still carries the demo badge.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: { globalNotFound: true },
};

export default nextConfig;
