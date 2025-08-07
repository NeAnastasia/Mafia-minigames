/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: "/api/:path*",
    },
  ],

  images: {
    domains: ["api.vk.com"],
  },
};

export default nextConfig;
