import React, { useState } from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { FiLock, FiShield, FiSettings, FiGlobe, FiDollarSign, FiMoon, FiSun, FiBell } from 'react-icons/fi';

const languages = ['English', 'Swahili', 'French'];
const currencies = ['KES', 'USD', 'EUR'];

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [currency, setCurrency] = useState('KES');
  const [notificationSound, setNotificationSound] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password changed successfully!');
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-r from-blue-600 to-purple-500 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg text-yellow-400">Settings</h1>
          <p className="text-blue-100 mt-2">Manage your account security, preferences, language, and currency.</p>
        </div>
      </div>

      {/* Change Password */}
      <Card className="bg-white/10 text-white">
        <CardContent className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <FiLock className="text-2xl text-yellow-400" />
            <span className="font-bold text-lg">Change Password</span>
          </div>
          <form onSubmit={handlePasswordChange} className="flex flex-col gap-2 md:flex-row md:items-center">
            <input type="password" placeholder="Current Password" value={password} onChange={e => setPassword(e.target.value)} className="rounded px-3 py-2 text-black" required />
            <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="rounded px-3 py-2 text-black" required />
            <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="rounded px-3 py-2 text-black" required />
            <Button type="submit" className="bg-yellow-400 text-blue-900 font-bold">Change</Button>
          </form>
        </CardContent>
      </Card>

      {/* MFA (2FA) */}
      <Card className="bg-white/10 text-white">
        <CardContent className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <FiShield className="text-2xl text-yellow-400" />
            <span className="font-bold text-lg">Two-Factor Authentication (2FA)</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{mfaEnabled ? 'Enabled' : 'Disabled'}</span>
            <Button variant="outline" onClick={() => setMfaEnabled(e => !e)}>{mfaEnabled ? 'Disable' : 'Enable'}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="bg-white/10 text-white">
        <CardContent className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <FiSettings className="text-2xl text-yellow-400" />
            <span className="font-bold text-lg">Preferences</span>
          </div>
          <div className="flex items-center gap-4">
            <FiBell className="text-xl text-yellow-400" />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={notificationSound} onChange={() => setNotificationSound(e => !e)} /> Notification Sound
            </label>
            <FiMoon className="text-xl text-blue-200" />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(e => !e)} /> Dark Mode
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Language Switch */}
      <Card className="bg-white/10 text-white">
        <CardContent className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <FiGlobe className="text-2xl text-yellow-400" />
            <span className="font-bold text-lg">Language</span>
          </div>
          <select value={language} onChange={e => setLanguage(e.target.value)} className="rounded px-3 py-2 text-black w-48">
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </CardContent>
      </Card>

      {/* Currency Switch */}
      <Card className="bg-white/10 text-white">
        <CardContent className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <FiDollarSign className="text-2xl text-yellow-400" />
            <span className="font-bold text-lg">Currency</span>
          </div>
          <select value={currency} onChange={e => setCurrency(e.target.value)} className="rounded px-3 py-2 text-black w-48">
            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </CardContent>
      </Card>
    </div>
  );
} 