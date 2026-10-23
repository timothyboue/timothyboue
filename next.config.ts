import type { NextConfig } from "next";
import imageWidths from "./lib/imageWidths.json";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    loader: "custom",
    loaderFile: "./lib/sanityImageLoader.ts",
    deviceSizes: imageWidths,
    imageSizes: [],
  },
};

export default nextConfig;
