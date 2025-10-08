import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Skip ESLint errors during Vercel build (optional)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production build even if there are type errors (use cautiously)
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["image.tmdb.org"],
  },
};

export default nextConfig;
