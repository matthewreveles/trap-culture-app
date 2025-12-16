// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
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
      // Facebook CDN (fbcdn / xx.fbcdn.net variants)
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
        hostname: "scontent.xx.fbcdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lookaside.facebook.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
        pathname: "/**",
      },
    ],
  },

  // Next 16 moved this out of experimental
  typedRoutes: true,
};

export default nextConfig;
