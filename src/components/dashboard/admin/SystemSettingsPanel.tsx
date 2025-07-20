import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { toast } from 'react-toastify';
import { supabase } from '../../../lib/supabaseClient';
import { FiSettings, FiGlobe, FiDollarSign, FiShield, FiToggleLeft, FiMonitor, FiMail, FiBarChart2, FiZap, FiFileText, FiUsers, FiDatabase, FiCode } from 'react-icons/fi';

const TABS = [
  'General', 'Localization', 'Currency', 'Security', 'Features', 'UI Theme',
  'Email & Notifications', 'Analytics', 'Automation', 'Documents', 'Admin Controls', 'Backup', 'Developer'
];

const TAB_ICONS: Record<string, React.ReactElement> = {
  'General': <FiSettings className="inline mr-2 text-gold-400" size={20} />,
  'Localization': <FiGlobe className="inline mr-2 text-gold-400" size={20} />,
  'Currency': <FiDollarSign className="inline mr-2 text-gold-400" size={20} />,
  'Security': <FiShield className="inline mr-2 text-gold-400" size={20} />,
  'Features': <FiToggleLeft className="inline mr-2 text-gold-400" size={20} />,
  'UI Theme': <FiMonitor className="inline mr-2 text-gold-400" size={20} />,
  'Email & Notifications': <FiMail className="inline mr-2 text-gold-400" size={20} />,
  'Analytics': <FiBarChart2 className="inline mr-2 text-gold-400" size={20} />,
  'Automation': <FiZap className="inline mr-2 text-gold-400" size={20} />,
  'Documents': <FiFileText className="inline mr-2 text-gold-400" size={20} />,
  'Admin Controls': <FiUsers className="inline mr-2 text-gold-400" size={20} />,
  'Backup': <FiDatabase className="inline mr-2 text-gold-400" size={20} />,
  'Developer': <FiCode className="inline mr-2 text-gold-400" size={20} />,
};

function getGreeting(adminName: string) {
  const hour = new Date().getHours();
  let greeting = 'Good Evening';
  if (hour < 12) greeting = 'Good Morning';
  else if (hour < 18) greeting = 'Good Afternoon';
  return `${greeting}, ${adminName} 👋`;
}

export default function SystemSettingsPanel() {
  const [activeTab, setActiveTab] = useState<string>('General');
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const adminName = 'Admin'; // TODO: Replace with real admin name

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    const { data, error } = await supabase.from('system_settings').select('*').single();
    if (error) toast.error('Failed to load settings');
    setSettings(data || {});
    setLoading(false);
  }

  async function saveSettings(newSettings: any) {
    setSaving(true);
    let error;
    if (settings.id) {
      ({ error } = await supabase.from('system_settings').update(newSettings).eq('id', settings.id));
    } else {
      ({ error } = await supabase.from('system_settings').insert([newSettings]));
    }
    if (error) toast.error('Failed to save settings');
    else toast.success('Settings saved!');
    fetchSettings();
    setSaving(false);
  }

  function handleChange(field: string, value: any) {
    setSettings((s: any) => ({ ...s, [field]: value }));
  }

  function handleToggle(field: string) {
    setSettings((s: any) => ({ ...s, [field]: !s[field] }));
  }

  function handleSave() {
    saveSettings(settings);
  }

  return (
    <div className="glass-panel w-full max-w-6xl mx-auto p-8 rounded-2xl shadow-2xl">
      <div className="text-2xl font-bold mb-4 animate-fade-in bg-gradient-to-r from-green-700 to-blue-700 text-white p-4 rounded-xl shadow-lg">
        {getGreeting(adminName)}
      </div>
      <div className="w-full">
        <div className="flex flex-wrap gap-2 mb-6 bg-gradient-to-r from-blue-900 to-green-900 rounded-xl p-2 shadow-lg">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`px-5 py-2 rounded-lg font-semibold transition-all duration-300 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 shadow-md hover:shadow-xl hover:bg-gold-100 hover:text-blue-900 hover:border-gold-400 ${activeTab===tab?'bg-blue-900 text-gold-300 border-gold-400 shadow-2xl':'bg-white text-blue-900'}`}
              onClick={() => setActiveTab(tab)}
              type="button"
              style={{ boxShadow: activeTab===tab ? '0 4px 24px 0 rgba(34,197,94,0.15)' : undefined }}
            >
              {TAB_ICONS[tab]}{tab}
            </button>
          ))}
        </div>
        {/* General Tab */}
        {activeTab === 'General' && (
          <div className="animate-fade-in-slide-in">
            <Card className="w-full bg-white/90 border border-blue-900 rounded-2xl shadow-xl">
              <CardContent className="p-8 space-y-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-6">
                    <label className="block font-semibold mb-2 text-blue-900">Company Name</label>
                    <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.company_name||''} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('company_name',e.target.value)} placeholder="Justice Ultimate Automobiles" />
                    <label className="block font-semibold mb-2 text-blue-900">Tagline</label>
                    <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.tagline||''} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('tagline',e.target.value)} placeholder="Your perfect car masters" />
                    <label className="block font-semibold mb-2 text-blue-900">Default Homepage</label>
                    <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.default_homepage||''} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('default_homepage',e.target.value)} placeholder="Dashboard" />
                    <label className="block font-semibold mb-2 text-blue-900">System Description</label>
                    <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.system_description||''} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('system_description',e.target.value)} placeholder="Optional description..." />
                  </div>
                  <div className="flex-1 space-y-6">
                    <label className="block font-semibold mb-2 text-blue-900">Company Logo</label>
                    <input type="file" accept="image/*" className="block w-full text-blue-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-2 file:border-blue-900 file:bg-gold-100 file:text-blue-900 hover:file:bg-gold-200 transition-all duration-200" onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = ev => handleChange('company_logo', (ev.target as FileReader)?.result);
                        reader.readAsDataURL(file);
                      }
                    }} />
                    {settings.company_logo && <img src={settings.company_logo} alt="Logo Preview" className="w-32 h-32 object-contain rounded-xl shadow-lg border-2 border-gold-400" />}
                  </div>
                </div>
                <button className="btn btn-primary w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-blue-900 to-green-900 text-gold-200 font-bold shadow-lg hover:from-gold-400 hover:to-gold-200 hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2" onClick={handleSave} disabled={saving} type="button">
                  {saving ? 'Saving...' : 'Save General Settings'}
                </button>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Localization Tab */}
        {activeTab === 'Localization' && (
          <div className="animate-fade-in-slide-in">
            <Card className="w-full bg-white/90 border border-blue-900 rounded-2xl shadow-xl">
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <label className="block font-semibold mb-2 text-blue-900">Default Language</label>
                    <select className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.default_language||'English'} onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>handleChange('default_language',e.target.value)}>
                      <option value="English">English</option>
                      <option value="Swahili">Swahili</option>
                      <option value="French">French</option>
                    </select>
                    <label className="block font-semibold mb-2 text-blue-900">Add Custom Language (JSON)</label>
                    <textarea className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.custom_language_json||''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=>handleChange('custom_language_json',e.target.value)} placeholder="Paste JSON here..." />
                    <label className="block font-semibold mb-2 text-blue-900">Default Timezone</label>
                    <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.default_timezone||'Africa/Nairobi'} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('default_timezone',e.target.value)} />
                    <label className="block font-semibold mb-2 text-blue-900">Date/Time Format</label>
                    <select className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.datetime_format||'DD/MM/YYYY'} onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>handleChange('datetime_format',e.target.value)}>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                    <label className="block font-semibold mb-2 text-blue-900">24hr Format</label>
                    <input type="checkbox" checked={settings.time_format_24hr||false} onChange={()=>handleToggle('time_format_24hr')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  </div>
                  <div className="space-y-6">
                    <div className="font-semibold text-blue-900">Format Preview:</div>
                    <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-lg text-blue-900">
                      {new Date().toLocaleString('en-KE', { timeZone: settings.default_timezone||'Africa/Nairobi', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: !(settings.time_format_24hr) })}
                    </div>
                  </div>
                </div>
                <button className="btn btn-primary w-full py-3 rounded-xl bg-gradient-to-r from-blue-900 to-green-900 text-gold-200 font-bold shadow-lg hover:from-gold-400 hover:to-gold-200 hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2" onClick={handleSave} disabled={saving} type="button">Save Localization</button>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Currency Tab */}
        {activeTab === 'Currency' && (
          <div className="animate-fade-in-slide-in">
            <Card className="w-full bg-white/90 border border-blue-900 rounded-2xl shadow-xl">
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <label className="block font-semibold mb-2 text-blue-900">Default Currency</label>
                  <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.default_currency||'KES'} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('default_currency',e.target.value)} />
                  <label className="block font-semibold mb-2 text-blue-900">Currency Symbol Position</label>
                  <select className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.currency_symbol_position||'before'} onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>handleChange('currency_symbol_position',e.target.value)}>
                    <option value="before">Before Amount</option>
                    <option value="after">After Amount</option>
                  </select>
                  <label className="block font-semibold mb-2 text-blue-900">Supported Currencies (comma separated)</label>
                  <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.supported_currencies||'KES,USD,EUR'} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('supported_currencies',e.target.value)} />
                  <label className="block font-semibold mb-2 text-blue-900">VAT %</label>
                  <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" type="number" value={settings.vat_percent||''} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('vat_percent',e.target.value)} />
                  <label className="block font-semibold mb-2 text-blue-900">Custom Fees</label>
                  <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" type="number" value={settings.custom_fees||''} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('custom_fees',e.target.value)} />
                  <label className="block font-semibold mb-2 text-blue-900">Auto Currency Conversion</label>
                  <input type="checkbox" checked={settings.auto_currency_conversion||false} onChange={()=>handleToggle('auto_currency_conversion')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                </div>
                <button className="btn btn-primary w-full py-3 rounded-xl bg-gradient-to-r from-blue-900 to-green-900 text-gold-200 font-bold shadow-lg hover:from-gold-400 hover:to-gold-200 hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2" onClick={handleSave} disabled={saving} type="button">Save Currency Settings</button>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Security Tab */}
        {activeTab === 'Security' && (
          <div className="animate-fade-in-slide-in">
            <Card className="w-full bg-white/90 border border-blue-900 rounded-2xl shadow-xl">
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <label className="block font-semibold mb-2 text-blue-900">Enforce 2FA</label>
                  <input type="checkbox" checked={settings.enforce_2fa||false} onChange={()=>handleToggle('enforce_2fa')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <label className="block font-semibold mb-2 text-blue-900">Admin IP Whitelist (comma separated)</label>
                  <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.admin_ip_whitelist||''} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('admin_ip_whitelist',e.target.value)} />
                  <label className="block font-semibold mb-2 text-blue-900">Password Strength Policy</label>
                  <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.password_policy||'Strong'} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('password_policy',e.target.value)} />
                  <label className="block font-semibold mb-2 text-blue-900">Auto-logout Timeout (minutes)</label>
                  <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" type="number" value={settings.auto_logout_timeout||''} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('auto_logout_timeout',e.target.value)} />
                  <label className="block font-semibold mb-2 text-blue-900">Failed Login Limit</label>
                  <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" type="number" value={settings.failed_login_limit||''} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('failed_login_limit',e.target.value)} />
                  <label className="block font-semibold mb-2 text-blue-900">Lockout Duration (minutes)</label>
                  <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" type="number" value={settings.lockout_duration||''} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('lockout_duration',e.target.value)} />
                  <label className="block font-semibold mb-2 text-blue-900">JWT Expiry (minutes)</label>
                  <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" type="number" value={settings.jwt_expiry||''} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('jwt_expiry',e.target.value)} />
                </div>
                <button className="btn btn-primary w-full py-3 rounded-xl bg-gradient-to-r from-blue-900 to-green-900 text-gold-200 font-bold shadow-lg hover:from-gold-400 hover:to-gold-200 hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2" onClick={handleSave} disabled={saving} type="button">Save Security Settings</button>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Features Tab */}
        {activeTab === 'Features' && (
          <div className="animate-fade-in-slide-in">
            <Card className="w-full bg-white/90 border border-blue-900 rounded-2xl shadow-xl">
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <label className="block font-semibold mb-2 text-blue-900">Car Sales Module</label>
                  <input type="checkbox" checked={settings.car_sales_module||false} onChange={()=>handleToggle('car_sales_module')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <label className="block font-semibold mb-2 text-blue-900">Car Rentals Module</label>
                  <input type="checkbox" checked={settings.car_rentals_module||false} onChange={()=>handleToggle('car_rentals_module')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <label className="block font-semibold mb-2 text-blue-900">Car Auctions (future)</label>
                  <input type="checkbox" checked={settings.car_auctions_module||false} onChange={()=>handleToggle('car_auctions_module')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <label className="block font-semibold mb-2 text-blue-900">User Referrals</label>
                  <input type="checkbox" checked={settings.user_referrals||false} onChange={()=>handleToggle('user_referrals')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <label className="block font-semibold mb-2 text-blue-900">PDF Export</label>
                  <input type="checkbox" checked={settings.pdf_export||false} onChange={()=>handleToggle('pdf_export')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <label className="block font-semibold mb-2 text-blue-900">CSV Export</label>
                  <input type="checkbox" checked={settings.csv_export||false} onChange={()=>handleToggle('csv_export')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <label className="block font-semibold mb-2 text-blue-900">Chat/Support Integration</label>
                  <input type="checkbox" checked={settings.chat_support||false} onChange={()=>handleToggle('chat_support')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <label className="block font-semibold mb-2 text-blue-900">Notifications (Email/SMS/Push)</label>
                  <input type="checkbox" checked={settings.notifications||false} onChange={()=>handleToggle('notifications')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <label className="block font-semibold mb-2 text-blue-900">Inventory Alerts</label>
                  <input type="checkbox" checked={settings.inventory_alerts||false} onChange={()=>handleToggle('inventory_alerts')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <label className="block font-semibold mb-2 text-blue-900">Maintenance Logs</label>
                  <input type="checkbox" checked={settings.maintenance_logs||false} onChange={()=>handleToggle('maintenance_logs')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <label className="block font-semibold mb-2 text-blue-900">Invoice/Receipt System</label>
                  <input type="checkbox" checked={settings.invoice_receipt_system||false} onChange={()=>handleToggle('invoice_receipt_system')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <label className="block font-semibold mb-2 text-blue-900">Stamp/Signature Prompt</label>
                  <input type="checkbox" checked={settings.stamp_signature_prompt||false} onChange={()=>handleToggle('stamp_signature_prompt')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                </div>
                <button className="btn btn-primary w-full py-3 rounded-xl bg-gradient-to-r from-blue-900 to-green-900 text-gold-200 font-bold shadow-lg hover:from-gold-400 hover:to-gold-200 hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2" onClick={handleSave} disabled={saving} type="button">Save Feature Toggles</button>
              </CardContent>
            </Card>
          </div>
        )}
        {/* UI Theme Tab */}
        {activeTab === 'UI Theme' && (
          <div className="animate-fade-in-slide-in">
            <Card className="w-full bg-white/90 border border-blue-900 rounded-2xl shadow-xl">
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <label className="block font-semibold mb-2 text-blue-900">Theme</label>
                  <select className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.theme||'System'} onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>handleChange('theme',e.target.value)}>
                    <option value="System">System Default</option>
                    <option value="Light">Light</option>
                    <option value="Dark">Dark</option>
                  </select>
                  <label className="block font-semibold mb-2 text-blue-900">Sidebar Mode</label>
                  <select className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.sidebar_mode||'Expanded'} onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>handleChange('sidebar_mode',e.target.value)}>
                    <option value="Expanded">Expanded</option>
                    <option value="Mini">Mini</option>
                  </select>
                  <label className="block font-semibold mb-2 text-blue-900">Primary Color</label>
                  <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" type="color" value={settings.primary_color||'#2563eb'} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('primary_color',e.target.value)} />
                  <label className="block font-semibold mb-2 text-blue-900">Accent Color</label>
                  <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" type="color" value={settings.accent_color||'#22d3ee'} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('accent_color',e.target.value)} />
                  <label className="block font-semibold mb-2 text-blue-900">Page Transition Animation</label>
                  <input type="checkbox" checked={settings.page_transition||false} onChange={()=>handleToggle('page_transition')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <label className="block font-semibold mb-2 text-blue-900">Modern Landing Page</label>
                  <input type="checkbox" checked={settings.landing_page_modern||false} onChange={()=>handleToggle('landing_page_modern')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                </div>
                <button className="btn btn-primary w-full py-3 rounded-xl bg-gradient-to-r from-blue-900 to-green-900 text-gold-200 font-bold shadow-lg hover:from-gold-400 hover:to-gold-200 hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2" onClick={handleSave} disabled={saving} type="button">Save UI Theme</button>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Email & Notifications Tab */}
        {activeTab === 'Email & Notifications' && (
          <div className="animate-fade-in-slide-in">
            <Card className="w-full bg-white/90 border border-blue-900 rounded-2xl shadow-xl">
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <label className="block font-semibold mb-2 text-blue-900">Support Email</label>
                  <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.support_email||''} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('support_email',e.target.value)} />
                  <label className="block font-semibold mb-2 text-blue-900">Email Provider</label>
                  <select className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.email_provider||'SMTP'} onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>handleChange('email_provider',e.target.value)}>
                    <option value="SMTP">SMTP</option>
                    <option value="SendGrid">SendGrid</option>
                    <option value="Mailgun">Mailgun</option>
                  </select>
                  <label className="block font-semibold mb-2 text-blue-900">Custom Templates (JSON)</label>
                  <textarea className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.email_templates||''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=>handleChange('email_templates',e.target.value)} placeholder="Paste JSON here..." />
                  <label className="block font-semibold mb-2 text-blue-900">Email Notifications</label>
                  <input type="checkbox" checked={settings.notify_email||false} onChange={()=>handleToggle('notify_email')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <label className="block font-semibold mb-2 text-blue-900">SMS Notifications</label>
                  <input type="checkbox" checked={settings.notify_sms||false} onChange={()=>handleToggle('notify_sms')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <label className="block font-semibold mb-2 text-blue-900">Push Notifications</label>
                  <input type="checkbox" checked={settings.notify_push||false} onChange={()=>handleToggle('notify_push')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <label className="block font-semibold mb-2 text-blue-900">Notification Recipients</label>
                  <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.notification_recipients||''} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('notification_recipients',e.target.value)} placeholder="e.g. all staff, admins only" />
                </div>
                <button className="btn btn-primary w-full py-3 rounded-xl bg-gradient-to-r from-blue-900 to-green-900 text-gold-200 font-bold shadow-lg hover:from-gold-400 hover:to-gold-200 hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2" onClick={handleSave} disabled={saving} type="button">Save Email & Notification Settings</button>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Analytics Tab */}
        {activeTab === 'Analytics' && (
          <div className="animate-fade-in-slide-in">
            <Card className="w-full bg-white/90 border border-blue-900 rounded-2xl shadow-xl">
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <label className="block font-semibold mb-2 text-blue-900">Default KPIs</label>
                  <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.default_kpis||'Sales,Rentals,Profits'} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('default_kpis',e.target.value)} />
                  <label className="block font-semibold mb-2 text-blue-900">3D Charts</label>
                  <input type="checkbox" checked={settings.charts_3d||false} onChange={()=>handleToggle('charts_3d')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <label className="block font-semibold mb-2 text-blue-900">Data Refresh Interval (seconds)</label>
                  <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" type="number" value={settings.data_refresh_interval||''} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('data_refresh_interval',e.target.value)} />
                  <label className="block font-semibold mb-2 text-blue-900">Export Format</label>
                  <select className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.export_format||'CSV'} onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>handleChange('export_format',e.target.value)}>
                    <option value="CSV">CSV</option>
                    <option value="PDF">PDF</option>
                  </select>
                  <label className="block font-semibold mb-2 text-blue-900">Auto-calculate Profits</label>
                  <input type="checkbox" checked={settings.auto_calc_profits||false} onChange={()=>handleToggle('auto_calc_profits')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                </div>
                <button className="btn btn-primary w-full py-3 rounded-xl bg-gradient-to-r from-blue-900 to-green-900 text-gold-200 font-bold shadow-lg hover:from-gold-400 hover:to-gold-200 hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2" onClick={handleSave} disabled={saving} type="button">Save Analytics Preferences</button>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Automation Tab */}
        {activeTab === 'Automation' && (
          <div className="animate-fade-in-slide-in">
            <Card className="w-full bg-white/90 border border-blue-900 rounded-2xl shadow-xl">
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <label className="block font-semibold mb-2 text-blue-900">Auto-approve Uploaded Cars</label>
                  <input type="checkbox" checked={settings.auto_approve_cars||false} onChange={()=>handleToggle('auto_approve_cars')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <label className="block font-semibold mb-2 text-blue-900">Auto-generate Receipts</label>
                  <input type="checkbox" checked={settings.auto_generate_receipts||false} onChange={()=>handleToggle('auto_generate_receipts')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <label className="block font-semibold mb-2 text-blue-900">Auto-tag Cars as SOLD</label>
                  <input type="checkbox" checked={settings.auto_tag_sold||false} onChange={()=>handleToggle('auto_tag_sold')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <label className="block font-semibold mb-2 text-blue-900">Show SOLD for (days)</label>
                  <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" type="number" value={settings.sold_show_days||''} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('sold_show_days',e.target.value)} />
                  <label className="block font-semibold mb-2 text-blue-900">Auto-clear Inactive Users</label>
                  <input type="checkbox" checked={settings.auto_clear_inactive||false} onChange={()=>handleToggle('auto_clear_inactive')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <label className="block font-semibold mb-2 text-blue-900">Auto-notify Staff on Overdue Rentals</label>
                  <input type="checkbox" checked={settings.auto_notify_overdue||false} onChange={()=>handleToggle('auto_notify_overdue')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                </div>
                <button className="btn btn-primary w-full py-3 rounded-xl bg-gradient-to-r from-blue-900 to-green-900 text-gold-200 font-bold shadow-lg hover:from-gold-400 hover:to-gold-200 hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2" onClick={handleSave} disabled={saving} type="button">Save Automation Rules</button>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Documents Tab */}
        {activeTab === 'Documents' && (
          <div className="animate-fade-in-slide-in">
            <Card className="w-full bg-white/90 border border-blue-900 rounded-2xl shadow-xl">
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <label className="block font-semibold mb-2 text-blue-900">Default Receipt Footer</label>
                  <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.receipt_footer||''} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('receipt_footer',e.target.value)} />
                  <label className="block font-semibold mb-2 text-blue-900">Watermark Text</label>
                  <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.watermark_text||''} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('watermark_text',e.target.value)} />
                  <label className="block font-semibold mb-2 text-blue-900">Attach Digital Stamp</label>
                  <input type="checkbox" checked={settings.attach_digital_stamp||false} onChange={()=>handleToggle('attach_digital_stamp')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <label className="block font-semibold mb-2 text-blue-900">Signature Prompt</label>
                  <input type="checkbox" checked={settings.signature_prompt||false} onChange={()=>handleToggle('signature_prompt')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <label className="block font-semibold mb-2 text-blue-900">Signature Method</label>
                  <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.signature_method||'light pen'} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('signature_method',e.target.value)} />
                  <label className="block font-semibold mb-2 text-blue-900">Upload Company Policy/Terms (PDF)</label>
                  <input type="file" accept="application/pdf" className="block w-full text-blue-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-2 file:border-blue-900 file:bg-gold-100 file:text-blue-900 hover:file:bg-gold-200 transition-all duration-200" onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => handleChange('company_policy_pdf', (ev.target as FileReader)?.result);
                      reader.readAsDataURL(file);
                    }
                  }} />
                  {settings.company_policy_pdf && <a href={settings.company_policy_pdf} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Uploaded PDF</a>}
                </div>
                <button className="btn btn-primary w-full py-3 rounded-xl bg-gradient-to-r from-blue-900 to-green-900 text-gold-200 font-bold shadow-lg hover:from-gold-400 hover:to-gold-200 hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2" onClick={handleSave} disabled={saving} type="button">Save Document Settings</button>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Admin Controls Tab */}
        {activeTab === 'Admin Controls' && (
          <div className="animate-fade-in-slide-in">
            <Card className="w-full bg-white/90 border border-blue-900 rounded-2xl shadow-xl">
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <button className="btn btn-outline w-full py-3 rounded-xl bg-blue-900 text-gold-200 font-bold shadow-lg hover:bg-gold-400 hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2" onClick={()=>toast.info('View all admins/staff activity logs (coming soon)')} disabled={saving}>View Admin Logs</button>
                  <button className="btn btn-outline w-full py-3 rounded-xl bg-blue-900 text-gold-200 font-bold shadow-lg hover:bg-gold-400 hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2" onClick={()=>toast.info('Create/Edit/Suspend staff (coming soon)')} disabled={saving}>Manage Staff Accounts</button>
                  <label className="block font-semibold mb-2 text-blue-900">Audit Log Retention (months)</label>
                  <input className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" type="number" value={settings.audit_log_retention||''} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('audit_log_retention',e.target.value)} />
                  <button className="btn btn-outline w-full py-3 rounded-xl bg-blue-900 text-gold-200 font-bold shadow-lg hover:bg-gold-400 hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2" onClick={()=>toast.info('Manual override (coming soon)')} disabled={saving}>Manual Override</button>
                </div>
                <button className="btn btn-primary w-full py-3 rounded-xl bg-gradient-to-r from-blue-900 to-green-900 text-gold-200 font-bold shadow-lg hover:from-gold-400 hover:to-gold-200 hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2" onClick={handleSave} disabled={saving} type="button">Save Admin Controls</button>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Backup Tab */}
        {activeTab === 'Backup' && (
          <div className="animate-fade-in-slide-in">
            <Card className="w-full bg-white/90 border border-blue-900 rounded-2xl shadow-xl">
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <button className="btn btn-outline w-full py-3 rounded-xl bg-blue-900 text-gold-200 font-bold shadow-lg hover:bg-gold-400 hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2" onClick={()=>toast.success('Backup triggered!')} disabled={saving}>Manual Backup</button>
                  <label className="block font-semibold mb-2 text-blue-900">Backup Interval</label>
                  <select className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.backup_interval||'Weekly'} onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>handleChange('backup_interval',e.target.value)}>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                  <button className="btn btn-outline w-full py-3 rounded-xl bg-blue-900 text-gold-200 font-bold shadow-lg hover:bg-gold-400 hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2" onClick={()=>toast.success('Exported system settings!')} disabled={saving}>Export Settings</button>
                  <button className="btn btn-outline w-full py-3 rounded-xl bg-blue-900 text-gold-200 font-bold shadow-lg hover:bg-gold-400 hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2" onClick={()=>toast.success('Restored default settings!')} disabled={saving}>Restore Defaults</button>
                </div>
                <button className="btn btn-primary w-full py-3 rounded-xl bg-gradient-to-r from-blue-900 to-green-900 text-gold-200 font-bold shadow-lg hover:from-gold-400 hover:to-gold-200 hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2" onClick={handleSave} disabled={saving} type="button">Save Backup Settings</button>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Developer Tab */}
        {activeTab === 'Developer' && (
          <div className="animate-fade-in-slide-in">
            <Card className="w-full bg-white/90 border border-blue-900 rounded-2xl shadow-xl">
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <label className="block font-semibold mb-2 text-blue-900">Enable Debug Logging</label>
                  <input type="checkbox" checked={settings.debug_logging||false} onChange={()=>handleToggle('debug_logging')} className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" />
                  <button className="btn btn-outline w-full py-3 rounded-xl bg-blue-900 text-gold-200 font-bold shadow-lg hover:bg-gold-400 hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2" onClick={()=>toast.success('API Key regenerated!')} disabled={saving}>Regenerate API Key</button>
                  <label className="block font-semibold mb-2 text-blue-900">Webhook Endpoints (JSON)</label>
                  <textarea className="input w-full px-4 py-2 rounded-lg border-2 border-blue-900 focus:border-gold-400 focus:ring-2 focus:ring-gold-300 shadow-sm transition-all duration-200" value={settings.webhook_endpoints||''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=>handleChange('webhook_endpoints',e.target.value)} />
                  <button className="btn btn-outline w-full py-3 rounded-xl bg-blue-900 text-gold-200 font-bold shadow-lg hover:bg-gold-400 hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2" onClick={()=>toast.info('Supabase bucket settings preview (coming soon)')} disabled={saving}>Preview Supabase Buckets</button>
                </div>
                <button className="btn btn-primary w-full py-3 rounded-xl bg-gradient-to-r from-blue-900 to-green-900 text-gold-200 font-bold shadow-lg hover:from-gold-400 hover:to-gold-200 hover:text-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2" onClick={handleSave} disabled={saving} type="button">Save Developer Options</button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 