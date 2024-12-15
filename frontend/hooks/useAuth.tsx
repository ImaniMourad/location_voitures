import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import jwtDecode from 'jwt-decode';

interface DecodedToken {
  exp: number;
  // Ajoutez d'autres propriétés du token décodé si nécessaire
}

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        if (typeof token === "string" && token.trim() !== "") {
          const decodedToken = jwtDecode<DecodedToken>(token);
          console.log("Decoded Token:", decodedToken);

          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            console.warn("Token has expired");
            localStorage.removeItem('jwtToken');
            setIsAuthenticated(false);
            router.push('/signin');
          } else {
            setIsAuthenticated(true);
          }
        } else {
          console.error("Invalid token format:", token);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [router]);

  return isAuthenticated;
};

export default useAuth;