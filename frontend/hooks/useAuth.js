import { useState, useEffect } from "react";
import axios from "axios";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const verifyToken = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.post(`${apiUrl}/auth/verify-token`, {
        token,
      });

      if (response.data.isValid) {
        setIsAuthenticated(true);
        console.log("Token vérifié:");
      } else {
        setIsAuthenticated(false);
        console.log("Token invalide");
      }
    } catch (error) {
      console.error("Erreur de vérification du token", error);
      setIsAuthenticated(false);
      console.log("Token invalide");
    } // <-- Missing closing brace added here
  };

  useEffect(() => {
    // Récupérer le token du stockage local
    const token = localStorage.getItem("jwtToken");
    console.log("Token récupéré:", token);
    if (token) {
      console.log("Vérification du token...");
      verifyToken(token);
    }
  }, []);

  return { isAuthenticated };
};

export default useAuth;
