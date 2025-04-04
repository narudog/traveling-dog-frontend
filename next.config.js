const nextConfig = {
  output: "standalone",
  sassOptions: {
    sourceMap: true,
  },
  /* config options here */
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
