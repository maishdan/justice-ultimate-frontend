import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { FiGlobe, FiDownload, FiEdit } from 'react-icons/fi';
import { FaGlobe } from 'react-icons/fa';

type Language = {
  id: string;
  name: string;
  code: string;
  is_rtl: boolean;
  currency: string;
  region: string;
};

const I18nDepartment: React.FC = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('languages').select('*').order('name', { ascending: true });
    if (error) setError(error.message);
    else setLanguages(data || []);
    setLoading(false);
  };

  // Placeholder for advanced features (auto-detect, translation, export, etc.)
  // ...

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-green-700"><FaGlobe /> Internationalization</h2>
          <p className="text-gray-500">Multi-language, currency, region, and translation tools.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary flex items-center gap-2"><FiEdit /> Add Language</button>
          <button className="btn-secondary flex items-center gap-2"><FiDownload /> Export Translations</button>
        </div>
      </div>
      {/* Languages Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Language</th>
              <th className="py-2">Code</th>
              <th className="py-2">RTL</th>
              <th className="py-2">Currency</th>
              <th className="py-2">Region</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={6} className="text-center text-red-500 py-8">{error}</td></tr>
            ) : languages.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8">No languages found.</td></tr>
            ) : (
              languages.map(lang => (
                <tr key={lang.id} className="border-b hover:bg-green-50 dark:hover:bg-gray-800 transition">
                  <td className="py-2 font-bold flex items-center gap-2"><FiGlobe className="text-green-600" /> {lang.name}</td>
                  <td className="py-2">{lang.code}</td>
                  <td className="py-2">{lang.is_rtl ? 'Yes' : 'No'}</td>
                  <td className="py-2">{lang.currency}</td>
                  <td className="py-2">{lang.region}</td>
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
      {/* Placeholder for advanced features: auto-detect, translation, export, etc. */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-2 text-lg font-bold text-green-700"><FiGlobe /> i18n Tools (Coming Soon)</div>
        <div className="bg-gradient-to-r from-green-100 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 text-center text-gray-400">Auto-detect, translation, and region settings will appear here.</div>
      </div>
    </div>
  );
};

export default I18nDepartment; 