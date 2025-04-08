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
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mhp-local.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
