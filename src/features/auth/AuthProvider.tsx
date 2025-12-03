// Ruta: src/features/auth/AuthProvider.tsx
import { useEffect } from 'react';
import { useAuthStore } from './store';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Check si hay un usuario mock en localStorage
    const checkSession = async () => {
      try {
        setLoading(true);
        const mockUser = localStorage.getItem('mock-user');
        
        if (mockUser) {
          setUser(JSON.parse(mockUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [setUser, setLoading]);

  return <>{children}</>;
}