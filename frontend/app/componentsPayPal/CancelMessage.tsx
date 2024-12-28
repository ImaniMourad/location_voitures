"use client"
import { useRouter } from 'next/navigation';

const CancelMessage = () => {
  const router = useRouter();

  const handleBackToShop = () => {
    // Redirige l'utilisateur vers la page principale ou la page de réservation
    router.push('/client/vehicles');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 text-yellow-800">
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Paiement Annulé ❌</h1>
        <p className="mb-6">
          Le paiement a été annulé. Si vous avez changé d'avis, vous pouvez recommencer le processus de paiement.
        </p>
        <button
          onClick={handleBackToShop}
          className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
        >
          Retour à la réservation
        </button>
      </div>
    </div>
  );
};

export default CancelMessage;
