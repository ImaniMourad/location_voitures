'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { executePayment } from '@/app/api/PayPal/executePayment';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alerted";
import { CheckCircle2, AlertCircle, Loader2,  Stars } from "lucide-react";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(10);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const finalizePayment = async () => {
      const paymentId = searchParams.get('paymentId');
      const payerId = searchParams.get('PayerID');
      const idReservation = searchParams.get('idreservation');

      if (paymentId && payerId && idReservation) {
        try {
          const result = await executePayment(paymentId, payerId, idReservation);
          console.log('Détails du paiement :', result);
          if (result.status === 'success') {
            setSuccess(true);
            setShowConfetti(true);
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

  useEffect(() => {
    if (success) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            router.push('http://localhost:3000/client');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [success, router]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950">

      <Card className="w-full max-w-md mx-4 bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-white">
            {loading ? 'Traitement du paiement' : success ? 'Paiement Réussi 🎉' : 'État du paiement'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                <div className="absolute inset-0 h-12 w-12 animate-ping opacity-20 bg-blue-500 rounded-full"></div>
              </div>
              <p className="text-slate-300">Finalisation de votre paiement en cours...</p>
            </div>
          ) : success ? (
            <div className="space-y-4">
              <Alert variant="default" className="border-green-600 bg-green-900/50">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <AlertTitle className="text-green-200">Paiement confirmé</AlertTitle>
                <AlertDescription className="text-green-300">
                  Votre transaction a été traitée avec succès.
                </AlertDescription>
              </Alert>
              <div className="text-center space-y-2">
                <p className="text-slate-300">
                  Merci pour votre confiance ! 
                </p>
                <p className="text-slate-400 animate-bounce">
                  Redirection dans {countdown} secondes...
                </p>
              </div>
            </div>
          ) : (
            <Alert variant="destructive" className="bg-red-900/50 border-red-800">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>Erreur de paiement</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;