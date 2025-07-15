import React from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { FiDownload, FiFileText, FiBell, FiDollarSign } from 'react-icons/fi';
import jsPDF from 'jspdf';

const mockReceipts = [
  { id: 'R-001', date: '2024-01-15', amount: 45000, car: 'BMW X5', method: 'M-Pesa', file: null },
  { id: 'R-002', date: '2024-01-20', amount: 35000, car: 'Mercedes S-Class', method: 'Card', file: null },
];

export default function Downloads() {
  // Download account statement as PDF
  const downloadAccountStatement = () => {
    const doc = new jsPDF();
    doc.text('Justice Ultimate Automobiles - Account Statement', 10, 10);
    doc.text('Name: Daniel Mwangi', 10, 20);
    doc.text('Email: daniel@example.com', 10, 30);
    doc.text('---', 10, 40);
    doc.text('Receipts:', 10, 50);
    mockReceipts.forEach((r, i) => {
      doc.text(`${i + 1}. [${r.id}] ${r.car} - ${r.amount} KES (${r.method}) on ${r.date}`, 10, 60 + i * 10);
    });
    doc.save('AccountStatement.pdf');
  };

  // Download individual receipt as PDF
  const downloadReceipt = (receipt: any) => {
    const doc = new jsPDF();
    doc.text('Justice Ultimate Automobiles - Payment Receipt', 10, 10);
    doc.text(`Receipt ID: ${receipt.id}`, 10, 20);
    doc.text(`Date: ${receipt.date}`, 10, 30);
    doc.text(`Car: ${receipt.car}`, 10, 40);
    doc.text(`Amount: KES ${receipt.amount}`, 10, 50);
    doc.text(`Payment Method: ${receipt.method}`, 10, 60);
    doc.save(`Receipt_${receipt.id}.pdf`);
  };

  // Link to notification log PDF (already implemented in Notifications)
  const downloadNotificationLog = () => {
    window.scrollTo(0, 0);
    alert('Go to Notifications to download the log as PDF!');
  };

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-r from-blue-600 to-purple-500 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg text-yellow-400">Downloads</h1>
          <p className="text-blue-100 mt-2">Download your account statement, receipts, and notification log as PDF.</p>
        </div>
      </div>

      {/* Account Statement Download */}
      <Card className="bg-white/10 text-white">
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
          <FiFileText className="text-4xl text-yellow-400" />
          <div className="flex-1">
            <div className="font-bold text-lg">Account Statement</div>
            <div className="text-xs text-blue-100">Download your full account statement as PDF.</div>
          </div>
          <Button onClick={downloadAccountStatement} className="bg-yellow-400 text-blue-900 font-bold">Download PDF</Button>
        </CardContent>
      </Card>

      {/* Receipts Download */}
      <div>
        <h2 className="text-xl font-bold mb-2 text-yellow-400">Receipts</h2>
        <div className="space-y-2">
          {mockReceipts.map((r) => (
            <Card key={r.id} className="flex items-center gap-4 bg-white/10 p-4">
              <FiDollarSign className="text-green-400 text-2xl" />
              <div className="flex-1">
                <div className="font-semibold text-white">{r.car}</div>
                <div className="text-xs text-blue-100">{r.date} • {r.method}</div>
                <div className="text-xs text-blue-200">KES {r.amount.toLocaleString()}</div>
              </div>
              <Button size="sm" variant="outline" onClick={() => downloadReceipt(r)}><FiDownload className="mr-1" /> PDF</Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Notification Log Download */}
      <Card className="bg-white/10 text-white">
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
          <FiBell className="text-4xl text-yellow-400" />
          <div className="flex-1">
            <div className="font-bold text-lg">Notification Log</div>
            <div className="text-xs text-blue-100">Download your notification log as PDF (see Notifications section).</div>
          </div>
          <Button onClick={downloadNotificationLog} className="bg-yellow-400 text-blue-900 font-bold">Go to Notifications</Button>
        </CardContent>
      </Card>
    </div>
  );
} 