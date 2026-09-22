import type { NextConfig } from "next";

const basePath = process.env.GITHUB_ACTIONS ? "/sherlock" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: {
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
};

export default nextConfig;
