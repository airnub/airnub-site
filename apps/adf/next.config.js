const { defineMonorepoNextConfig } = require("../../next.shared-config.js");
const withNextIntl = require("next-intl/plugin")("./app/i18n/request.ts");

const baseConfig = defineMonorepoNextConfig(__dirname);

module.exports = withNextIntl(baseConfig);
