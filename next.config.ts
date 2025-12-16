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

      // Facebook CDN (Past Events photo grid)
      {
        protocol: "https",
        hostname: "scontent.xx.fbcdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent-iad3-1.xx.fbcdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent-iad3-2.xx.fbcdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent-iad3-3.xx.fbcdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent-iad3-4.xx.fbcdn.net",
        pathname: "/**",
      },
    ],
  },

  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
