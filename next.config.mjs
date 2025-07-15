/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Статический экспорт для GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/Mafia-minigames' : '', // Указывает имя репозитория
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Mafia-minigames/' : '', // Для корректных путей к CSS/JS/изображениям
  trailingSlash: true, // Добавляет `/` в конце URL (рекомендуется для GitHub Pages)
  images: {
    unoptimized: true, // Отключает оптимизацию изображений (иначе могут быть проблемы)
  },
};

export default nextConfig;