"use client";
import { useRouter } from 'next/navigation';
import { createPayment } from '../api/PayPal/createPayment';
import { Button } from '@/components/ui/button';


interface PayPalButtonProps {
  idReservation: number;
  price: number;
}

const PayPalButton = ({ idReservation, price }: PayPalButtonProps) => {
  const router = useRouter();

  const handlePayment = async () => {
    try {
      // Appelle l'API pour initier le paiement
      const response = await createPayment(idReservation, price);

      if (response && response.approvalUrl) {
        // Redirige l'utilisateur vers l'URL d'approbation de PayPal
        window.location.href = response.approvalUrl;
      } else {
        console.error('Erreur : URL dapprobation manquante dans la réponse.');
        alert('Une erreur est survenue lors de la création du paiement.');
      }
    } catch (error) {
      console.error('Erreur lors de la création du paiement :', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <Button
      onClick={handlePayment}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
    >
      Pay with PayPal
    </Button>
  );
};

export default PayPalButton;
