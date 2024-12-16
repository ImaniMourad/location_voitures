import { useRouter } from 'next/navigation';
import useAuth from '../hooks/useAuth';
import Spinner from './ui/spinner';

import { ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <Spinner />; // Afficher un spinner pendant le chargement
  }

  if (!isAuthenticated) {
    router.push('/signin'); // Rediriger vers la page de connexion si non authentifié
    return null;
  }

  return children; // Renvoie les enfants seulement si authentifié
};

export default ProtectedRoute;
