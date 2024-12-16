// hooks/useAuth.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          console.error('User is not authenticated');
          setIsAuthenticated(false);
          router.push('/signin'); // Redirect to login page if token is not found
          return;
        }
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
        router.push('/signin'); // Redirect to login page if token is invalid
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  return { isAuthenticated, loading };
};

export default useAuth;
