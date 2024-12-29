import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';

const generatePDF = async () => {

  const reservationData = {
    id: '1',
    client: 'John Doe',
    vehicle: 'Toyota Corolla',
    startDate: '2021-11-01',
    endDate: '2021-11-07',
    price: '500',
  };
  
  
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const { width, height } = page.getSize();
  const fontSize = 20;

  page.drawText(`Invoice ID: ${reservationData.id}`, {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Client: ${reservationData.client}`, {
    x: 50,
    y: height - 6 * fontSize,
    size: fontSize,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Vehicle: ${reservationData.vehicle}`, {
    x: 50,
    y: height - 8 * fontSize,
    size: fontSize,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Start Date: ${reservationData.startDate}`, {
    x: 50,
    y: height - 10 * fontSize,
    size: fontSize,
    color: rgb(0, 0, 0),
  });
  page.drawText(`End Date: ${reservationData.endDate}`, {
    x: 50,
    y: height - 12 * fontSize,
    size: fontSize,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Price: $${reservationData.price}`, {
    x: 50,
    y: height - 14 * fontSize,
    size: fontSize,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, 'invoice.pdf');
};

export default generatePDF;