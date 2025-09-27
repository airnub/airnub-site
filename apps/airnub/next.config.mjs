import { defineMonorepoNextConfig } from "../../next.shared-config.mjs";

const config = defineMonorepoNextConfig(import.meta, {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
});

export default config;
