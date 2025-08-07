// utils/cookies.js
export function parseCookies(req) {
  const cookies = {};
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      cookies[name] = decodeURIComponent(value);
    });
  }
  return cookies;
}

export function getClientCookies() {
  if (typeof document === 'undefined') return {};
  
  const cookies = {};
  document.cookie.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    cookies[name] = decodeURIComponent(value);
  });
  return cookies;
}