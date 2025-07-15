import React, { useState } from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { FiDollarSign, FiDownload, FiMail, FiFileText } from 'react-icons/fi';
import jsPDF from 'jspdf';

const mockTransactions = [
  { id: 'TX-001', date: '2024-01-15', amount: 45000, car: 'BMW X5', method: 'M-Pesa' },
  { id: 'TX-002', date: '2024-01-20', amount: 35000, car: 'Mercedes S-Class', method: 'Card' },
  { id: 'TX-003', date: '2024-01-25', amount: 25000, car: 'Toyota Land Cruiser', method: 'Bank' },
];

export default function ReceiptGenerator() {
  const [selectedId, setSelectedId] = useState('');
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tx = mockTransactions.find(t => t.id === e.target.value) || null;
    setSelectedId(e.target.value);
    setSelectedTx(tx);
  };

  // Generate/download PDF
  const downloadReceipt = () => {
    if (!selectedTx) return;
    const doc = new jsPDF();
    doc.text('Justice Ultimate Automobiles - Payment Receipt', 10, 10);
    doc.text(`Receipt ID: ${selectedTx.id}`, 10, 20);
    doc.text(`Date: ${selectedTx.date}`, 10, 30);
    doc.text(`Car: ${selectedTx.car}`, 10, 40);
    doc.text(`Amount: KES ${selectedTx.amount}`, 10, 50);
    doc.text(`Payment Method: ${selectedTx.method}`, 10, 60);
    doc.text('Digitally Signed: Justice Ultimate Automobiles', 10, 70);
    doc.text('Official Company Stamp:', 10, 80);
    doc.setFontSize(40);
    doc.setTextColor(200, 200, 200);
    doc.text('JUA', 120, 120, { angle: 30 });
    doc.save(`Receipt_${selectedTx.id}.pdf`);
  };

  // Email receipt (mock)
  const emailReceipt = () => {
    if (!selectedTx) return;
    alert(`Receipt for ${selectedTx.id} sent to your email!`);
  };

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-r from-blue-600 to-purple-500 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg text-yellow-400">Receipt Generator</h1>
          <p className="text-blue-100 mt-2">Generate and download/email payment receipts on demand.</p>
        </div>
      </div>

      <Card className="bg-white/10 text-white">
        <CardContent className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <FiFileText className="text-2xl text-yellow-400" />
            <span className="font-bold text-lg">Select Transaction</span>
          </div>
          <select value={selectedId} onChange={handleSelect} className="rounded px-3 py-2 text-black w-64">
            <option value="">-- Select Transaction --</option>
            {mockTransactions.map(t => (
              <option key={t.id} value={t.id}>{t.id} - {t.car} - {t.amount} KES</option>
            ))}
          </select>
          {selectedTx && (
            <div className="flex flex-col md:flex-row gap-4 mt-4 items-center">
              <Button onClick={downloadReceipt} className="bg-yellow-400 text-blue-900 font-bold flex items-center gap-2"><FiDownload /> Download PDF</Button>
              <Button onClick={emailReceipt} variant="outline" className="flex items-center gap-2"><FiMail /> Email Receipt</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 