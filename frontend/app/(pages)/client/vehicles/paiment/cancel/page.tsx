'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alerted";
import { XCircle, ArrowLeft, RefreshCcw } from "lucide-react";

const PaymentCancel = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
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
  }, [router]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950">
      <Card className="w-full max-w-md mx-4 bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-white flex items-center justify-center gap-2">
            <XCircle className="h-6 w-6 text-red-400" />
            Paiement Annulé
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive" className="bg-red-900/30 border-red-800">
            <AlertTitle className="text-red-200">Transaction interrompue</AlertTitle>
            <AlertDescription className="text-red-300">
              Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour au paiement
              </button>
              <button
                onClick={() => router.push('http://localhost:3000/client')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                <RefreshCcw className="h-4 w-4" />
                Page principale
              </button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-slate-400 text-sm">
                Redirection automatique dans 
                <span className="inline-block animate-bounce mx-1 font-medium">
                  {countdown}
                </span> 
                secondes...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancel;