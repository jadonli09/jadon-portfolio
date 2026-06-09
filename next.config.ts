import type { NextConfig } from "next";
import path from "node:path";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // Pin the workspace root (a stray parent lockfile confuses inference).
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Static export so it can ship to GitHub Pages (or any static host / Vercel).
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    // GitHub Pages has no image optimizer.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  trailingSlash: true,
};

export default nextConfig;
