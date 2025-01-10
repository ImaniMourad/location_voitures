export const executePayment = async (paymentId: string, payerId: string, idreservation: string) => {
  try {
    if (!paymentId || !payerId) {
      throw new Error("Les paramètres 'paymentId' ou 'payerId' sont manquants.");
    }    
    const response = await fetch(
      `http://localhost:8081/paypal/success?paymentId=${paymentId}&PayerID=${payerId}&idreservation=${idreservation}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Échec de l'exécution du paiement.");
    }

    return response.json();
  } catch (error) {
    console.error("Erreur lors de l'exécution du paiement :", error);
    throw error;
  }
};