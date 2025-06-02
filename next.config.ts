import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  // output: "standalone",
  async redirects() {
    return []
  },
  // remove in the production build
  eslint: {
    ignoreDuringBuilds: true,
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
        hostname: "hs-media.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sblglobal.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
