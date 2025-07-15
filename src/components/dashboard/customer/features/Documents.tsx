import React, { useState } from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { FiUpload, FiDownload, FiFileText, FiShield, FiUser, FiBookOpen, FiSend } from 'react-icons/fi';

const mockDocuments = [
  { id: 'D-001', type: 'Logbook', car: 'BMW X5', file: 'logbook_bmwx5.pdf', uploaded: true },
  { id: 'D-002', type: 'Insurance', car: 'Mercedes S-Class', file: 'insurance_merc.pdf', uploaded: true },
  { id: 'D-003', type: 'National ID', car: 'Toyota Land Cruiser', file: null, uploaded: false },
  { id: 'D-004', type: 'Transfer Form', car: 'BMW X5', file: null, uploaded: false },
];

export default function Documents() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [uploading, setUploading] = useState(false);

  // Placeholder for file upload
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setDocuments(prev => prev.map(d => d.id === docId ? { ...d, uploaded: true, file: 'uploaded_file.pdf' } : d));
      alert('Document uploaded successfully!');
    }, 1200);
  };

  // Download document (mock)
  const handleDownload = (doc: any) => {
    alert(`Downloading ${doc.file || 'document'}...`);
  };

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-r from-blue-600 to-purple-500 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg text-yellow-400">Documents & Legal</h1>
          <p className="text-blue-100 mt-2">Upload and download your logbooks, IDs, insurance, and transfer forms securely.</p>
        </div>
      </div>

      {/* Documents List */}
      <div>
        <h2 className="text-xl font-bold mb-2 text-yellow-400">Your Documents</h2>
        <div className="space-y-2">
          {documents.map((doc) => (
            <Card key={doc.id} className="flex flex-col md:flex-row items-center gap-4 bg-white/10 p-4">
              {doc.type === 'Logbook' && <FiBookOpen className="text-blue-400 text-2xl" />}
              {doc.type === 'Insurance' && <FiShield className="text-green-400 text-2xl" />}
              {doc.type === 'National ID' && <FiUser className="text-yellow-400 text-2xl" />}
              {doc.type === 'Transfer Form' && <FiSend className="text-purple-400 text-2xl" />}
              <div className="flex-1">
                <div className="font-semibold text-white">{doc.type} - {doc.car}</div>
                <div className="text-xs text-blue-100">{doc.uploaded ? 'Uploaded' : 'Not Uploaded'}</div>
              </div>
              <div className="flex flex-col gap-2 items-center">
                {doc.uploaded ? (
                  <Button size="sm" variant="outline" onClick={() => handleDownload(doc)}><FiDownload className="mr-1" /> Download</Button>
                ) : (
                  <label className="flex items-center gap-1 cursor-pointer">
                    <FiUpload className="mr-1" />
                    <input type="file" accept="application/pdf,image/*" className="hidden" onChange={e => handleUpload(e, doc.id)} />
                    <span className="text-xs">Upload</span>
                  </label>
                )}
              </div>
            </Card>
          ))}
        </div>
        {uploading && <div className="text-blue-200 mt-2 animate-pulse">Uploading...</div>}
      </div>
    </div>
  );
} 