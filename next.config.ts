import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "1000mb"
    }
  },
  env: {
    BASE_API_URL: "http://34.87.136.52:8081/api/v1",
  },
    images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "34.87.136.52",
        pathname: "/**",
      },
    ],
  },
  output: "standalone",

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://35.209.164.72:8081/api/:path*",
      },
    ];
  },
};

export default nextConfig;
