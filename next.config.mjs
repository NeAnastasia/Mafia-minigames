/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Статический экспорт для GitHub Pages
  trailingSlash: true, // Добавляет `/` в конце URL (рекомендуется для GitHub Pages)
  images: {
    unoptimized: true, // Отключает оптимизацию изображений (иначе могут быть проблемы)
  },
};

export default nextConfig;