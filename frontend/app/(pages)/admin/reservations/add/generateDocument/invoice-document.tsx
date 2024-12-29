import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { formatDate } from '../../../../../../lib/dateFormatter';

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
  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();

  // Colors
  const primaryColor = rgb(0.2, 0.4, 0.6); // Attractive blue
  const secondaryColor = rgb(0.95, 0.95, 0.95); // Light gray
  const textColor = rgb(0.2, 0.2, 0.2); // Dark gray

  // Fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Header
  page.drawRectangle({
    x: 0,
    y: height - 120,
    width: width,
    height: 120,
    color: primaryColor,
  });

  // Logo (placeholder)
  page.drawRectangle({
    x: 20,
    y: height - 100,
    width: 80,
    height: 80,
    color: rgb(1, 1, 1),
  });

  page.drawText('Your Company', {
    x: 120,
    y: height - 60,
    size: 24,
    font: boldFont,
    color: rgb(1, 1, 1),
  });

  // Invoice details
  page.drawText('INVOICE', {
    x: width - 150,
    y: height - 50,
    size: 24,
    font: boldFont,
    color: rgb(1, 1, 1),
  });

  page.drawText(`#${reservationData.id}`, {
    x: width - 150,
    y: height - 80,
    size: 16,
    font: font,
    color: rgb(1, 1, 1),
  });

  // Client and reservation details
  const detailsStart = height - 180;
  const detailsGap = 30;

  page.drawText('Bill To:', {
    x: 40,
    y: detailsStart,
    size: 14,
    font: boldFont,
    color: textColor,
  });

  page.drawText(reservationData.client, {
    x: 40,
    y: detailsStart - detailsGap,
    size: 12,
    font: font,
    color: textColor,
  });

  page.drawText('Reservation Details:', {
    x: width / 2,
    y: detailsStart,
    size: 14,
    font: boldFont,
    color: textColor,
  });

  const reservationDetails = [
    `Vehicle: ${reservationData.vehicle}`,
    `Start Date: ${formatDate(reservationData.startDate)}`,
    `End Date: ${formatDate(reservationData.endDate)}`,
  ];

  reservationDetails.forEach((detail, index) => {
    page.drawText(detail, {
      x: width / 2,
      y: detailsStart - (index + 1) * detailsGap,
      size: 12,
      font: font,
      color: textColor,
    });
  });

  // Total amount
  page.drawRectangle({
    x: width - 200,
    y: detailsStart - 4 * detailsGap,
    width: 160,
    height: 40,
    color: secondaryColor,
  });

  page.drawText('Total Amount:', {
    x: width - 190,
    y: detailsStart - 3 * detailsGap - 10,
    size: 14,
    font: boldFont,
    color: textColor,
  });

  page.drawText(`$${reservationData.price}`, {
    x: width - 100,
    y: detailsStart - 3 * detailsGap - 10,
    size: 14,
    font: boldFont,
    color: textColor,
  });

  // Footer
  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: 60,
    color: primaryColor,
  });

  page.drawText('Thank you for your business!', {
    x: width / 2 - 100,
    y: 25,
    size: 16,
    font: boldFont,
    color: rgb(1, 1, 1),
  });

  // Save and download the PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, 'modern_invoice.pdf');
};

export default generatePDF;

