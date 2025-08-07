/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: true,
  },
  images: {
    unoptimized: true, // Отключаем оптимизацию изображений для Netlify
  },
};

export default nextConfig;
