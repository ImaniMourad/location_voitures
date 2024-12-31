import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";

interface InvoiceData {
  id: string;
  date: string;
  client: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  items: {
    licensePlate: string;
    price: number;
    days: number;
    total: number;
  }[];
  payment: {
    method: string;
  };
  total: number;
}

const generatePDF = async ({ invoiceData }: { invoiceData: InvoiceData }) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const { width, height } = page.getSize();

  // Constants for margins and positioning
  const leftMargin = 50;
  const rightMargin = width - 50;
  const rightColumnX = width - 200;

  // Fonts
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Colors
  const black = rgb(0, 0, 0);

  // Header
  page.drawText("LocApp Pro", {
    x: leftMargin,
    y: height - 50,
    size: 24,
    font: bold,
    color: black,
  });

  const invoiceText = "INVOICE";
  const invoiceWidth = bold.widthOfTextAtSize(invoiceText, 32);
  page.drawText(invoiceText, {
    x: rightMargin - invoiceWidth,
    y: height - 50,
    size: 32,
    font: bold,
    color: black,
  });

  // Draw line under header
  page.drawLine({
    start: { x: leftMargin, y: height - 70 },
    end: { x: rightMargin, y: height - 70 },
    thickness: 1,
    color: black,
  });

  // Invoice details (left-aligned)
  page.drawText(`Invoice No : ${invoiceData.id}`, {
    x: leftMargin,
    y: height - 100,
    size: 12,
    font: regular,
    color: black,
  });

  page.drawText(`Date : ${invoiceData.date}`, {
    x: leftMargin,
    y: height - 120,
    size: 12,
    font: regular,
    color: black,
  });

  // Client details (right-aligned)
  const clientNameWidth = bold.widthOfTextAtSize(invoiceData.client.name, 16);
  page.drawText(invoiceData.client.name, {
    x: rightMargin - clientNameWidth,
    y: height - 100,
    size: 16,
    font: bold,
    color: black,
  });

  const emailWidth = regular.widthOfTextAtSize(invoiceData.client.email, 12);
  page.drawText(invoiceData.client.email, {
    x: rightMargin - emailWidth,
    y: height - 120,
    size: 12,
    font: regular,
    color: black,
  });

  const addressWidth = regular.widthOfTextAtSize(invoiceData.client.address, 12);
  page.drawText(invoiceData.client.address, {
    x: rightMargin - addressWidth,
    y: height - 140,
    size: 12,
    font: regular,
    color: black,
  });

  // Table headers
  const tableTop = height - 200;
  const columnStarts = [
    leftMargin,                    // CARS
    leftMargin + 200,             // PRICE
    leftMargin + 320,             // NUMBER OF DAYS (adjusted for extra space)
    rightMargin - 100,            // TOTAL
  ];

  const headers = ["CARS", "PRICE", "NUMBER OF DAYS", "TOTAL"];
  
  // Draw line above headers
  page.drawLine({
    start: { x: leftMargin, y: tableTop + 15 },
    end: { x: rightMargin, y: tableTop + 15 },
    thickness: 1,
    color: black,
  });

  // Draw headers
  headers.forEach((header, i) => {
    const x = columnStarts[i];
    if (i === 2) { // Center align "NUMBER OF DAYS"
      const headerWidth = bold.widthOfTextAtSize(header, 12);
      page.drawText(header, {
        x: x - headerWidth / 2,
        y: tableTop,
        size: 12,
        font: bold,
        color: black,
      });
    } else if (i === 3) { // Right align "TOTAL"
      const headerWidth = bold.widthOfTextAtSize(header, 12);
      page.drawText(header, {
        x: rightMargin - headerWidth,
        y: tableTop,
        size: 12,
        font: bold,
        color: black,
      });
    } else {
      page.drawText(header, {
        x: x,
        y: tableTop,
        size: 12,
        font: bold,
        color: black,
      });
    }
  });

  // Draw line below headers
  page.drawLine({
    start: { x: leftMargin, y: tableTop - 10 },
    end: { x: rightMargin, y: tableTop - 10 },
    thickness: 1,
    color: black,
  });

  // Table content
  let currentY = tableTop - 30;
  invoiceData.items.forEach((item) => {
    // License plate (left-aligned)
    page.drawText(item.licensePlate, {
      x: columnStarts[0],
      y: currentY,
      size: 12,
      font: regular,
      color: black,
    });

    // Price (left-aligned with $)
    page.drawText(`${item.price}Dhs`, {
      x: columnStarts[1],
      y: currentY,
      size: 12,
      font: regular,
      color: black,
    });

    // Days (center-aligned)
    const daysText = item.days.toString();
    const daysWidth = regular.widthOfTextAtSize(daysText, 12);
    page.drawText(daysText, {
      x: columnStarts[2] - daysWidth / 2,
      y: currentY,
      size: 12,
      font: regular,
      color: black,
    });

    // Total (right-aligned)
    const totalText = `${item.total}Dhs`;
    const totalWidth = regular.widthOfTextAtSize(totalText, 12);
    page.drawText(totalText, {
      x: rightMargin - totalWidth,
      y: currentY,
      size: 12,
      font: regular,
      color: black,
    });

    currentY -= 30;
  });

  // Draw line after table content
  page.drawLine({
    start: { x: leftMargin, y: currentY + 15 },
    end: { x: rightMargin, y: currentY + 15 },
    thickness: 1,
    color: black,
  });

  // Payment details (left-aligned)
  currentY -= 30;
  page.drawText("Payment Method :", {
    x: leftMargin,
    y: currentY,
    size: 14,
    font: bold,
    color: black,
  });

  currentY -= 20;
  page.drawText(`Bank Name: ${invoiceData.payment.method}`, {
    x: leftMargin,
    y: currentY,
    size: 12,
    font: regular,
    color: black,
  });

  // Total (right-aligned)
  const totalY = currentY;
  const totalLabel = "Total :";
  const totalValue = `${invoiceData.total}Dhs`;

  const labelWidth = bold.widthOfTextAtSize(totalLabel, 12);
  const valueWidth = regular.widthOfTextAtSize(totalValue, 12);

  // Draw label
  page.drawText(totalLabel, {
    x: rightMargin - valueWidth - labelWidth - 20,
    y: totalY + 40,
    size: 12,
    font: bold,
    color: black,
  });

  // Draw value
  page.drawText(totalValue, {
    x: rightMargin - valueWidth,
    y: totalY + 40,
    size: 12,
    font: regular,
    color: black,
  });

  // Thank you message
  currentY -= 60;
  page.drawText("Thank you for purchase!", {
    x: leftMargin,
    y: currentY,
    size: 14,
    font: bold,
    color: black,
  });

  // Contact information
  currentY -= 40;
  page.drawText("Contact Us", {
    x: leftMargin,
    y: currentY,
    size: 14,
    font: bold,
    color: black,
  });

  currentY -= 20;
  page.drawText("oamaformation@gmail.com", {
    x: leftMargin,
    y: currentY,
    size: 12,
    font: regular,
    color: black,
  });

  // Administrator signature (right-aligned)
  const adminText = "Administrator";
  const adminWidth = regular.widthOfTextAtSize(adminText, 12);
  page.drawText(adminText, {
    x: rightMargin - adminWidth,
    y: currentY,
    size: 12,
    font: regular,
    color: black,
  });

  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  saveAs(blob, `invoice-${invoiceData.client.name}.pdf`);
};

export default generatePDF;
