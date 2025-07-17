import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { FiUser, FiEdit, FiDownload, FiShield, FiClock } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';

type Admin = {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo_url: string;
  role: string;
  last_login: string;
  timezone: string;
  language: string;
};

const AdminProfileDepartment: React.FC = () => {
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    fetchAdmin();
  }, []);

  const fetchAdmin = async () => {
    const { data, error } = await supabase.from('admins').select('*').single();
    if (error) {
      console.error('Error fetching admin:', error.message);
      return;
    }
    if (data) {
      // Map data to Admin type, casting fields to string
      const adminObj: Admin = {
        id: String(data.id),
        name: String(data.name),
        email: String(data.email),
        phone: String(data.phone),
        role: String(data.role),
        avatar: String(data.avatar),
        created_at: String(data.created_at),
        updated_at: String(data.updated_at)
      };
      setAdmin(adminObj);
    } else {
      setAdmin(null);
    }
  };

  // Placeholder for advanced features (2FA, logs, preferences, etc.)
  // ...

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-200">
            {admin?.photo_url ? <img src={admin.photo_url} alt="Admin" className="w-full h-full object-cover" /> : <FaUserCircle className="w-full h-full text-blue-400" />}
          </div>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-700"><FiUser /> {admin?.name || 'Admin Profile'}</h2>
            <div className="text-gray-500">{admin?.role || 'Administrator'}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary flex items-center gap-2"><FiEdit /> Edit Profile</button>
          <button className="btn-secondary flex items-center gap-2"><FiDownload /> Export Info</button>
        </div>
      </div>
      {/* Admin Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
          <div className="font-bold mb-2">Contact Info</div>
          <div className="text-gray-700 dark:text-gray-200">Email: {admin?.email}</div>
          <div className="text-gray-700 dark:text-gray-200">Phone: {admin?.phone}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
          <div className="font-bold mb-2">Preferences</div>
          <div className="text-gray-700 dark:text-gray-200">Language: {admin?.language}</div>
          <div className="text-gray-700 dark:text-gray-200">Timezone: {admin?.timezone}</div>
        </div>
      </div>
      {/* Activity & Security */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
          <div className="font-bold mb-2 flex items-center gap-2"><FiShield /> Security</div>
          <div className="text-gray-700 dark:text-gray-200">2FA: <span className="font-bold text-green-600">Enabled</span></div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
          <div className="font-bold mb-2 flex items-center gap-2"><FiClock /> Last Login</div>
          <div className="text-gray-700 dark:text-gray-200">{admin?.last_login ? new Date(admin.last_login).toLocaleString() : 'N/A'}</div>
        </div>
      </div>
      {/* Placeholder for advanced features: logs, signature, etc. */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-2 text-lg font-bold text-blue-700"><FiUser /> Admin Logs & Signature (Coming Soon)</div>
        <div className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 text-center text-gray-400">Activity logs, signature, and more will appear here.</div>
      </div>
    </div>
  );
};

export default AdminProfileDepartment; 