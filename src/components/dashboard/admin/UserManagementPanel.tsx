// 📁 src/components/dashboard/admin/UserManagementPanel.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Table, TableHeader, TableRow, TableCell } from '../../ui/table';
import { Switch } from '../../ui/switch';
import { Select, SelectItem } from '../../ui/select';
import { toast } from 'react-toastify';
import { Dialog } from '../../ui/dialog';
import { ReceiptGenerator } from '../../ReceiptGenerator';
import ImpersonatorTool from '../widgets/ImpersonatorTool';
import axios from 'axios';
import { createContext, useContext } from 'react';
import { BarChart as ReBarChart, PieChart as RePieChart, LineChart as ReLineChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Pie, Cell, Line, Legend } from 'recharts';

// Notifications Context for global admin notifications
const NotificationsContext = createContext({
  notifications: [],
  pushNotification: (notif: any) => {},
});
export function useNotifications() { return useContext(NotificationsContext); }

const ROLES = [
  'admin', 'staff', 'customer', 'agent', 'mechanic', 'manager', 'car_owner', 'sales_staff', 'guest'
];
const STATUSES = [
  'active', 'inactive', 'banned', 'pending', 'verified', 'kyc_pending', 'kyc_rejected'
];

function UserProfileModal({ user, open, onClose, onRefresh }: { user: any, open: boolean, onClose: () => void, onRefresh: () => void }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [receipts, setReceipts] = useState<any[]>([]);
  const [receiptsLoading, setReceiptsLoading] = useState(false);
  const [cars, setCars] = useState<any[]>([]);
  const [carsLoading, setCarsLoading] = useState(false);
  const [rentals, setRentals] = useState<any[]>([]);
  const [rentalsLoading, setRentalsLoading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editProfile, setEditProfile] = useState<any>(null);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showImpersonateModal, setShowImpersonateModal] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (user) setEditProfile({ ...user });
  }, [user]);

  useEffect(() => {
    if (activeTab === 'receipts' && user?.id) {
      fetchReceipts();
    }
    if (activeTab === 'cars' && user?.id) fetchCars();
    if (activeTab === 'rentals' && user?.id) fetchRentals();
    if (activeTab === 'documents' && user?.id) fetchDocuments();
    if (activeTab === 'notes' && user?.id) fetchNotes();
    if (activeTab === 'audit' && user?.id) fetchAuditLogs();
    // eslint-disable-next-line
  }, [activeTab, user]);

  async function fetchReceipts() {
    setReceiptsLoading(true);
    const { data, error } = await supabase.from('receipts').select('*').eq('user_id', user.id).order('date', { ascending: false });
    setReceipts(data || []);
    setReceiptsLoading(false);
  }

  async function fetchCars() {
    setCarsLoading(true);
    const { data, error } = await supabase
      .from('owned_cars')
      .select('*, cars(*)')
      .eq('user_id', user.id);
    setCars(data || []);
    setCarsLoading(false);
  }

  async function fetchRentals() {
    setRentalsLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*, cars(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setRentals(data || []);
    setRentalsLoading(false);
  }

  async function fetchDocuments() {
    setDocumentsLoading(true);
    const { data, error } = await supabase.from('documents').select('*').eq('user_id', user.id).order('uploaded_at', { ascending: false });
    setDocuments(data || []);
    setDocumentsLoading(false);
  }

  async function fetchNotes() {
    setNotesLoading(true);
    const { data, error } = await supabase.from('notes').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setNotes(data || []);
    setNotesLoading(false);
  }

  async function addNote() {
    if (!newNote.trim()) return;
    setAddingNote(true);
    await supabase.from('notes').insert({ user_id: user.id, content: newNote });
    setNewNote('');
    setAddingNote(false);
    fetchNotes();
  }

  async function fetchAuditLogs() {
    setAuditLoading(true);
    const { data, error } = await supabase.from('audit_logs').select('*').eq('user_id', user.id).order('timestamp', { ascending: false });
    setAuditLogs(data || []);
    setAuditLoading(false);
  }

  async function saveProfileEdits() {
    if (!editProfile) return;
    const { error } = await supabase.from('profiles').update({
      full_name: editProfile.full_name,
      email: editProfile.email,
      phone: editProfile.phone
    }).eq('id', user.id);
    if (error) toast.error(error.message);
    else toast.success('Profile updated');
    setEditMode(false);
    onRefresh();
  }

  async function handleResetPassword() {
    if (!user?.email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, { redirectTo: window.location.origin + '/login' });
    if (error) toast.error(error.message);
    else toast.success('Password reset email sent!');
  }

  // --- 2FA Modal (based on customer/ProfileInfo) ---
  function TwoFAModal({ user, onClose }: { user: any, onClose: () => void }) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleEnable2FA = async () => {
      setLoading(true);
      try {
        // TODO: Integrate with Supabase TOTP when available
        alert('2FA code generated. Please verify it on your authenticator app.');
      } catch (err) {
        setError('Error generating 2FA code. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    const handleVerify2FA = async () => {
      setLoading(true);
      try {
        // TODO: Integrate with Supabase TOTP verification
        alert('2FA enabled successfully!');
        onClose();
      } catch (err) {
        setError('Error verifying 2FA code. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Enable Two-Factor Authentication</h2>
          <p className="text-sm text-gray-700 mb-4">
            To enable two-factor authentication, we need to verify your identity.<br/>
            This adds an extra layer of security to your account.
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Verification Code</label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter the code from your authenticator app"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleVerify2FA} disabled={loading}>
              {loading ? 'Enabling...' : 'Enable 2FA'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- Export PDF handler (reuse ReceiptGenerator logic) ---
  const handleExportPDF = async () => {
    setPdfLoading(true);
    try {
      // For demo, use ReceiptGenerator's generatePDF for user profile export
      // TODO: Replace with a dedicated user profile PDF export
      const doc = (await import('jspdf')).default;
      const jsPDF = doc;
      const pdf = new jsPDF();
      pdf.setFontSize(18);
      pdf.text('Justice Ultimate Automobiles', 70, 25);
      pdf.setFontSize(13);
      pdf.text('User Profile Export', 15, 48);
      pdf.setFontSize(11);
      pdf.text(`Name: ${user.full_name || user.first_name + ' ' + user.last_name}`, 15, 60);
      pdf.text(`Email: ${user.email}`, 15, 68);
      pdf.text(`Phone: ${user.phone || 'N/A'}`, 15, 76);
      pdf.text(`Role: ${user.role}`, 15, 84);
      pdf.text(`Status: ${user.status}`, 15, 92);
      pdf.text(`Joined: ${user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}`, 15, 100);
      pdf.save(`UserProfile_${user.id}.pdf`);
    } catch (err) {
      toast.error('Failed to export PDF');
    } finally {
      setPdfLoading(false);
    }
  };

  // --- Impersonate handler ---
  const handleImpersonate = () => {
    setShowImpersonateModal(true);
    // TODO: Implement backend/session logic for impersonation
  };

  if (!user) return null;
  return (
    <Dialog open={open} onOpenChange={open => { if (!open) onClose(); }}>
      <div className="max-w-2xl w-full bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl relative">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-red-500" onClick={() => onClose()}>&times;</button>
        <div className="flex gap-6 items-center mb-6">
          <img src={user.avatar_url || '/avatar.png'} alt="Avatar" className="h-24 w-24 rounded-full border-4 border-green-600" />
          <div>
            <h2 className="text-2xl font-bold mb-1">{user.full_name || `${user.first_name || ''} ${user.last_name || ''}`}</h2>
            <div className="text-sm text-gray-500 mb-1">{user.email}</div>
            <div className="text-xs text-gray-400">Joined: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</div>
            <div className="mt-2 flex gap-2">
              <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">{user.role}</span>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${user.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>{user.status}</span>
              {user.verified && <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">Verified</span>}
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b pb-2">
          <button className={`px-3 py-1 rounded-t ${activeTab === 'profile' ? 'bg-green-700 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`} onClick={() => setActiveTab('profile')}>Profile</button>
          <button className={`px-3 py-1 rounded-t ${activeTab === 'receipts' ? 'bg-green-700 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`} onClick={() => setActiveTab('receipts')}>Receipts</button>
          <button className={`px-3 py-1 rounded-t ${activeTab === 'cars' ? 'bg-green-700 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`} onClick={() => setActiveTab('cars')}>Cars</button>
          <button className={`px-3 py-1 rounded-t ${activeTab === 'rentals' ? 'bg-green-700 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`} onClick={() => setActiveTab('rentals')}>Rentals</button>
          <button className={`px-3 py-1 rounded-t ${activeTab === 'documents' ? 'bg-green-700 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`} onClick={() => setActiveTab('documents')}>Documents</button>
          <button className={`px-3 py-1 rounded-t ${activeTab === 'notes' ? 'bg-green-700 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`} onClick={() => setActiveTab('notes')}>Notes</button>
          <button className={`px-3 py-1 rounded-t ${activeTab === 'audit' ? 'bg-green-700 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`} onClick={() => setActiveTab('audit')}>Audit Trail</button>
        </div>
        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="font-semibold mb-1">Contact</div>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      value={editProfile?.full_name || ''}
                      onChange={e => setEditProfile({ ...editProfile, full_name: e.target.value })}
                      className="border rounded px-3 py-2 w-full mb-2"
                      placeholder="Full Name"
                    />
                    <input
                      type="email"
                      value={editProfile?.email || ''}
                      onChange={e => setEditProfile({ ...editProfile, email: e.target.value })}
                      className="border rounded px-3 py-2 w-full mb-2"
                      placeholder="Email"
                    />
                    <input
                      type="text"
                      value={editProfile?.phone || ''}
                      onChange={e => setEditProfile({ ...editProfile, phone: e.target.value })}
                      className="border rounded px-3 py-2 w-full"
                      placeholder="Phone"
                    />
                  </>
                ) : (
                  <>
                    <div className="text-sm">Phone: {user.phone || 'N/A'}</div>
                    <div className="text-sm">Country: {user.country || 'N/A'}</div>
                    <div className="text-sm">National ID: {user.national_id || 'N/A'}</div>
                    <div className="text-sm">KYC: {user.kyc_status || 'N/A'}</div>
                  </>
                )}
              </div>
              <div>
                <div className="font-semibold mb-1">Security</div>
                <div className="text-sm">2FA: {user.two_fa_enabled ? 'Enabled' : 'Disabled'}</div>
                <div className="text-sm">Last Login: {user.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}</div>
                <div className="text-sm">Login Count: {user.login_count || 0}</div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap mt-4">
              {editMode ? (
                <>
                  <Button size="sm" variant="outline" onClick={saveProfileEdits}>Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setEditMode(true)}>Edit</Button>
              )}
              <Button size="sm" variant="outline" onClick={handleResetPassword}>Reset Password</Button>
              <Button size="sm" variant="outline" onClick={() => setShow2FAModal(true)}>Enable 2FA</Button>
              <Button size="sm" variant="outline" onClick={handleExportPDF} disabled={pdfLoading}>{pdfLoading ? 'Exporting...' : 'Export PDF'}</Button>
              <Button size="sm" variant="outline" onClick={handleImpersonate}>Impersonate</Button>
            </div>
          </div>
        )}
        {activeTab === 'receipts' && (
          <div className="py-4">
            {receiptsLoading ? (
              <div className="text-center py-8 text-gray-500">Loading receipts...</div>
            ) : receipts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No receipts found for this user.</div>
            ) : (
              <table className="w-full text-sm border rounded-xl overflow-hidden">
                <thead className="bg-green-900 text-white">
                  <tr>
                    <th className="p-2">Receipt ID</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Car</th>
                    <th className="p-2">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map(r => (
                    <tr key={r.id} className="border-b hover:bg-green-50 dark:hover:bg-green-900">
                      <td className="p-2 font-mono">{r.id}</td>
                      <td className="p-2">{r.date ? new Date(r.date).toLocaleDateString() : 'N/A'}</td>
                      <td className="p-2">KES {r.amount?.toLocaleString()}</td>
                      <td className="p-2">{r.car || '-'}</td>
                      <td className="p-2">{r.method || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {activeTab === 'cars' && (
          <div className="py-4">
            {carsLoading ? (
              <div className="text-center py-8 text-gray-500">Loading cars...</div>
            ) : cars.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No cars found for this user.</div>
            ) : (
              <table className="w-full text-sm border rounded-xl overflow-hidden">
                <thead className="bg-green-900 text-white">
                  <tr>
                    <th className="p-2">Car Name</th>
                    <th className="p-2">Year</th>
                    <th className="p-2">Mileage</th>
                    <th className="p-2">Fuel</th>
                    <th className="p-2">Transmission</th>
                    <th className="p-2">Color</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((c: any) => (
                    <tr key={c.id} className="border-b hover:bg-green-50 dark:hover:bg-green-900">
                      <td className="p-2">{c.cars?.name || '-'}</td>
                      <td className="p-2">{c.cars?.specs?.year || '-'}</td>
                      <td className="p-2">{c.cars?.specs?.mileage ? `${c.cars.specs.mileage.toLocaleString()} km` : '-'}</td>
                      <td className="p-2">{c.cars?.specs?.fuel || '-'}</td>
                      <td className="p-2">{c.cars?.specs?.transmission || '-'}</td>
                      <td className="p-2">{c.cars?.specs?.color || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {activeTab === 'rentals' && (
          <div className="py-4">
            {rentalsLoading ? (
              <div className="text-center py-8 text-gray-500">Loading rentals...</div>
            ) : rentals.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No rentals found for this user.</div>
            ) : (
              <table className="w-full text-sm border rounded-xl overflow-hidden">
                <thead className="bg-green-900 text-white">
                  <tr>
                    <th className="p-2">Car</th>
                    <th className="p-2">Rental Date</th>
                    <th className="p-2">Return Date</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rentals.map((r: any) => (
                    <tr key={r.id} className="border-b hover:bg-green-50 dark:hover:bg-green-900">
                      <td className="p-2">{r.cars?.name || '-'}</td>
                      <td className="p-2">{r.rental_date ? new Date(r.rental_date).toLocaleDateString() : '-'}</td>
                      <td className="p-2">{r.return_date ? new Date(r.return_date).toLocaleDateString() : '-'}</td>
                      <td className="p-2">KES {r.total_amount?.toLocaleString() || '-'}</td>
                      <td className="p-2">{r.status || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {activeTab === 'documents' && (
          <div className="py-4">
            {documentsLoading ? (
              <div className="text-center py-8 text-gray-500">Loading documents...</div>
            ) : documents.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No documents found for this user.</div>
            ) : (
              <table className="w-full text-sm border rounded-xl overflow-hidden">
                <thead className="bg-green-900 text-white">
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Uploaded</th>
                    <th className="p-2">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((d: any) => (
                    <tr key={d.id} className="border-b hover:bg-green-50 dark:hover:bg-green-900">
                      <td className="p-2">{d.name || d.file_name || '-'}</td>
                      <td className="p-2">{d.type || d.mime_type || '-'}</td>
                      <td className="p-2">{d.uploaded_at ? new Date(d.uploaded_at).toLocaleDateString() : '-'}</td>
                      <td className="p-2"><a href={d.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {activeTab === 'notes' && (
          <div className="py-4">
            {notesLoading ? (
              <div className="text-center py-8 text-gray-500">Loading notes...</div>
            ) : (
              <>
                <div className="mb-4 flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="Add admin note..."
                    className="border rounded px-3 py-2 w-full"
                  />
                  <Button size="sm" onClick={addNote} disabled={addingNote || !newNote.trim()}>Add</Button>
                </div>
                {notes.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No notes for this user.</div>
                ) : (
                  <ul className="space-y-2">
                    {notes.map((n: any) => (
                      <li key={n.id} className="bg-green-50 dark:bg-green-900 p-3 rounded-xl flex flex-col">
                        <div className="text-sm text-gray-700 dark:text-gray-200">{n.content}</div>
                        <div className="text-xs text-gray-400 mt-1">{n.created_at ? new Date(n.created_at).toLocaleString() : ''}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        )}
        {activeTab === 'audit' && (
          <div className="py-4">
            {auditLoading ? (
              <div className="text-center py-8 text-gray-500">Loading audit trail...</div>
            ) : auditLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No audit logs for this user.</div>
            ) : (
              <table className="w-full text-sm border rounded-xl overflow-hidden">
                <thead className="bg-green-900 text-white">
                  <tr>
                    <th className="p-2">Action</th>
                    <th className="p-2">Admin</th>
                    <th className="p-2">Timestamp</th>
                    <th className="p-2">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((a: any) => (
                    <tr key={a.id} className="border-b hover:bg-green-50 dark:hover:bg-green-900">
                      <td className="p-2">{a.action || '-'}</td>
                      <td className="p-2">{a.admin_name || '-'}</td>
                      <td className="p-2">{a.timestamp ? new Date(a.timestamp).toLocaleString() : '-'}</td>
                      <td className="p-2">{a.details || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
      {show2FAModal && <TwoFAModal user={user} onClose={() => setShow2FAModal(false)} />}
      {showImpersonateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
            <ImpersonatorTool />
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setShowImpersonateModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}

// Helper to get current admin info (replace with real auth in production)
function getCurrentAdmin() {
  return {
    id: 'admin-123', // TODO: Replace with real admin ID
    email: 'admin@justiceultimate.com', // TODO: Replace with real admin email
  };
}

// Admin Audit Log Panel
function AdminAuditLogPanel({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/audit-logs');
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setLogs([]);
    }
    setLoading(false);
  }, []);
  useEffect(() => { if (open) fetchLogs(); }, [open, fetchLogs]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-3xl w-full shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">Global Audit Log</h2>
        <button className="absolute top-4 right-4 text-gray-500 hover:text-red-500" onClick={onClose}>&times;</button>
        {loading ? <div>Loading...</div> : (
          <table className="w-full text-sm border rounded-xl overflow-hidden">
            <thead className="bg-green-900 text-white">
              <tr>
                <th className="p-2">Action</th>
                <th className="p-2">Admin</th>
                <th className="p-2">Affected Users</th>
                <th className="p-2">Details</th>
                <th className="p-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} className="border-b hover:bg-green-50">
                  <td className="p-2 font-semibold">{log.action}</td>
                  <td className="p-2">{log.admin_email}</td>
                  <td className="p-2">{Array.isArray(log.affected_user_ids) ? log.affected_user_ids.join(', ') : log.affected_user_ids}</td>
                  <td className="p-2">{log.details}</td>
                  <td className="p-2">{log.timestamp ? new Date(log.timestamp).toLocaleString() : ''}</td>
                </tr>
              ))}
              {logs.length === 0 && <tr><td colSpan={5} className="text-center text-gray-400">No audit logs found.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// User Analytics Panel
function UserAnalyticsPanel({ users }: { users: any[] }) {
  // Stats
  const totalUsers = users.length;
  const roles = Array.from(new Set(users.map(u => u.role)));
  const roleCounts = roles.map(role => ({ role, count: users.filter(u => u.role === role).length }));
  const statusCounts = ['active', 'inactive', 'banned', 'pending', 'verified', 'kyc_pending', 'kyc_rejected'].map(status => ({ status, count: users.filter(u => u.status === status).length }));
  // Growth (users by month)
  const usersByMonth = users.reduce((acc, u) => {
    const date = u.created_at ? new Date(u.created_at) : null;
    if (!date) return acc;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const growthData = Object.entries(usersByMonth).sort().map(([month, count]) => ({ month, count }));
  // Pie chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#6366f1', '#f59e42', '#10b981'];
  return (
    <div className="bg-green-900/80 rounded-xl p-6 shadow-lg mb-8">
      <h3 className="text-2xl font-bold text-white mb-4">User Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Users & Growth */}
        <div>
          <div className="text-4xl font-bold text-lime-300 mb-2">{totalUsers}</div>
          <div className="text-green-100 mb-4">Total Users</div>
          <ResponsiveContainer width="100%" height={180}>
            <ReLineChart data={growthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#82ca9d" strokeWidth={3} />
            </ReLineChart>
          </ResponsiveContainer>
        </div>
        {/* Roles Pie Chart */}
        <div>
          <div className="text-green-100 mb-2">User Roles</div>
          <ResponsiveContainer width="100%" height={180}>
            <RePieChart>
              <Pie data={roleCounts} dataKey="count" nameKey="role" cx="50%" cy="50%" outerRadius={70} label>
                {roleCounts.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </RePieChart>
          </ResponsiveContainer>
        </div>
        {/* Status Bar Chart */}
        <div>
          <div className="text-green-100 mb-2">User Status</div>
          <ResponsiveContainer width="100%" height={180}>
            <ReBarChart data={statusCounts} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" barSize={40} radius={[8, 8, 0, 0]} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default function UserManagementPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [profileModalUser, setProfileModalUser] = useState<any>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncSummary, setSyncSummary] = useState<string | null>(null);
  const [adminNotifications, setAdminNotifications] = useState<any[]>([]);
  const [showAuditLogPanel, setShowAuditLogPanel] = useState(false);
  const [impersonating, setImpersonating] = useState(false);
  const [originalSession, setOriginalSession] = useState<any>(null);
  const [editMode, setEditMode] = useState(false); // Added for profile modal
  const [editProfile, setEditProfile] = useState<any>(null); // Added for profile modal

  function pushNotification(notif: any) {
    setAdminNotifications(prev => [{ ...notif, time: new Date().toLocaleTimeString() }, ...prev]);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      );

      const queryPromise = supabase.from('profiles').select('*').limit(50);
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;
      
      if (error) {
        toast.error(error.message);
        // Fallback to mock data
        setUsers([
          {
            id: 'demo-user-1',
            email: 'admin@justice.com',
            full_name: 'Admin User',
            role: 'admin',
            created_at: new Date().toISOString()
          },
          {
            id: 'demo-user-2',
            email: 'staff@justice.com', 
            full_name: 'Staff User',
            role: 'staff',
            created_at: new Date(Date.now() - 86400000).toISOString()
          }
        ]);
      } else {
        setUsers(data || []);
      }
    } catch (err: any) {
      toast.error('Failed to fetch users. Using demo data.');
      // Fallback to mock data
      setUsers([
        {
          id: 'demo-user-1',
          email: 'admin@justice.com',
          full_name: 'Admin User',
          role: 'admin',
          created_at: new Date().toISOString()
        },
        {
          id: 'demo-user-2',
          email: 'staff@justice.com',
          full_name: 'Staff User', 
          role: 'staff',
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Only show sync button to admins (assume current user is admin for now)
  const isAdmin = true; // TODO: Replace with real admin check

  // Sync Auth Users logic
  async function handleSyncAuthUsers() {
    setSyncing(true);
    setSyncSummary(null);
    try {
      // 1. Fetch all Auth users from backend
      const { data: authUsers } = await axios.get('/auth-users');
      if (!Array.isArray(authUsers)) throw new Error('Invalid response from /auth-users');
      // 2. Get all profile user IDs
      const profileIds = new Set(users.map(u => u.id));
      // 3. Find missing users
      const missing = authUsers.filter(u => !profileIds.has(u.id));
      if (missing.length === 0) {
        setSyncSummary('All Auth users are already in the profiles table.');
        setSyncing(false);
        return;
      }
      // 4. Insert missing users into profiles
      const inserts = missing.map(u => ({
        id: u.id,
        email: u.email,
        full_name: u.user_metadata?.full_name || '',
        first_name: u.user_metadata?.first_name || '',
        last_name: u.user_metadata?.last_name || '',
        phone: u.phone || '',
        role: 'customer', // Default role, can be changed later
        status: 'active',
        created_at: u.created_at,
        avatar_url: '',
        kyc_status: 'pending',
        verified: false
      }));
      const { error } = await supabase.from('profiles').insert(inserts);
      if (error) throw error;
      setSyncSummary(`Imported ${inserts.length} users from Supabase Auth.`);
      fetchUsers();
    } catch (err: any) {
      setSyncSummary('Sync failed: ' + (err.message || err.toString()));
    } finally {
      setSyncing(false);
    }
  }

  function handleSelectAll(e: React.ChangeEvent<HTMLInputElement>) {
    setSelected(e.target.checked ? filteredUsers.map(u => u.id) : []);
  }
  function handleSelect(id: string) {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  }

  async function handleRoleChange(id: string, role: string) {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
    if (error) toast.error(error.message); else toast.success('Role updated');
    fetchUsers();
  }
  async function handleStatusChange(id: string, status: string) {
    const { error } = await supabase.from('profiles').update({ status }).eq('id', id);
    if (error) toast.error(error.message); else toast.success('Status updated');
    fetchUsers();
  }

  // Bulk Actions
  async function handleBulkApprove() {
    if (!selected.length) return;
    setLoading(true);
    const { error } = await supabase.from('profiles').update({ status: 'active' }).in('id', selected);
    if (error) toast.error(error.message); else {
      toast.success('Users approved');
      pushNotification({ type: 'success', message: `Approved ${selected.length} users.` });
      // Insert notification for each user
      for (const userId of selected) {
        await supabase.from('notifications').insert({
          user_id: userId,
          type: 'admin_action',
          message: 'Your account was approved by an admin.',
          created_at: new Date().toISOString(),
          read: false
        });
      }
      // Insert audit log
      const admin = getCurrentAdmin();
      await supabase.from('audit_logs').insert({
        action: 'approve',
        admin_id: admin.id,
        admin_email: admin.email,
        affected_user_ids: selected,
        details: `Approved users: ${selected.join(', ')}`,
        timestamp: new Date().toISOString(),
      });
      // Backend webhook
      fetch('/admin-action-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          admin_id: admin.id,
          admin_email: admin.email,
          affected_user_ids: selected,
          details: `Approved users: ${selected.join(', ')}`,
          timestamp: new Date().toISOString(),
        })
      });
    }
    setSelected([]);
    fetchUsers();
    setLoading(false);
  }
  async function handleBulkSuspend() {
    if (!selected.length) return;
    setLoading(true);
    const { error } = await supabase.from('profiles').update({ status: 'inactive' }).in('id', selected);
    if (error) toast.error(error.message); else {
      toast.success('Users suspended');
      pushNotification({ type: 'info', message: `Suspended ${selected.length} users.` });
      for (const userId of selected) {
        await supabase.from('notifications').insert({
          user_id: userId,
          type: 'admin_action',
          message: 'Your account was suspended by an admin.',
          created_at: new Date().toISOString(),
          read: false
        });
      }
      // Insert audit log
      const admin = getCurrentAdmin();
      await supabase.from('audit_logs').insert({
        action: 'suspend',
        admin_id: admin.id,
        admin_email: admin.email,
        affected_user_ids: selected,
        details: `Suspended users: ${selected.join(', ')}`,
        timestamp: new Date().toISOString(),
      });
      // Backend webhook
      fetch('/admin-action-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'suspend',
          admin_id: admin.id,
          admin_email: admin.email,
          affected_user_ids: selected,
          details: `Suspended users: ${selected.join(', ')}`,
          timestamp: new Date().toISOString(),
        })
      });
    }
    setSelected([]);
    fetchUsers();
    setLoading(false);
  }
  async function handleBulkDelete() {
    if (!selected.length) return;
    if (!window.confirm('Are you sure you want to delete the selected users? This cannot be undone.')) return;
    setLoading(true);
    const { error } = await supabase.from('profiles').delete().in('id', selected);
    if (error) toast.error(error.message); else {
      toast.success('Users deleted');
      pushNotification({ type: 'error', message: `Deleted ${selected.length} users.` });
      for (const userId of selected) {
        await supabase.from('notifications').insert({
          user_id: userId,
          type: 'admin_action',
          message: 'Your account was deleted by an admin.',
          created_at: new Date().toISOString(),
          read: false
        });
      }
      // Insert audit log
      const admin = getCurrentAdmin();
      await supabase.from('audit_logs').insert({
        action: 'delete',
        admin_id: admin.id,
        admin_email: admin.email,
        affected_user_ids: selected,
        details: `Deleted users: ${selected.join(', ')}`,
        timestamp: new Date().toISOString(),
      });
      // Backend webhook
      fetch('/admin-action-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          admin_id: admin.id,
          admin_email: admin.email,
          affected_user_ids: selected,
          details: `Deleted users: ${selected.join(', ')}`,
          timestamp: new Date().toISOString(),
        })
      });
    }
    setSelected([]);
    fetchUsers();
    setLoading(false);
  }
  function handleBulkExport() {
    if (!selected.length) return;
    const exportUsers = users.filter(u => selected.includes(u.id));
    const csv = [
      ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Created At'],
      ...exportUsers.map(u => [u.id, u.full_name || `${u.first_name || ''} ${u.last_name || ''}`, u.email, u.phone, u.role, u.status, u.created_at])
    ].map(row => row.map(val => `"${val ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImpersonate(user) {
    if (!user?.id) return;
    // Save current session
    const currentSession = supabase.auth.session();
    setOriginalSession(currentSession);
    // Call backend to get session for target user
    const admin = getCurrentAdmin();
    const res = await fetch('/impersonate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, admin_id: admin.id, admin_email: admin.email }),
    });
    const data = await res.json();
    if (data.session) {
      await supabase.auth.setSession(data.session);
      setImpersonating(true);
      toast.success('Now impersonating user');
      fetchUsers();
    } else {
      toast.error(data.error || 'Failed to impersonate');
    }
  }

  async function handleRevertImpersonation() {
    if (originalSession) {
      await supabase.auth.setSession(originalSession);
      setImpersonating(false);
      toast.info('Reverted to admin session');
      fetchUsers();
    }
  }

  async function handleDeleteUser(id) {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    setLoading(true);
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) toast.error(error.message); else toast.success('User deleted');
    fetchUsers();
    setLoading(false);
  }
  async function handleExportUser(user) {
    // Export user data as CSV (or PDF if needed)
    const csv = `ID,Name,Email,Phone,Role,Status,Created At\n${user.id},${user.full_name},${user.email},${user.phone},${user.role},${user.status},${user.created_at}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user_${user.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Filtering
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        <UserAnalyticsPanel users={users} />
        <div className="mb-4 flex items-center gap-4">
          <Button variant="outline" onClick={() => setShowAuditLogPanel(true)}>
            View Global Audit Log
          </Button>
        </div>
        <AdminAuditLogPanel open={showAuditLogPanel} onClose={() => setShowAuditLogPanel(false)} />
        {/* Admin Notification Feed */}
        <div className="mb-4">
          <div className="bg-green-900/80 rounded-xl p-4 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">Admin Notifications</h3>
            <ul className="space-y-2">
              {adminNotifications.map((notif, i) => (
                <li key={i} className={`p-2 rounded bg-green-800/80 text-white flex items-center gap-2 ${notif.type === 'error' ? 'border-l-4 border-red-400' : notif.type === 'success' ? 'border-l-4 border-lime-400' : 'border-l-4 border-blue-300'}`}>
                  <span className="font-bold">[{notif.type?.toUpperCase() || 'INFO'}]</span>
                  <span>{notif.message}</span>
                  <span className="ml-auto text-xs opacity-60">{notif.time}</span>
                </li>
              ))}
              {adminNotifications.length === 0 && <li className="text-green-200">No admin notifications yet.</li>}
            </ul>
          </div>
        </div>
        {isAdmin && (
          <div className="mb-4 flex items-center gap-4">
            <Button onClick={handleSyncAuthUsers} disabled={syncing} variant="outline">
              {syncing ? 'Syncing...' : 'Sync Auth Users'}
            </Button>
            {syncSummary && <span className="text-green-700 dark:text-green-300 text-sm font-semibold">{syncSummary}</span>}
          </div>
        )}
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input placeholder="Search by name, email, phone" value={search} onChange={e => setSearch(e.target.value)} />
          <Select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <SelectItem value="all">All Roles</SelectItem>
            {ROLES.map(r => <SelectItem key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</SelectItem>)}
          </Select>
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}
          </Select>
        </div>
        {/* Bulk Actions */}
        <div className="flex gap-2 mb-2">
          <Button size="sm" variant="outline" disabled={!selected.length || loading} onClick={handleBulkApprove}>Approve</Button>
          <Button size="sm" variant="outline" disabled={!selected.length || loading} onClick={handleBulkSuspend}>Suspend</Button>
          <Button size="sm" variant="outline" disabled={!selected.length || loading} onClick={handleBulkDelete}>Delete</Button>
          <Button size="sm" variant="outline" disabled={!selected.length || loading} onClick={handleBulkExport}>Export</Button>
        </div>
        {/* Users Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell><input type="checkbox" checked={selected.length === filteredUsers.length && filteredUsers.length > 0} onChange={handleSelectAll} /></TableCell>
                <TableCell>Avatar</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>2FA</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {filteredUsers.map(u => (
                <TableRow key={u.id}>
                  <TableCell><input type="checkbox" checked={selected.includes(u.id)} onChange={() => handleSelect(u.id)} /></TableCell>
                  <TableCell><img src={u.avatar_url || '/avatar.png'} alt="User" className="h-8 w-8 rounded-full" /></TableCell>
                  <TableCell>{u.full_name || `${u.first_name || ''} ${u.last_name || ''}`}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}>
                      {ROLES.map(r => <SelectItem key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</SelectItem>)}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select value={u.status} onChange={e => handleStatusChange(u.id, e.target.value)}>
                      {STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}
                    </Select>
                  </TableCell>
                  <TableCell><Switch checked={!!u.two_fa_enabled} onChange={() => {}} /></TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => { setProfileModalUser(u); setProfileModalOpen(true); }}>View</Button>
                    <Button size="sm" variant="outline" onClick={() => { setEditMode(true); setProfileModalUser(u); setProfileModalOpen(true); }}>Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => handleImpersonate(u)} disabled={impersonating}>Impersonate</Button>
                    {impersonating && <Button size="sm" variant="outline" onClick={handleRevertImpersonation}>Revert to Admin</Button>}
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange(u.id, 'active')}>Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange(u.id, 'inactive')}>Suspend</Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteUser(u.id)}>Delete</Button>
                    <Button size="sm" variant="outline" onClick={() => handleExportUser(u)}>Export</Button>
                    <Button size="sm" variant="outline" onClick={() => setShow2FAModal(true)}>2FA</Button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
        <UserProfileModal user={profileModalUser} open={profileModalOpen} onClose={() => setProfileModalOpen(false)} onRefresh={fetchUsers} />
      </CardContent>
    </Card>
  );
}