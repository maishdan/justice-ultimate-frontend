// src/components/ReceiptGenerator.tsx
import jsPDF from "jspdf";
import { Button } from "../components/ui/button";
// Add QR code generation
// @ts-ignore
import QRCode from "qrcode";
import axios from 'axios';

const COMPANY_LOGO = "https://tyypdmhxuehzddudeuww.supabase.co/storage/v1/object/public/avatars//logo.png";
const COURT_LOGO = "https://tyypdmhxuehzddudeuww.supabase.co/storage/v1/object/public/avatars//kenyan%20coat%20of%20arms.png";
const COMPANY_NAME = "Justice Ultimate Automobiles";
const COMPANY_CONTACT = "07222827458 | justiceultimateautomobiles@gmail.com";
const COMPANY_FOOTER = "Justice Ultimate Automobiles 2025 : your trusted car masters";

interface ReceiptProps {
  name: string;
  carName: string;
  amount: number;
  stockId: string;
}

export const ReceiptGenerator = ({ name, carName, amount, stockId }: ReceiptProps) => {
  const generatePDF = async () => {
    const doc = new jsPDF();
    // Add logos
    const companyLogo = await toDataUrl(COMPANY_LOGO);
    const courtLogo = await toDataUrl(COURT_LOGO);
    doc.addImage(courtLogo, 'PNG', 15, 10, 25, 25);
    doc.addImage(companyLogo, 'PNG', 170, 10, 25, 25);
    // Header
    doc.setFontSize(18);
    doc.text(COMPANY_NAME, 70, 25);
    doc.setFontSize(11);
    doc.text(COMPANY_CONTACT, 70, 32);
    doc.setLineWidth(0.5);
    doc.line(15, 38, 195, 38);
    // Receipt details
    doc.setFontSize(13);
    doc.text(`Official Receipt`, 15, 48);
    doc.setFontSize(11);
    doc.text(`Receipt No: ${stockId}`, 15, 56);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 62);
    doc.text(`Customer: ${name}`, 15, 68);
    doc.text(`Car: ${carName}`, 15, 74);
    doc.text(`Total Paid: KES ${amount.toLocaleString()}`, 15, 80);
    // QR code
    const qrData = `https://justiceultimate.com/verify-receipt/${stockId}`;
    const qrUrl = await QRCode.toDataURL(qrData);
    doc.addImage(qrUrl, 'PNG', 160, 60, 30, 30);
    doc.setFontSize(10);
    doc.text('Scan to verify', 160, 95);
    // Watermark
    doc.setTextColor(220, 220, 220);
    doc.setFontSize(40);
    doc.text(COMPANY_NAME, 35, 150, { angle: 30 });
    doc.setTextColor(0, 0, 0);
    // Signature area
    doc.setFontSize(11);
    doc.text('Authorized Signature:', 15, 120);
    doc.line(60, 120, 120, 120);
    // Footer
    doc.setFontSize(10);
    doc.text(COMPANY_FOOTER, 15, 285);
    doc.text(COMPANY_CONTACT, 15, 292);
    doc.save(`Receipt_${stockId}.pdf`);
  };

  const generatePDFBlob = async () => {
    const doc = new jsPDF();
    // Add logos, header, details, QR, watermark, signature, footer
    const companyLogo = await toDataUrl(COMPANY_LOGO);
    const courtLogo = await toDataUrl(COURT_LOGO);
    doc.addImage(courtLogo, 'PNG', 15, 10, 25, 25);
    doc.addImage(companyLogo, 'PNG', 170, 10, 25, 25);
    doc.setFontSize(18);
    doc.text(COMPANY_NAME, 70, 25);
    doc.setFontSize(11);
    doc.text(COMPANY_CONTACT, 70, 32);
    doc.setLineWidth(0.5);
    doc.line(15, 38, 195, 38);
    doc.setFontSize(13);
    doc.text(`Official Receipt`, 15, 48);
    doc.setFontSize(11);
    doc.text(`Receipt No: ${stockId}`, 15, 56);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 62);
    doc.text(`Customer: ${name}`, 15, 68);
    doc.text(`Car: ${carName}`, 15, 74);
    doc.text(`Total Paid: KES ${amount.toLocaleString()}`, 15, 80);
    const qrData = `https://justiceultimate.com/verify-receipt/${stockId}`;
    const qrUrl = await QRCode.toDataURL(qrData);
    doc.addImage(qrUrl, 'PNG', 160, 60, 30, 30);
    doc.setFontSize(10);
    doc.text('Scan to verify', 160, 95);
    doc.setTextColor(220, 220, 220);
    doc.setFontSize(40);
    doc.text(COMPANY_NAME, 35, 150, { angle: 30 });
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text('Authorized Signature:', 15, 120);
    doc.line(60, 120, 120, 120);
    doc.setFontSize(10);
    doc.text(COMPANY_FOOTER, 15, 285);
    doc.text(COMPANY_CONTACT, 15, 292);
    return doc.output('arraybuffer');
  };

  const sendReceiptEmail = async (recipient: string) => {
    try {
      const pdfBuffer = await generatePDFBlob();
      const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)));
      const subject = 'Your Official Receipt – Justice Ultimate Automobiles';
      const html = `<div style="font-family:sans-serif;padding:24px;"><h2>Justice Ultimate Automobiles</h2><p>Dear ${name},<br/>Thank you for your business. Please find your official receipt attached.<br/><br/>Best regards,<br/>Justice Ultimate Automobiles Team</p></div>`;
      let url = 'http://localhost:5001/send-receipt';
      if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        url = 'https://backend-jua.onrender.com/send-receipt';
      }
      await axios.post(url, {
        to: recipient,
        subject,
        html,
        pdfBase64,
        filename: `Receipt_${stockId}.pdf`,
      });
      alert(`Receipt sent to ${recipient}`);
    } catch (err) {
      let errorMsg = 'Failed to send receipt';
      if (err instanceof Error) errorMsg = err.message;
      else if (typeof err === 'object' && err !== null && 'message' in err) errorMsg = (err as any).message;
      else if (typeof err === 'string') errorMsg = err;
      alert(errorMsg);
    }
  };

  // Helper to convert image URL to data URL
  const toDataUrl = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = function () {
        reject(new Error('Failed to load image: ' + url));
      };
      img.src = url;
    });
  };

  const ADMIN_EMAIL = 'justiceultimateautomobiles@gmail.com';
  const STAFF_EMAIL = 'staff@justiceultimate.com';
  const MECHANIC_EMAIL = 'mechanic@justiceultimate.com';

  return (
    <div>
    <Button onClick={generatePDF} className="mt-4 w-full">
        Download Official Receipt
      </Button>
      <Button onClick={() => {
        sendReceiptEmail(ADMIN_EMAIL);
        sendReceiptEmail(STAFF_EMAIL);
        sendReceiptEmail(MECHANIC_EMAIL);
        // For demo, also send to customer (replace with real email in production)
        sendReceiptEmail('customer@example.com');
      }} className="mt-2 w-full bg-green-700 hover:bg-green-800 text-white">
        Send Receipt by Email
    </Button>
    </div>
  );
};
