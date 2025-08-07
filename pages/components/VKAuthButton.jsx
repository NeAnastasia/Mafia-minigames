import { useEffect, useState } from 'react';
import { Config, Auth } from '@vkid/sdk';

const VKAuthButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [challenge, setChallenge] = useState(null);
  
  // Генерация code_verifier (безопасная и простая)
  const generateCodeVerifier = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  // Генерация code_challenge
  const generateCodeChallenge = async (verifier) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  useEffect(() => {
    const setupAuth = async () => {
      try {
        const verifier = generateCodeVerifier();
        const challenge = await generateCodeChallenge(verifier);
        setChallenge(challenge);
        
        // Сохраняем verifier для последующего использования
        sessionStorage.setItem('vk_code_verifier', verifier);
        
        // Инициализация SDK с PKCE
        Config.init({
          app: process.env.NEXT_PUBLIC_VK_APP_ID,
          redirectUrl: process.env.NEXT_PUBLIC_VK_REDIRECT_URI,
          state: "your_unique_state",
          responseType: "code",
          codeChallenge: challenge,
          codeChallengeMethod: 'S256'
        });

      } catch (error) {
        console.error('VKID setup error:', error);
      }
    };

    setupAuth();
    
    // Обработчик событий авторизации
    const handleAuthEvent = (event) => {
      const { type, detail } = event.detail;
      
      if (type === 'code') {
        setIsLoading(true);
        const verifier = sessionStorage.getItem('vk_code_verifier');
        
        // Перенаправляем на сервер с кодом и verifier
        window.location.href = `/api/auth/vk?code=${detail.code}&state=${detail.state}&verifier=${encodeURIComponent(verifier)}`;
      }
      else if (type === 'error') {
        console.error('VK Auth error:', detail);
        setIsLoading(false);
      }
    };

    window.addEventListener('VKIDAuthEvent', handleAuthEvent);
    
    return () => {
      window.removeEventListener('VKIDAuthEvent', handleAuthEvent);
    };
  }, []);

  const handleLogin = () => {
    if (isLoading) return;
    setIsLoading(true);
    Auth.login();
  };

  return (
    <div>
      <div id="vk-auth-container" />
      <button 
        onClick={handleLogin} 
        disabled={isLoading}
        className="vk-auth-button"
      >
        {isLoading ? 'Загрузка...' : 'Войти через VK ID'}
      </button>
    </div>
  );
};

export default VKAuthButton;