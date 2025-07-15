import React, { useState } from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { FiDollarSign, FiDownload, FiMail, FiSearch, FiFileText, FiCheckCircle, FiAlertTriangle, FiShield } from 'react-icons/fi';
import jsPDF from 'jspdf';

const mockPayments = [
  { id: 'TX-001', date: '2024-01-15', amount: 45000, car: 'BMW X5', method: 'M-Pesa', status: 'Completed', ntStatus: 'Ready', receipt: null },
  { id: 'TX-002', date: '2024-01-20', amount: 35000, car: 'Mercedes S-Class', method: 'Card', status: 'Completed', ntStatus: 'Processing', receipt: null },
  { id: 'TX-003', date: '2024-01-25', amount: 25000, car: 'Toyota Land Cruiser', method: 'Bank', status: 'Pending', ntStatus: 'Pending', receipt: null },
];

export default function Payments() {
  const [search, setSearch] = useState('');
  const [payments, setPayments] = useState(mockPayments);

  // Filtered payments by search
  const filteredPayments = payments.filter(p =>
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.car.toLowerCase().includes(search.toLowerCase()) ||
    p.method.toLowerCase().includes(search.toLowerCase())
  );

  // Download individual receipt as PDF (with digital signature/watermark)
  const downloadReceipt = (payment: any) => {
    const doc = new jsPDF();
    doc.text('Justice Ultimate Automobiles - Payment Receipt', 10, 10);
    doc.text(`Receipt ID: ${payment.id}`, 10, 20);
    doc.text(`Date: ${payment.date}`, 10, 30);
    doc.text(`Car: ${payment.car}`, 10, 40);
    doc.text(`Amount: KES ${payment.amount}`, 10, 50);
    doc.text(`Payment Method: ${payment.method}`, 10, 60);
    doc.text('Digitally Signed: Justice Ultimate Automobiles', 10, 70);
    doc.text('Official Company Stamp:', 10, 80);
    doc.setFontSize(40);
    doc.setTextColor(200, 200, 200);
    doc.text('JUA', 120, 120, { angle: 30 });
    doc.save(`Receipt_${payment.id}.pdf`);
  };

  // Email receipt (mock)
  const emailReceipt = (payment: any) => {
    alert(`Receipt for ${payment.id} sent to your email!`);
  };

  // Download statement PDF
  const downloadStatement = () => {
    const doc = new jsPDF();
    doc.text('Justice Ultimate Automobiles - Payment Statement', 10, 10);
    mockPayments.forEach((p, i) => {
      doc.text(`${i + 1}. [${p.id}] ${p.car} - ${p.amount} KES (${p.method}) on ${p.date} (${p.status})`, 10, 20 + i * 10);
    });
    doc.save('PaymentStatement.pdf');
  };

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-r from-blue-600 to-purple-500 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg text-yellow-400">Payments & Billing</h1>
          <p className="text-blue-100 mt-2">View your transaction history, download receipts, and track NTSA/logbook status.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-4">
        <FiSearch className="text-xl text-yellow-400" />
        <input type="text" placeholder="Search by ID, car, or method..." value={search} onChange={e => setSearch(e.target.value)} className="rounded px-3 py-2 text-black w-64" />
      </div>

      {/* Statement Download */}
      <Card className="bg-white/10 text-white mb-4">
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
          <FiFileText className="text-4xl text-yellow-400" />
          <div className="flex-1">
            <div className="font-bold text-lg">Payment Statement</div>
            <div className="text-xs text-blue-100">Download your full payment statement as PDF.</div>
          </div>
          <Button onClick={downloadStatement} className="bg-yellow-400 text-blue-900 font-bold">Download PDF</Button>
        </CardContent>
      </Card>

      {/* Payments List */}
      <div>
        <h2 className="text-xl font-bold mb-2 text-yellow-400">Transaction History</h2>
        <div className="space-y-2">
          {filteredPayments.map((p) => (
            <Card key={p.id} className="flex flex-col md:flex-row items-center gap-4 bg-white/10 p-4">
              <FiDollarSign className="text-green-400 text-2xl" />
              <div className="flex-1">
                <div className="font-semibold text-white">{p.car}</div>
                <div className="text-xs text-blue-100">{p.date} • {p.method}</div>
                <div className="text-xs text-blue-200">KES {p.amount.toLocaleString()}</div>
                <div className="flex gap-2 mt-2">
                  <Badge className={`font-bold text-xs px-2 py-1 ${p.status === 'Completed' ? 'bg-green-400 text-blue-900' : p.status === 'Pending' ? 'bg-yellow-400 text-blue-900' : 'bg-red-400 text-blue-900'}`}>{p.status}</Badge>
                  <Badge className={`font-bold text-xs px-2 py-1 ${p.ntStatus === 'Ready' ? 'bg-green-400 text-blue-900' : p.ntStatus === 'Processing' ? 'bg-yellow-400 text-blue-900' : 'bg-red-400 text-blue-900'}`}>NTSA: {p.ntStatus}</Badge>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <Button size="sm" variant="outline" onClick={() => downloadReceipt(p)}><FiDownload className="mr-1" /> PDF</Button>
                <Button size="sm" variant="outline" onClick={() => emailReceipt(p)}><FiMail className="mr-1" /> Email</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 