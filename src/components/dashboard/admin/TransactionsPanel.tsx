import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Table, TableHeader, TableRow, TableCell } from '../../ui/table';
import { Select, SelectItem } from '../../ui/select';
import { toast } from 'react-toastify';
import { supabase } from '../../../lib/supabaseClient';
import { BarChart, LineChart, PieChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Pie, Cell, Line, Legend } from 'recharts';

const LEDGER_TYPES = ['Credit', 'Debit', 'Transfer', 'Adjustment', 'Fee', 'Commission'];
const ACCOUNT_LABELS = ['Customer', 'Admin', 'Dealer', 'Partner', 'System'];

export default function TransactionsPanel() {
  const [ledger, setLedger] = useState<any[]>([]);
  const [profits, setProfits] = useState<any>({});
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState({ type: '', account: '', date: '', search: '' });
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'ledger'|'profits'|'logs'>('ledger');

  useEffect(() => {
    fetchLedger();
    fetchProfits();
    fetchLogs();
  }, []);

  async function fetchLedger() {
    setLoading(true);
    // Example: fetch all transactions from 'transactions' table
    const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false });
    if (error) toast.error(error.message);
    setLedger(data || []);
    setLoading(false);
  }
  async function fetchProfits() {
    // Example: fetch profit stats from a 'profits' view/table or aggregate
    // Replace with real logic as needed
    setProfits({
      today: 120000,
      month: 3200000,
      rentals: 900000,
      sales: 2300000,
      mostProfitableCar: 'Land Cruiser',
      map: [
        { region: 'Nairobi', profit: 1800000 },
        { region: 'Mombasa', profit: 900000 },
        { region: 'Kisumu', profit: 500000 },
      ],
      chart: [
        { date: '2024-06-01', profit: 100000 },
        { date: '2024-06-02', profit: 120000 },
        { date: '2024-06-03', profit: 110000 },
        { date: '2024-06-04', profit: 130000 },
      ],
      segmentation: [
        { category: 'Sales', value: 2300000 },
        { category: 'Rentals', value: 900000 },
        { category: 'Service Fees', value: 200000 },
        { category: 'Advertising', value: 80000 },
      ],
    });
  }
  async function fetchLogs() {
    setLoading(true);
    // Example: fetch all transaction logs from 'transaction_logs' table
    const { data, error } = await supabase.from('transaction_logs').select('*').order('timestamp', { ascending: false });
    if (error) toast.error(error.message);
    setLogs(data || []);
    setLoading(false);
  }

  function handleExport(type: 'csv'|'pdf') {
    setExporting(true);
    // Export logic here (CSV/PDF with signature/stamp)
    setTimeout(() => {
      toast.success(`Exported ${type.toUpperCase()} successfully!`);
      setExporting(false);
    }, 1200);
  }

  // Filtered ledger
  const filteredLedger = ledger.filter(entry => {
    return (
      (!filter.type || entry.type === filter.type) &&
      (!filter.account || entry.account === filter.account) &&
      (!filter.date || entry.date.startsWith(filter.date)) &&
      (!filter.search || (entry.description && entry.description.toLowerCase().includes(filter.search.toLowerCase())))
    );
  });

  // Running balance calculation
  let runningBalance = 0;
  const ledgerWithBalance = filteredLedger.map(entry => {
    runningBalance += entry.type === 'Credit' ? entry.amount : -entry.amount;
    return { ...entry, balance: runningBalance };
  });

  return (
    <div className="space-y-8">
      <div className="flex gap-4 mb-4">
        <Button variant={activeTab==='ledger'?'default':'outline'} onClick={()=>setActiveTab('ledger')}>Ledger</Button>
        <Button variant={activeTab==='profits'?'default':'outline'} onClick={()=>setActiveTab('profits')}>Profits</Button>
        <Button variant={activeTab==='logs'?'default':'outline'} onClick={()=>setActiveTab('logs')}>Logs</Button>
      </div>
      {activeTab==='ledger' && (
        <Card className="w-full">
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-wrap gap-4 items-center mb-4">
              <Input placeholder="Search..." value={filter.search} onChange={e=>setFilter(f=>({...f,search:e.target.value}))} className="w-48" />
              <Select value={filter.type} onValueChange={v=>setFilter(f=>({...f,type:v}))} className="w-40">
                <SelectItem value="">All Types</SelectItem>
                {LEDGER_TYPES.map(type=>(<SelectItem key={type} value={type}>{type}</SelectItem>))}
              </Select>
              <Select value={filter.account} onValueChange={v=>setFilter(f=>({...f,account:v}))} className="w-40">
                <SelectItem value="">All Accounts</SelectItem>
                {ACCOUNT_LABELS.map(acc=>(<SelectItem key={acc} value={acc}>{acc}</SelectItem>))}
              </Select>
              <Input type="date" value={filter.date} onChange={e=>setFilter(f=>({...f,date:e.target.value}))} className="w-40" />
              <Button onClick={()=>handleExport('csv')} disabled={exporting}>Export CSV</Button>
              <Button onClick={()=>handleExport('pdf')} disabled={exporting}>Export PDF</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Reference ID</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Account</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Receipt</TableCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {ledgerWithBalance.map((entry, i) => (
                  <TableRow key={entry.id || i}>
                    <TableCell>{new Date(entry.date).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</TableCell>
                    <TableCell>{entry.reference_id}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>{entry.type}</TableCell>
                    <TableCell>{entry.account}</TableCell>
                    <TableCell className={entry.amount >= 0 ? 'text-green-600' : 'text-red-600'}>{entry.amount.toLocaleString()}</TableCell>
                    <TableCell>{entry.balance.toLocaleString()}</TableCell>
                    <TableCell>{entry.receipt_url ? <a href={entry.receipt_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a> : '-'}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </CardContent>
        </Card>
      )}
      {activeTab==='profits' && (
        <Card className="w-full">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-blue-900 text-white rounded-lg p-6 shadow-xl">
                <div className="text-2xl font-bold">Ksh {profits.today?.toLocaleString()}</div>
                <div className="text-sm">Today's Profit</div>
              </div>
              <div className="bg-green-900 text-white rounded-lg p-6 shadow-xl">
                <div className="text-2xl font-bold">Ksh {profits.month?.toLocaleString()}</div>
                <div className="text-sm">This Month's Revenue</div>
              </div>
              <div className="bg-yellow-700 text-white rounded-lg p-6 shadow-xl">
                <div className="text-2xl font-bold">Ksh {profits.rentals?.toLocaleString()}</div>
                <div className="text-sm">Rentals</div>
              </div>
              <div className="bg-purple-900 text-white rounded-lg p-6 shadow-xl">
                <div className="text-2xl font-bold">Ksh {profits.sales?.toLocaleString()}</div>
                <div className="text-sm">Sales</div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Profit Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={profits.chart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="profit" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Profit Segmentation</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={profits.segmentation} dataKey="value" nameKey="category" cx="50%" cy="50%" outerRadius={100} fill="#82ca9d" label />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Profit by Region</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={profits.map}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="profit" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Most Profitable Car</h3>
              <div className="text-lg font-bold">{profits.mostProfitableCar}</div>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">KPIs</h3>
              <ul className="list-disc ml-6">
                <li>ROI, CAC, LTV, Profit per car, etc. (coming soon)</li>
              </ul>
            </div>
            <Button onClick={()=>handleExport('pdf')}>Download Full Report (PDF)</Button>
          </CardContent>
        </Card>
      )}
      {activeTab==='logs' && (
        <Card className="w-full">
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-wrap gap-4 items-center mb-4">
              <Input placeholder="Search logs..." value={filter.search} onChange={e=>setFilter(f=>({...f,search:e.target.value}))} className="w-48" />
              <Select value={filter.type} onValueChange={v=>setFilter(f=>({...f,type:v}))} className="w-40">
                <SelectItem value="">All Actions</SelectItem>
                <SelectItem value="Created">Created</SelectItem>
                <SelectItem value="Updated">Updated</SelectItem>
                <SelectItem value="Deleted">Deleted</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Logged In">Logged In</SelectItem>
                <SelectItem value="Exported">Exported</SelectItem>
              </Select>
              <Button onClick={()=>handleExport('csv')} disabled={exporting}>Export CSV</Button>
              <Button onClick={()=>handleExport('pdf')} disabled={exporting}>Export PDF</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>IP</TableCell>
                  <TableCell>Device</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell>Before</TableCell>
                  <TableCell>After</TableCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {logs.map((log, i) => (
                  <TableRow key={log.id || i}>
                    <TableCell>{new Date(log.timestamp).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.user_full_name} <br/> <span className="text-xs text-gray-500">{log.user_email}</span></TableCell>
                    <TableCell>{log.user_role}</TableCell>
                    <TableCell>{log.ip_address}</TableCell>
                    <TableCell>{log.device_info}</TableCell>
                    <TableCell>{log.details}</TableCell>
                    <TableCell><pre className="text-xs bg-gray-100 p-2 rounded max-w-xs overflow-x-auto">{JSON.stringify(log.before, null, 2)}</pre></TableCell>
                    <TableCell><pre className="text-xs bg-gray-100 p-2 rounded max-w-xs overflow-x-auto">{JSON.stringify(log.after, null, 2)}</pre></TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 