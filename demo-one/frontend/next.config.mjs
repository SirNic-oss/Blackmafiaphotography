import path from "node:path";

const nextConfig = {
  outputFileTracingRoot: path.resolve("./"),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve("./");
    return config;
  },
};

export default nextConfig;
