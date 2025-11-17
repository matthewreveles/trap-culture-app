// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "trapcultureaz.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.trapcultureaz.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
