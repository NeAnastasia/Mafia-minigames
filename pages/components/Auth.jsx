import { useState } from 'react';
import { useRouter } from 'next/router';
import { getBaseUrl } from '@/utils/api';

export default function LoginForm() {
  const [gameId, setGameId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${getBaseUrl()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_id: gameId, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xs p-8 bg-white rounded-lg border mt-4 d-flex flex-column justify-content-center">
      <h2 className="text-xl font-semibold mb-6 text-center">Вход</h2>
      
      {error && (
        <div className="mb-4 p-2 text-sm text-red-600 text-center">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
            placeholder="Game ID"
            required
          />
        </div>
        
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
            placeholder="Пароль"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  );
}