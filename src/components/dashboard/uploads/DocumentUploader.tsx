// 📁 src/components/dashboard/uploads/DocumentUploader.tsx
import React, { useState } from 'react';

const DocumentUploader = () => {
  const [idFile, setIdFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [proofAddress, setProofAddress] = useState<File | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Uploading files:', { idFile, licenseFile, proofAddress });
    // Implement actual file upload logic here (e.g., API call to backend)
  };

  return (
    <div className="bg-zinc-900 text-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all">
      <h3 className="text-2xl font-bold mb-4">📤 Upload Documents</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">ID/Passport:</label>
          <input
            type="file"
            accept=".jpg,.png,.pdf"
            onChange={(e) => handleFileChange(e, setIdFile)}
            className="block w-full bg-zinc-800 text-white p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Driver's License:</label>
          <input
            type="file"
            accept=".jpg,.png,.pdf"
            onChange={(e) => handleFileChange(e, setLicenseFile)}
            className="block w-full bg-zinc-800 text-white p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Proof of Address:</label>
          <input
            type="file"
            accept=".jpg,.png,.pdf"
            onChange={(e) => handleFileChange(e, setProofAddress)}
            className="block w-full bg-zinc-800 text-white p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-green-700 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg transition-all"
        >
          Upload Documents
        </button>
      </form>
    </div>
  );
};

export default DocumentUploader;
