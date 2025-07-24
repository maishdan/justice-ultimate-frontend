import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Card, CardContent } from '../../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { Button } from '../../ui/button';
import DocumentUploader from '../uploads/DocumentUploader';
import jsPDF from 'jspdf';
import { supabase } from '../../../lib/supabaseClient';

// Remove mockActivity, company, preferences, auditLogs, documents, and all test/demo data

export default function AdminProfilePanel() {
  const { t } = useLanguage();
  const [tab, setTab] = useState('personal');
  const [profile, setProfile] = useState<any>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  // Add missing state for editing and uploading
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return;
      }
      // Try admin_profiles first
      let { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error || !data) {
        // fallback to profiles
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (fallbackError || !fallbackData) {
          return;
        }
        setProfile(fallbackData);
        setPhotoPreview(fallbackData.avatar_url || '');
      } else {
        setProfile(data);
        setPhotoPreview(data.avatar_url || '');
      }
    }
    fetchProfile();
  }, []);

  // Handle profile picture upload (stub, add Supabase logic later)
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be ≤ 5MB');
        return;
      }
      setUploading(true);
      setPhotoPreview(URL.createObjectURL(file)); // Show local preview immediately
      const fileExt = file.name.split('.').pop();
      // Ensure fileName is just the filename, no slashes
      const fileName = `${profile?.id || 'admin'}_${Date.now()}.${fileExt}`;
      // Upload to avatars bucket with just the filename
      const { error } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true });
      if (error) {
        alert('Image upload failed');
        setUploading(false);
        return;
      }
      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const publicUrl = data.publicUrl;
      setPhotoPreview(publicUrl);
      setProfile({ ...profile, avatar_url: publicUrl });
      // Update profile photo in Supabase
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        setUploading(false);
        return;
      }
      await Promise.race([
        supabase.from('admin_profiles').update({ avatar_url: publicUrl }).eq('id', user.data.user.id),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 30000))
      ]).catch(async () => {
        await Promise.race([
          supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.data.user.id),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 30000))
        ]);
      });
      setUploading(false);
    }
  };

  // Handle profile field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Handle save (stub, add Supabase logic later)
  const handleSave = async () => {
    setEditing(false);
    setUploading(true);
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      setUploading(false);
      return;
    }
    const updateData = {
      full_name: profile.full_name,
      email: profile.email,
      phone: profile.phone,
      national_id: profile.national_id,
      role: profile.role,
      status: profile.status,
      date_joined: profile.date_joined,
      avatar_url: profile.avatar_url,
      two_fa_enabled: profile.two_fa_enabled,
      last_login: profile.last_login,
      branch: profile.branch,
      department: profile.department,
      supervisor: profile.supervisor,
      language: profile.language,
      timezone: profile.timezone,
      dateFormat: profile.dateFormat,
      dashboard: profile.dashboard,
    };
    // 30s timeout for Supabase update
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 30000));
    try {
      await Promise.race([
        supabase.from('admin_profiles').update(updateData).eq('id', user.data.user.id),
        timeout
      ]);
    } catch {
      // fallback to profiles
      try {
        await Promise.race([
          supabase.from('profiles').update(updateData).eq('id', user.data.user.id),
          timeout
        ]);
      } catch {}
    }
    setUploading(false);
  };

  // PDF Export handler
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    // Add logo (top left)
    doc.addImage('https://gzmgfgcgytafngvliqqj.supabase.co/storage/v1/object/public/avatars//logo.png', 'PNG', 10, 10, 30, 20);
    // Add coat of arms (top right)
    doc.addImage('https://gzmgfgcgytafngvliqqj.supabase.co/storage/v1/object/public/avatars//kenyan%20coat%20of%20arms.png', 'PNG', 170, 10, 30, 20);
    // Title
    doc.setFontSize(18);
    doc.text('ADMIN PROFILE SUMMARY', 105, 40, { align: 'center' });
    // Profile info
    doc.setFontSize(12);
    let y = 55;
    doc.text(`Full Name: ${profile?.full_name || ''}`, 20, y); y += 8;
    doc.text(`Role: ${profile?.role || ''}`, 20, y); y += 8;
    doc.text(`Email: ${profile?.email || ''}`, 20, y); y += 8;
    doc.text(`Phone: ${profile?.phone || ''}`, 20, y); y += 8;
    doc.text(`Status: ${profile?.status || ''}`, 20, y); y += 8;
    doc.text(`Joined: ${profile?.date_joined || ''}`, 20, y); y += 8;
    // Timestamp
    const now = new Date();
    const timestamp = now.toLocaleString('en-KE', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Africa/Nairobi' });
    doc.text(`Generated on: ${timestamp}`, 20, y + 8);
    // Signature block
    doc.text('Signature: _________________________________', 20, y + 24);
    // Watermark
    doc.setFontSize(30);
    doc.setTextColor(200, 200, 200);
    doc.text('Justice Ultimate Automobiles', 105, 150, { align: 'center', angle: 20 });
    // Download
    doc.save('admin-profile-summary.pdf');
  };

  // --- Company Section State ---
  // Remove company state

  // --- Preferences State ---
  // Remove preferences state

  // --- Audit Trail State ---
  // Remove auditLogs state
  const [auditFilter, setAuditFilter] = useState({ action: '', date: '', status: '' });

  // Fix filteredLogs typing
  const filteredLogs: any[] = [];

  // --- Document Center State ---
  // Remove documents state

  const tabList = [
    { key: 'personal', label: '👤 Personal Info' },
    { key: 'security', label: '🔐 Security & Access' },
    { key: 'pdf', label: '🧾 PDF Export' },
    { key: 'company', label: '🏢 Company' },
    { key: 'preferences', label: '🌐 Preferences' },
    { key: 'audit', label: '🧾 Audit Trail' },
    { key: 'documents', label: '🗃️ Documents' },
    { key: 'linked', label: '🧩 Linked Features' },
    { key: 'quickinfo', label: '🎨 Quick Info' },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-4">{t('adminProfile') || 'Admin Profile'}</h2>
        <Tabs>
          <TabsList>
            {tabList.map(tabItem => (
              <TabsTrigger
                key={tabItem.key}
                label={tabItem.label}
                selected={tab === tabItem.key}
                onClick={() => setTab(tabItem.key)}
              />
            ))}
          </TabsList>

          {tab === 'personal' && (
            <TabsContent>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center gap-2 w-full md:w-1/3">
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover shadow border-4 border-green-700"
                  />
                  <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="bg-green-600 text-white hover:bg-green-700">Upload Photo</Button>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="mt-1 text-xs"
                    ref={fileInputRef}
                    hidden
                  />
                  {/* TODO: Add crop preview tool */}
                </div>
                {/* Editable Fields */}
                <div className="flex-1 space-y-3">
                  <div className="flex gap-2 items-center">
                    {editing ? (
                      <input
                        name="name"
                        value={profile?.full_name || ''}
                        onChange={handleChange}
                        className="p-2 rounded border w-full font-semibold text-lg bg-white text-gray-900"
                        placeholder={t('fullName') || 'Full Name'}
                      />
                    ) : (
                      <span className="block p-2 rounded border w-full font-semibold text-lg text-gray-900 bg-white/80">{profile?.full_name || ''}</span>
                    )}
                    <span className="px-2 py-1 bg-green-700 text-white rounded text-xs">{profile?.role || ''}</span>
                  </div>
                  <input
                    name="email"
                    value={profile?.email || ''}
                    disabled
                    className="p-2 rounded border w-full dark:bg-gray-900"
                    placeholder={t('email') || 'Email'}
                    type="email"
                  />
                  <input
                    name="phone"
                    value={profile?.phone || ''}
                    onChange={handleChange}
                    disabled={!editing}
                    className="p-2 rounded border w-full font-semibold text-lg bg-white text-gray-900"
                    placeholder={t('phoneNumber') || 'Phone Number'}
                    type="tel"
                  />
                  {editing ? (
                    <input
                      name="nationalId"
                      value={profile?.national_id || ''}
                      onChange={handleChange}
                      className="p-2 rounded border w-full font-semibold text-lg bg-white text-gray-900"
                      placeholder={t('nationalIdOrPassport') || 'National ID / Passport'}
                    />
                  ) : (
                    <span className="block p-2 rounded border w-full font-semibold text-lg text-gray-900 bg-white/80">{profile?.national_id || ''}</span>
                  )}
                  <div className="flex items-center gap-3">
                    <label className="font-medium text-sm">{t('status') || 'Status'}:</label>
                    <Button
                      type="button"
                      variant={profile?.status === 'Active' ? 'default' : 'outline'}
                      className={profile?.status === 'Active' ? 'bg-green-700' : 'bg-gray-400'}
                      onClick={() => editing && setProfile({ ...profile, status: profile?.status === 'Active' ? 'Suspended' : 'Active' })}
                      disabled={!editing}
                    >
                      {profile?.status === 'Active' ? (t('active') || 'Active') : (t('suspended') || 'Suspended')}
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="font-medium text-sm">{t('dateJoined') || 'Date Joined'}:</label>
                    {editing ? (
                      <input
                        type="date"
                        name="date_joined"
                        value={profile?.date_joined || ''}
                        onChange={handleChange}
                        className="p-2 rounded border w-full font-semibold text-lg bg-white text-gray-900"
                      />
                    ) : (
                      <span className="text-sm text-gray-700 dark:text-gray-300">{profile?.date_joined || '2025-07-16'}</span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button type="button" onClick={() => setEditing(!editing)} variant="outline" className="bg-gray-600 text-white hover:bg-gray-700">
                      {editing ? t('cancel') || 'Cancel' : t('edit') || 'Edit'}
                    </Button>
                    {editing && (
                      <Button type="button" onClick={handleSave} disabled={uploading} className="bg-blue-600 text-white hover:bg-blue-700">
                        {uploading ? t('saving') || 'Saving...' : t('save') || 'Save'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
          {tab === 'security' && (
            <TabsContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* 2FA Toggle */}
                  <div className="flex-1 space-y-2">
                    <label className="font-semibold flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={profile?.two_fa_enabled || false}
                        onChange={() => setProfile({ ...profile, two_fa_enabled: !profile?.two_fa_enabled })}
                        className="accent-green-700"
                        disabled={!editing}
                      />
                      {t('enable2FA') || 'Enable 2FA (Two-Factor Auth)'}
                    </label>
                    <Button type="button" variant="outline" className="mt-2 w-fit">
                      {t('changePassword') || 'Change Password'}
                    </Button>
                  </div>
                  {/* Last Login & Device History */}
                  <div className="flex-1 space-y-2">
                    <div>
                      <span className="font-semibold">{t('lastLogin') || 'Last Login'}: </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{profile?.last_login || '2025-07-16 10:30AM'}</span>
                    </div>
                    <div>
                      <span className="font-semibold">{t('deviceHistory') || 'Device History'}:</span>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 mt-1 list-disc list-inside">
                        <li>Chrome on Windows (Nairobi, 2 hours ago)</li>
                        <li>Safari on iPhone (Mombasa, 1 day ago)</li>
                        <li>Firefox on Android (Kisumu, 3 days ago)</li>
                      </ul>
                    </div>
                    <Button type="button" variant="danger" className="mt-2 w-fit">
                      {t('logoutAllDevices') || 'Logout From All Devices'}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
          {tab === 'pdf' && (
            <TabsContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <img src='https://gzmgfgcgytafngvliqqj.supabase.co/storage/v1/object/public/avatars//logo.png' alt="Company Logo" className="h-12 w-auto bg-gray-100 rounded" />
                  <img src='https://gzmgfgcgytafngvliqqj.supabase.co/storage/v1/object/public/avatars//kenyan%20coat%20of%20arms.png' alt="Kenyan Coat of Arms" className="h-12 w-auto bg-gray-100 rounded" />
                </div>
                <h1 className="text-xl font-bold mt-4 mb-2">Admin Profile Summary</h1>
                <div className="space-y-1">
                  <p><strong>Name:</strong> {profile?.full_name || ''}</p>
                  <p><strong>Email:</strong> {profile?.email || ''}</p>
                  <p><strong>Role:</strong> {profile?.role || ''}</p>
                  <p><strong>Status:</strong> {profile?.status || ''}</p>
                  <p><strong>Joined:</strong> {profile?.date_joined || ''}</p>
                </div>
                <Button onClick={handleDownloadPDF} className="mt-4">Download Profile PDF</Button>
                <div className="text-xs text-gray-500 mt-2">* Branding images are placeholders. Add your base64 logos as instructed after all features are complete.</div>
              </div>
            </TabsContent>
          )}
          {tab === 'company' && (
            <TabsContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-semibold mb-1">{t('branch') || 'Assigned Branch/Region'}</label>
                    <input
                      name="branch"
                      value={profile?.branch || ''} // Use profile state for company fields
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, branch: e.target.value })}
                      className="p-2 rounded border w-full dark:bg-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">{t('department') || 'Department'}</label>
                    <input
                      name="department"
                      value={profile?.department || ''} // Use profile state for company fields
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, department: e.target.value })}
                      className="p-2 rounded border w-full dark:bg-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">{t('supervisor') || 'Supervisor/Reports to'}</label>
                    <input
                      name="supervisor"
                      value={profile?.supervisor || ''} // Use profile state for company fields
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, supervisor: e.target.value })}
                      className="p-2 rounded border w-full dark:bg-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-2">{t('managedStaff') || 'Managed Staff'}</label>
                  <table className="w-full text-sm bg-white dark:bg-gray-900 rounded shadow">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="text-left p-2">{t('name') || 'Name'}</th>
                        <th className="text-left p-2">{t('role') || 'Role'}</th>
                        <th className="text-left p-2">{t('status') || 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* No managed staff data to display */}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          )}
          {tab === 'preferences' && (
            <TabsContent>
              <div className="space-y-6 max-w-lg">
                <div>
                  <label className="block font-semibold mb-1">{t('language') || 'Language'}</label>
                  <select
                    name="language"
                    value={profile?.language || 'English'} // Use profile state for preferences
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setProfile({ ...profile, language: e.target.value })}
                    className="p-2 rounded border w-full dark:bg-gray-900"
                  >
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="Swahili">Swahili</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">{t('timezone') || 'Timezone'}</label>
                  <select
                    name="timezone"
                    value={profile?.timezone || 'Africa/Nairobi'} // Use profile state for preferences
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setProfile({ ...profile, timezone: e.target.value })}
                    className="p-2 rounded border w-full dark:bg-gray-900"
                  >
                    <option value="Africa/Nairobi">Africa/Nairobi</option>
                    <option value="Africa/Mombasa">Africa/Mombasa</option>
                    <option value="Africa/Kampala">Africa/Kampala</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">{t('dateFormat') || 'Date/Time Format'}</label>
                  <select
                    name="dateFormat"
                    value={profile?.dateFormat || '16 July 2025 - 10:45AM'} // Use profile state for preferences
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setProfile({ ...profile, dateFormat: e.target.value })}
                    className="p-2 rounded border w-full dark:bg-gray-900"
                  >
                    <option value="16 July 2025 - 10:45AM">16 July 2025 - 10:45AM</option>
                    <option value="2025-07-16 10:45">2025-07-16 10:45</option>
                    <option value="07/16/2025, 10:45 AM">07/16/2025, 10:45 AM</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">{t('dashboard') || 'Default Dashboard'}</label>
                  <select
                    name="dashboard"
                    value={profile?.dashboard || 'Analytics'} // Use profile state for preferences
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setProfile({ ...profile, dashboard: e.target.value })}
                    className="p-2 rounded border w-full dark:bg-gray-900"
                  >
                    <option value="Analytics">Analytics</option>
                    <option value="Approvals">Approvals</option>
                    <option value="Inventory">Inventory</option>
                  </select>
                </div>
              </div>
            </TabsContent>
          )}
          {tab === 'audit' && (
            <TabsContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 mb-2">
                  <select
                    value={auditFilter.action}
                    onChange={e => setAuditFilter({ ...auditFilter, action: e.target.value })}
                    className="p-2 rounded border dark:bg-gray-900"
                  >
                    <option value="">{t('allActions') || 'All Actions'}</option>
                    <option value="Approved Car">Approved Car</option>
                    <option value="Deleted Car">Deleted Car</option>
                    <option value="User Approval">User Approval</option>
                    <option value="Generated Receipt">Generated Receipt</option>
                    <option value="Login">Login</option>
                    <option value="Logout">Logout</option>
                  </select>
                  <input
                    type="date"
                    value={auditFilter.date}
                    onChange={e => setAuditFilter({ ...auditFilter, date: e.target.value })}
                    className="p-2 rounded border dark:bg-gray-900"
                  />
                  <select
                    value={auditFilter.status}
                    onChange={e => setAuditFilter({ ...auditFilter, status: e.target.value })}
                    className="p-2 rounded border dark:bg-gray-900"
                  >
                    <option value="">{t('allStatuses') || 'All Statuses'}</option>
                    <option value="Success">Success</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                <table className="w-full text-sm bg-white dark:bg-gray-900 rounded shadow">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="text-left p-2">{t('action') || 'Action'}</th>
                      <th className="text-left p-2">{t('date') || 'Date'}</th>
                      <th className="text-left p-2">{t('status') || 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.length === 0 ? (
                      <tr><td colSpan={3} className="p-2 text-center text-gray-400">No logs found.</td></tr>
                    ) : (
                      filteredLogs.map(log => (
                        <tr key={log.id} className="border-b dark:border-gray-700">
                          <td className="p-2">{log.action}</td>
                          <td className="p-2">{log.date}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${log.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{log.status}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          )}
          {tab === 'documents' && (
            <TabsContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block font-semibold mb-1">{t('uploadId') || 'Upload Scanned ID/Passport'}</label>
                    <DocumentUploader />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">{t('uploadKraPin') || 'Upload KRA PIN'}</label>
                    <DocumentUploader />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">{t('uploadLicense') || 'Upload Admin License'}</label>
                    <DocumentUploader />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-2">{t('submittedDocs') || 'Submitted Documents'}</label>
                  <table className="w-full text-sm bg-white dark:bg-gray-900 rounded shadow">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="text-left p-2">{t('document') || 'Document'}</th>
                        <th className="text-left p-2">{t('status') || 'Status'}</th>
                        <th className="text-left p-2">{t('action') || 'Action'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* No documents data to display */}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          )}
          {tab === 'linked' && (
            <TabsContent>
              <div className="space-y-6 max-w-lg">
                <Button className="w-full" variant="outline">
                  🔁 {t('switchView') || 'Switch to Customer/Staff View'}
                </Button>
                <Button className="w-full" variant="danger">
                  🛑 {t('deactivateAccount') || 'Deactivate My Account'}
                </Button>
                <div className="text-xs text-red-500 mb-2">{t('deactivateApprovalNote') || 'Deactivation requires higher approval.'}</div>
                <Button className="w-full" variant="primary">
                  💬 {t('contactSupport') || 'Contact Support / System Superadmin'}
                </Button>
              </div>
            </TabsContent>
          )}
          {tab === 'quickinfo' && (
            <TabsContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-900/70 rounded-xl p-6 shadow-lg flex flex-col items-center text-center">
                  <div className="text-2xl font-bold mb-1">{profile?.full_name || ''}</div>
                  <div className="text-green-100 font-semibold mb-1">{profile?.role || ''}</div>
                  <div className="text-xs text-green-200">Name + Role</div>
                </div>
                <div className="bg-green-900/70 rounded-xl p-6 shadow-lg flex flex-col items-center text-center">
                  <div className="text-2xl mb-1">{profile?.status === 'Active' ? '✅' : '❌'}</div>
                  <div className="text-xl font-bold text-white">{profile?.status || ''}</div>
                  <div className="text-xs text-green-200">Status</div>
                </div>
                <div className="bg-green-900/70 rounded-xl p-6 shadow-lg flex flex-col items-center text-center">
                  <div className="text-xl font-bold text-white">{profile?.last_login || ''}</div>
                  <div className="text-xs text-green-200">Last Login</div>
                </div>
                <div className="bg-green-900/70 rounded-xl p-6 shadow-lg flex flex-col items-center text-center">
                  <div className="text-2xl font-bold text-white">145</div>
                  <div className="text-xs text-green-200">Total Cars Approved</div>
                </div>
                <div className="bg-green-900/70 rounded-xl p-6 shadow-lg flex flex-col items-center text-center">
                  <div className="text-2xl font-bold text-white">6</div>
                  <div className="text-xs text-green-200">Total Staff Managed</div>
                </div>
                <div className="bg-green-900/70 rounded-xl p-6 shadow-lg flex flex-col items-center text-center">
                  <div className="text-xl font-bold text-white">{profile?.date_joined || ''}</div>
                  <div className="text-xs text-green-200">Joined</div>
                </div>
                <div className="bg-green-900/70 rounded-xl p-6 shadow-lg flex flex-col items-center text-center">
                  <div className="text-2xl mb-1">✅</div>
                  <div className="text-xl font-bold text-green-300">Account Verified</div>
                  <div className="text-xs text-green-200">Verified</div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
} 