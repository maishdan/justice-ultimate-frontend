import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { FiPlus, FiDownload, FiFileText, FiBarChart2 } from 'react-icons/fi';
import { FaFileAlt } from 'react-icons/fa';

type Document = {
  id: string;
  name: string;
  type: string;
  status: string;
  uploaded_by: string;
  uploaded_at: string;
  version: number;
};

const DocumentsDepartment: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('documents').select('*').order('uploaded_at', { ascending: false });
    if (error) setError(error.message);
    else setDocuments(data || []);
    setLoading(false);
  };

  // Placeholder for advanced features (upload, preview, versioning, analytics, etc.)
  // ...

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-yellow-700"><FaFileAlt /> Documents</h2>
          <p className="text-gray-500">Upload, sign, preview, and manage all company documents.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary flex items-center gap-2"><FiPlus /> Upload</button>
          <button className="btn-secondary flex items-center gap-2"><FiDownload /> Export</button>
        </div>
      </div>
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-3xl text-yellow-600 font-bold">{documents.length}</div>
          <div className="text-gray-500">Total Documents</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-3xl text-blue-600 font-bold">{[...new Set(documents.map(d => d.type))].length}</div>
          <div className="text-gray-500">Types</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-3xl text-green-600 font-bold">{documents.filter(d => d.status === 'Approved').length}</div>
          <div className="text-gray-500">Approved</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-3xl text-red-600 font-bold">{documents.filter(d => d.status === 'Rejected').length}</div>
          <div className="text-gray-500">Rejected</div>
        </div>
      </div>
      {/* Documents Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Name</th>
              <th className="py-2">Type</th>
              <th className="py-2">Status</th>
              <th className="py-2">Version</th>
              <th className="py-2">Uploaded By</th>
              <th className="py-2">Uploaded</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} className="text-center text-red-500 py-8">{error}</td></tr>
            ) : documents.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8">No documents found.</td></tr>
            ) : (
              documents.map(doc => (
                <tr key={doc.id} className="border-b hover:bg-yellow-50 dark:hover:bg-gray-800 transition">
                  <td className="py-2 font-bold flex items-center gap-2"><FiFileText className="text-yellow-600" /> {doc.name}</td>
                  <td className="py-2">{doc.type}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${doc.status === 'Approved' ? 'bg-green-100 text-green-700' : doc.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{doc.status}</span>
                  </td>
                  <td className="py-2">v{doc.version}</td>
                  <td className="py-2">{doc.uploaded_by}</td>
                  <td className="py-2">{new Date(doc.uploaded_at).toLocaleString()}</td>
                  <td className="py-2 flex gap-2">
                    <button className="btn-xs btn-outline">View</button>
                    <button className="btn-xs btn-outline">Approve</button>
                    <button className="btn-xs btn-danger">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Placeholder for advanced features: preview, versioning, analytics, etc. */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-2 text-lg font-bold text-yellow-700"><FiBarChart2 /> Document Analytics (Coming Soon)</div>
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 text-center text-gray-400">Preview, versioning, OCR, and more will appear here.</div>
      </div>
    </div>
  );
};

export default DocumentsDepartment; 