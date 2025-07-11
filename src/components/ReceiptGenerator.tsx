// src/components/ReceiptGenerator.tsx
import jsPDF from "jspdf";
import { Button } from "../components/ui/button";

interface ReceiptProps {
  name: string;
  carName: string;
  amount: number;
  stockId: string;
}

export const ReceiptGenerator = ({ name, carName, amount, stockId }: ReceiptProps) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Justice Ultimate Automobiles", 20, 20);
    doc.setFontSize(12);
    doc.text(`Receipt for ${name}`, 20, 35);
    doc.text(`Car: ${carName}`, 20, 45);
    doc.text(`Stock ID: ${stockId}`, 20, 55);
    doc.text(`Total Paid: KES ${amount.toLocaleString()}`, 20, 65);
    doc.text("Thank you for your trust in Justice Ultimate Automobiles.", 20, 80);
    doc.save(`Receipt_${stockId}.pdf`);
  };

  return (
    <Button onClick={generatePDF} className="mt-4 w-full">
      Download Receipt
    </Button>
  );
};
