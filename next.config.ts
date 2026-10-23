import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    loader: "custom",
    loaderFile: "./lib/sanityImageLoader.ts",
  },
};

export default nextConfig;
