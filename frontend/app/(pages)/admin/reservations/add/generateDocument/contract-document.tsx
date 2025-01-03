import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";

interface ContractData {
  companyName: string;
  contractNumber: string;
  creationDate: string;
  rentalPeriod: {
    start: string;
    end: string;
  };
  client: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  vehicle: {
    plateNumber: string;
    brand: string;
    model: string;
    color: string;
    year: string;
  };
  financialDetails: {
    pricePerDay: number;
    totalDays: number;
    totalAmount: number;
    deposit: number;
  };
}

const contractData: ContractData = {
  companyName: "LocationAuto",
  contractNumber: "12345",
  creationDate: new Date().toLocaleDateString(),
  rentalPeriod: {
    start: "01/01/2024",
    end: "10/01/2024",
  },
  client: {
    name: "Anas Ichmawin",
    address: "123 Rue de l'ENSAM, Khouribga, Maroc",
    phone: "+212600000000",
    email: "anas@example.com",
  },
  vehicle: {
    plateNumber: "ABC-123",
    brand: "Toyota",
    model: "Corolla",
    color: "Gris",
    year: "2023",
  },
  financialDetails: {
    pricePerDay: 200,
    totalDays: 10,
    totalAmount: 2000,
    deposit: 500,
  },
};

const rulesText = `
1. Le locataire est responsable de tout dommage causé au véhicule pendant la période de location.
2. Le véhicule doit être retourné dans l'état initial, propre et sans dommages.
3. La caution sera remboursée dans un délai de 7 jours après la fin de la location, sous réserve d'inspection du véhicule.
4. Tout dépassement de la période de location entraînera des frais supplémentaires de 250 MAD par jour.
5. Le locataire doit posséder un permis de conduire valide et fournir une pièce d'identité.
6. La consommation de carburant est à la charge du locataire.
7. En cas de panne ou d'accident, le locataire doit immédiatement informer la société et suivre les procédures indiquées.
`;

const generateContract = async () => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 900]);

  const { width, height } = page.getSize();
  const fontSize = 12;
  const margin = 50;

  // Titre et informations de base
  page.drawText(contractData.companyName, {
    x: margin,
    y: height - margin - 10,
    size: 18,
    color: rgb(0, 0, 0),
    font: await pdfDoc.embedFont("Helvetica-Bold"),
  });

  page.drawText("CONTRAT DE LOCATION DE VOITURE", {
    x: margin,
    y: height - margin - 40,
    size: 16,
    color: rgb(0.2, 0.2, 0.8),
    font: await pdfDoc.embedFont("Helvetica-Bold"),
  });

  page.drawLine({
    start: { x: margin, y: height - margin - 60 },
    end: { x: width - margin, y: height - margin - 60 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  // Informations du contrat
  const contractHeader = `
    Contrat n°: ${contractData.contractNumber}
    Date de création: ${contractData.creationDate}
    Période de location: ${contractData.rentalPeriod.start} au ${contractData.rentalPeriod.end}
  `;
  
  page.drawText(contractHeader, {
    x: margin,
    y: height - margin - 100,
    size: fontSize,
    color: rgb(0, 0, 0),
    font: await pdfDoc.embedFont("Helvetica"),
  });

  // Texte descriptif (avec un espace plus grand entre les paragraphes)
  const contractText = `
    Ce contrat de location de voiture est établi entre la société ${contractData.companyName}, ci-après dénommée "le Loueur", et ${contractData.client.name}, ci-après dénommé "le Locataire".
    Le contrat porte le numéro ${contractData.contractNumber} et a été créé le ${contractData.creationDate}.
    La période de location commence le ${contractData.rentalPeriod.start} et se termine le ${contractData.rentalPeriod.end}.
    Le véhicule loué est une ${contractData.vehicle.brand} ${contractData.vehicle.model} de couleur ${contractData.vehicle.color}, immatriculée ${contractData.vehicle.plateNumber} et de l'année ${contractData.vehicle.year}.
    Le Locataire, dont l'adresse est ${contractData.client.address}, peut être contacté par téléphone au ${contractData.client.phone} ou par email à ${contractData.client.email}.
    En ce qui concerne les détails financiers :
    - Le prix de location est de ${contractData.financialDetails.pricePerDay} MAD par jour.
    - Le nombre total de jours de location est de ${contractData.financialDetails.totalDays}.
    - Le montant total de la location s'élève à ${contractData.financialDetails.totalAmount} MAD.
    - Une caution de ${contractData.financialDetails.deposit} MAD est requise et sera remboursée sous réserve d'inspection du véhicule à la fin de la location.
    Le Locataire s'engage à respecter les règles et conditions suivantes :
    ${rulesText}
  `;

  page.drawText(contractText, {
    x: margin,
    y: height - margin - 250,
    size: fontSize,
    color: rgb(0, 0, 0),
    font: await pdfDoc.embedFont("Helvetica"),
    maxWidth: width - 2 * margin, // Limite la largeur pour éviter de dépasser
    lineHeight: 15, // Définit l'espacement des lignes
  });

  // Ajouter la ligne pour la signature
  page.drawText("Signature du Locataire: ___________________", {
    x: 50,
    y: 100, // Position pour la signature
    size: fontSize,
    color: rgb(0, 0, 0),
  });


  // Sauvegarde du PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  saveAs(blob, `contract-${contractData.client.name}.pdf`);
};

export default generateContract;
