import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  async redirects() {
    return []
  },
  async rewrites() {
    return []
  },
  // assetPrefix: process.env.APP_URL,
  basePath: "",
}

export default nextConfig
