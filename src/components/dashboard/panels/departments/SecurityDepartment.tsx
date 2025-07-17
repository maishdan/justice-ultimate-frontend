import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { FiShield, FiLogIn, FiAlertCircle, FiKey } from 'react-icons/fi';
import { FaShieldAlt } from 'react-icons/fa';

type AccessLog = {
  id: string;
  user: string;
  action: string;
  ip: string;
  browser: string;
  time: string;
};

const SecurityDepartment: React.FC = () => {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('access_logs').select('*').order('time', { ascending: false });
    if (error) setError(error.message);
    else setLogs(data || []);
    setLoading(false);
  };

  // Placeholder for advanced features (MFA, PIN, alerts, analytics, etc.)
  // ...

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-red-700"><FaShieldAlt /> Access Logs & Security</h2>
          <p className="text-gray-500">View logins, set up MFA, manage access, and more.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2"><FiKey /> MFA Setup</button>
        </div>
      </div>
      {/* Access Logs Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">User</th>
              <th className="py-2">Action</th>
              <th className="py-2">IP</th>
              <th className="py-2">Browser</th>
              <th className="py-2">Time</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={6} className="text-center text-red-500 py-8">{error}</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8">No access logs found.</td></tr>
            ) : (
              logs.map(log => (
                <tr key={log.id} className="border-b hover:bg-red-50 dark:hover:bg-gray-800 transition">
                  <td className="py-2 font-bold flex items-center gap-2"><FiLogIn className="text-red-600" /> {log.user}</td>
                  <td className="py-2">{log.action}</td>
                  <td className="py-2">{log.ip}</td>
                  <td className="py-2">{log.browser}</td>
                  <td className="py-2">{new Date(log.time).toLocaleString()}</td>
                  <td className="py-2 flex gap-2">
                    <button className="btn-xs btn-outline">Revoke</button>
                    <button className="btn-xs btn-danger">Alert</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Placeholder for advanced features: MFA, PIN, analytics, etc. */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-2 text-lg font-bold text-red-700"><FiAlertCircle /> Security Analytics (Coming Soon)</div>
        <div className="bg-gradient-to-r from-red-100 to-red-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 text-center text-gray-400">MFA, PIN, access control, and more will appear here.</div>
      </div>
    </div>
  );
};

export default SecurityDepartment; 