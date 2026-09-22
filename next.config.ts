import type { NextConfig } from "next";

const basePath = process.env.GITHUB_ACTIONS ? "/sherlock" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  // next/image with images.unoptimized does not auto-prefix basePath for
  // string srcs — Logo.tsx reads this to build correct asset URLs on Pages.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
};

export default nextConfig;
