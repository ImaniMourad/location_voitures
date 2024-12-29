import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";

interface InvoiceItem {
  name: string;
  price: number;
  days: number;
  total: number;
}

const generatePDF = async () => {
  // Sample data matching the image
  const invoiceData = {
    id: "0000-123-456",
    date: "November 12, 2021",
    client: {
      name: "JULIANA SILVA",
      email: "hello@reallygreatsite.com",
      address: "123 Anywhere St., Any City, ST 12345",
      phone: "+123-456-7890",
    },
    items: [
      { name: "Storybook", price: 120, days: 2, total: 240 },
      { name: "Magazine", price: 100, days: 4, total: 400 },
      { name: "Notebooks", price: 120, days: 2, total: 240 },
      { name: "Comic", price: 130, days: 3, total: 390 },
      { name: "Novel", price: 120, days: 2, total: 240 },
    ],
    payment: {
      bankName: "Francisco Andrade",
      accountNo: "1234567890",
    },
    subtotal: 1735,
    tax: 55,
    total: 1680,
  };

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const { width, height } = page.getSize();

  // Fonts
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Colors
  const black = rgb(0, 0, 0);
  const white = rgb(1, 1, 1);

  // Header
  page.drawText("LocApp Pro", {
    x: 50,
    y: height - 50,
    size: 24,
    font: bold,
    color: black,
  });

  page.drawText("INVOICE", {
    x: width - 200,
    y: height - 50,
    size: 32,
    font: bold,
    color: black,
  });

  // Draw line under header
  page.drawLine({
    start: { x: 50, y: height - 70 },
    end: { x: width - 50, y: height - 70 },
    thickness: 1,
    color: black,
  });

  // Invoice details
  page.drawText(`Invoice No : ${invoiceData.id}`, {
    x: 50,
    y: height - 100,
    size: 12,
    font: regular,
    color: black,
  });

  page.drawText(`Date : ${invoiceData.date}`, {
    x: 50,
    y: height - 120,
    size: 12,
    font: regular,
    color: black,
  });

  // Client details
  page.drawText(invoiceData.client.name, {
    x: width - 200,
    y: height - 100,
    size: 16,
    font: bold,
    color: black,
  });

  page.drawText(invoiceData.client.email, {
    x: width - 200,
    y: height - 120,
    size: 12,
    font: regular,
    color: black,
  });

  // Client details section - update the address drawing with text wrapping
  const addressText = invoiceData.client.address;
  const maxWidth = 180; // Set maximum width for text
  const fontSize = 12;
  const words = addressText.split(" ");
  let line = "";
  let yOffset = height - 140;

  words.forEach((word) => {
    const testLine = line + (line ? " " : "") + word;
    const textWidth = regular.widthOfTextAtSize(testLine, fontSize);

    if (textWidth > maxWidth && line !== "") {
      page.drawText(line, {
        x: width - 200,
        y: yOffset,
        size: fontSize,
        font: regular,
        color: black,
      });
      line = word;
      yOffset -= 15; // Move to next line
    } else {
      line = testLine;
    }
  });

  // Draw remaining text
  if (line) {
    page.drawText(line, {
      x: width - 200,
      y: yOffset,
      size: fontSize,
      font: regular,
      color: black,
    });
  }

  // Table headers
  const tableTop = height - 200;
  const headers = ["CARS", "PRICE", "NUMBER OF DAYS", "TOTAL"];
  const columnWidths = [200, 100, 150, 100];
  let currentX = 50;

  // Draw line before headers
  page.drawLine({
    start: { x: 50, y: tableTop + 15 },
    end: { x: width - 50, y: tableTop + 15 },
    thickness: 1,
    color: black,
  });

  headers.forEach((header, i) => {
    page.drawText(header, {
      x: currentX,
      y: tableTop,
      size: 12,
      font: bold,
      color: black,
    });
    currentX += columnWidths[i];
  });

  // Draw line after headers
  page.drawLine({
    start: { x: 50, y: tableTop - 10 },
    end: { x: width - 50, y: tableTop - 10 },
    thickness: 1,
    color: black,
  });

  // Table content
  let currentY = tableTop - 30;
  invoiceData.items.forEach((item) => {
    currentX = 50;
    page.drawText(item.name, {
      x: currentX,
      y: currentY,
      size: 12,
      font: regular,
      color: black,
    });

    page.drawText(`$${item.price}`, {
      x: currentX + columnWidths[0],
      y: currentY,
      size: 12,
      font: regular,
      color: black,
    });

    page.drawText(item.days.toString(), {
      x: currentX + columnWidths[0] + columnWidths[1] + columnWidths[2] / 2 - 5,
      y: currentY,
      size: 12,
      font: regular,
      color: black,
    });

    page.drawText(`$${item.total}`, {
      x: currentX + columnWidths[0] + columnWidths[1] + columnWidths[2],
      y: currentY,
      size: 12,
      font: regular,
      color: black,
    });

    currentY -= 30;
  });

  // Draw line after table content
  page.drawLine({
    start: { x: 50, y: currentY + 15 },
    end: { x: width - 50, y: currentY + 15 },
    thickness: 1,
    color: black,
  });

  // Payment details
  currentY -= 30;
  page.drawText("Payment Method :", {
    x: 50,
    y: currentY,
    size: 14,
    font: bold,
    color: black,
  });

  currentY -= 20;
  page.drawText(`Bank Name: ${invoiceData.payment.bankName}`, {
    x: 50,
    y: currentY,
    size: 12,
    font: regular,
    color: black,
  });

  currentY -= 20;
  page.drawText(`Account No : ${invoiceData.payment.accountNo}`, {
    x: 50,
    y: currentY,
    size: 12,
    font: regular,
    color: black,
  });

  // Totals
  page.drawText(`Sub-total :`, {
    x: width - 200,
    y: currentY + 40,
    size: 12,
    font: bold,
    color: black,
  });

  page.drawText(`$${invoiceData.subtotal}`, {
    x: width - 100,
    y: currentY + 40,
    size: 12,
    font: bold,
    color: black,
  });

  page.drawText(`Tax :`, {
    x: width - 200,
    y: currentY + 20,
    size: 12,
    font: bold,
    color: black,
  });

  page.drawText(`$${invoiceData.tax}`, {
    x: width - 100,
    y: currentY + 20,
    size: 12,
    font: bold,
    color: black,
  });

  page.drawText(`Total :`, {
    x: width - 200,
    y: currentY,
    size: 14,
    font: bold,
    color: black,
  });

  page.drawText(`$${invoiceData.total}`, {
    x: width - 100,
    y: currentY,
    size: 14,
    font: bold,
    color: black,
  });

  // Thank you message
  currentY -= 60;
  page.drawText("Thank you for purchase!", {
    x: 50,
    y: currentY,
    size: 14,
    font: bold,
    color: black,
  });

  // Contact information
  currentY -= 40;
  page.drawText("Contact Us", {
    x: 50,
    y: currentY,
    size: 14,
    font: bold,
    color: black,
  });

  currentY -= 20;
  page.drawText(invoiceData.client.phone, {
    x: 50,
    y: currentY,
    size: 12,
    font: regular,
    color: black,
  });

  currentY -= 20;
  page.drawText(invoiceData.client.email, {
    x: 50,
    y: currentY,
    size: 12,
    font: regular,
    color: black,
  });

  currentY -= 20;
  page.drawText(invoiceData.client.address, {
    x: 50,
    y: currentY,
    size: 12,
    font: regular,
    color: black,
  });

  // Administrator signature
  page.drawText("Administrator", {
    x: width - 150,
    y: currentY,
    size: 12,
    font: regular,
    color: black,
  });

  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  saveAs(blob, "invoice.pdf");
};

export default generatePDF;
