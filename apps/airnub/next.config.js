const { defineMonorepoNextConfig } = require("../../next.shared-config.js");

const config = defineMonorepoNextConfig(__dirname, {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
});

module.exports = config;
