import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    /* disable linting */
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
