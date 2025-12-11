// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    // Allow optimized images from our main external hosts.
    remotePatterns: [
      // Shopify product images
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
      // Trap Culture WordPress uploads
      {
        protocol: "https",
        hostname: "trapcultureaz.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.trapcultureaz.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },

  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
