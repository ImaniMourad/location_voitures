export const createPayment = async () => {
    try {
      const response = await fetch('http://localhost:8081/paypal/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Échec de lappel API.');
      }
  
      return response.json(); // Renvoie l'objet contenant `approvalUrl`
    } catch (error) {
      console.error('Erreur lors de lappel à lAPI PayPal :', error);
      throw error;
    }
  };
  