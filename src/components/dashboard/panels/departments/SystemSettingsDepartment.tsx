import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { FiSettings, FiDownload, FiKey, FiMoon, FiSun } from 'react-icons/fi';
import { FaCogs } from 'react-icons/fa';

type Setting = {
  id: string;
  key: string;
  value: string;
  updated_at: string;
};

const SystemSettingsDepartment: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('settings').select('*').order('updated_at', { ascending: false });
    if (error) setError(error.message);
    else setSettings(data || []);
    setLoading(false);
  };

  // Placeholder for advanced features (toggles, backup, rebranding, etc.)
  // ...

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-700"><FaCogs /> System Settings</h2>
          <p className="text-gray-500">Configure company info, features, API keys, and more.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2"><FiDownload /> Export Settings</button>
        </div>
      </div>
      {/* Settings Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Key</th>
              <th className="py-2">Value</th>
              <th className="py-2">Updated</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={4} className="text-center text-red-500 py-8">{error}</td></tr>
            ) : settings.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8">No settings found.</td></tr>
            ) : (
              settings.map(setting => (
                <tr key={setting.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="py-2 font-bold flex items-center gap-2"><FiSettings className="text-gray-600" /> {setting.key}</td>
                  <td className="py-2">{setting.value}</td>
                  <td className="py-2">{new Date(setting.updated_at).toLocaleString()}</td>
                  <td className="py-2 flex gap-2">
                    <button className="btn-xs btn-outline">Edit</button>
                    <button className="btn-xs btn-danger">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Placeholder for advanced features: toggles, backup, rebranding, etc. */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 text-center text-gray-400">
          <div className="flex items-center gap-2 mb-2 text-lg font-bold text-gray-700"><FiMoon /> Dark Mode / <FiSun /> Light Mode (Coming Soon)</div>
          Theme, rebranding, and notification preferences will appear here.
        </div>
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 text-center text-gray-400">
          <div className="flex items-center gap-2 mb-2 text-lg font-bold text-gray-700"><FiKey /> API Keys & Admin Access (Coming Soon)</div>
          API keys, webhooks, backup, and admin access control will appear here.
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsDepartment; 