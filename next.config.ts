import type { NextConfig } from "next";

const nextConfig: NextConfig = {
reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // Ignoring TypeScript errors during build
    // Only do this if you're absolutely sure it's necessary
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignoring ESLint errors during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
