export const getBaseUrl = () => {
  // В production используем переменную окружения
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // В development используем localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // В браузере используем текущий origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Fallback для SSR
  return process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
};