const config = {
  experimental: {
    optimizePackageImports: ["@airnub/ui", "@airnub/brand", "@airnub/seo"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default config;
