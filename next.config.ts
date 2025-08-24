import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
        BASE_API_URL: "http://localhost:8090/api/v1",
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "20mb",
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                pathname: "/**",
            },
        ],
    },
    output: "standalone",

    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:8090/api/:path*",
            },
        ];
    },
};

export default nextConfig;
