// 📁 src/components/dashboard/uploads/DocumentUploader.tsx
import React, { useState } from 'react';

const DocumentUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadStatus('');
    }
  };

  const handleUpload = () => {
    if (!file) {
      setUploadStatus('❌ Please select a file first.');
      return;
    }

    // Simulate upload logic
    setTimeout(() => {
      setUploadStatus(`✅ File "${file.name}" uploaded successfully!`);
      setFile(null);
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold mb-4">📤 Upload Legal Documents</h3>
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-3 text-sm text-gray-500 dark:text-gray-300"
      />
      <button
        onClick={handleUpload}
        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
      >
        Upload
      </button>
      {uploadStatus && <p className="mt-3 text-sm text-blue-500">{uploadStatus}</p>}
    </div>
  );
};

export default DocumentUploader;
