// hooks/useAuth.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'; // Modifié ici

interface UserToken {
  user_type: 'Admin' | 'Client';
  email?: string;
  exp?: number;
}

type RoleType = 'Admin' | 'Client';

interface AuthHook {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isClient: boolean;
  loading: boolean;
  checkAccess: (requiredRole: RoleType) => boolean;
}

const useAuth = (): AuthHook => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          console.error('User is not authenticated');
          setIsAuthenticated(false);
          router.push('/signin');
          return;
        }

        // Décoder le token pour vérifier le rôle
        const decoded = jwtDecode<UserToken>(token); // Modifié ici
        setIsAdmin(decoded.user_type === 'Admin');
        setIsClient(decoded.user_type === 'Client');

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${apiUrl}/auth/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          console.log('User is authenticated');
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('User is not authenticated');
        setIsAuthenticated(false);
        setIsAdmin(false);
        setIsClient(false);
        router.push('/signin');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [router]);

  const checkAccess = (requiredRole: RoleType): boolean => {
    if (requiredRole === 'Admin' && !isAdmin) {
      router.push('/');
      return false;
    }
    if (requiredRole === 'Client' && !isClient) {
      router.push('/');
      return false;
    }
    return true;
  };

  return {
    isAuthenticated,
    isAdmin,
    isClient,
    loading,
    checkAccess
  };
};

export default useAuth;