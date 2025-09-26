const tailwindPlugin = (() => {
  try {
    require.resolve("@tailwindcss/postcss");
    return "@tailwindcss/postcss";
  } catch (error) {
    return "tailwindcss";
  }
})();

module.exports = {
  plugins: {
    [tailwindPlugin]: {},
    autoprefixer: {},
  },
};
