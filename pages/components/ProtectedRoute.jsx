import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (response.ok) {
          if (adminOnly && !data.is_admin) {
            router.push('/unauthorized');
          } else {
            setUser(data);
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, adminOnly]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return user ? children : null;
}