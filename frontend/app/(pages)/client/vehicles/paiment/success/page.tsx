'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { executePayment } from '@/app/api/PayPal/executePayment';

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const finalizePayment = async () => {
      const paymentId = searchParams.get('paymentId');
      const payerId = searchParams.get('PayerID');

      if (paymentId && payerId) {
        try {
          const result = await executePayment(paymentId, payerId);
          console.log('Détails du paiement :', result);
          if (result.status === 'success') {
            setSuccess(true);
          } else {
            setError(result.message || 'Une erreur est survenue lors de la finalisation du paiement.');
          }
        } catch (err) {
          console.error('Erreur lors de la finalisation du paiement:', err);
          setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue lors de la finalisation du paiement.');
        } finally {
          setLoading(false);
        }
      } else {
        setError('Paramètres manquants dans l\'URL.');
        setLoading(false);
      }
    };

    finalizePayment();
  }, [searchParams]);

  if (loading) {
    return <div className="text-center p-4">Chargement en cours...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center p-4">{error}</div>;
  }

  if (success) {
    return (
      <div className="text-green-600 text-center p-4">
        <h1 className="text-2xl font-bold mb-2">Paiement Réussi 🎉</h1>
        <p>Merci pour votre achat !</p>
      </div>
    );
  }

  return null;
};

export default PaymentSuccess;

