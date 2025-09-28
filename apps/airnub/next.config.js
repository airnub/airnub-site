const { defineMonorepoNextConfig } = require("../../next.shared-config.js");
const withNextIntl = require("next-intl/plugin")("./i18n/request.ts");

const baseConfig = defineMonorepoNextConfig(__dirname, {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
});

module.exports = withNextIntl(baseConfig);
