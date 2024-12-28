"use client";
import { useRouter } from 'next/navigation';

const SuccessMessage = () => {
  const router = useRouter();

  const handleBackToDashboard = () => {
    // Redirige l'utilisateur vers le tableau de bord ou une autre page pertinente
    router.push('/client/profile');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-green-800">
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Paiement Réussi 🎉</h1>
        <p className="mb-6">
          Votre paiement a été traité avec succès. Merci de votre confiance !
        </p>
        <button
          onClick={handleBackToDashboard}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Retour au tableau de bord
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;
