// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost", "trapculturefeed.vercel.app", "trap-culture-app.vercel.app"]
    }
  }
};

export default nextConfig;
