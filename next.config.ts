import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets another device on the local network (e.g. a phone or TV for responsive
  // testing) load the dev server from this computer's IP address.
  allowedDevOrigins: ["192.168.1.12"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
