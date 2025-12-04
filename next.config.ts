import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost"],
  },
  experimental: {
    serverMinification: false,
    useCache: true,
  },
};

export default nextConfig;
