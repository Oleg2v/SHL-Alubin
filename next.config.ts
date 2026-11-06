import type { NextConfig } from "next";

/**
 * Static export: the concept ships as plain files to Vercel or Cloudflare Pages.
 * trailingSlash makes /style-tile resolve to /style-tile/index.html on any static host.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
