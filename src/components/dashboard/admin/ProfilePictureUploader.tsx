import React, { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function ProfilePictureUploader({ profile, setProfile }: any) {
  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(profile.photo);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Handle file selection and preview
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size must be ≤ 5MB');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setUploadError('');
      setUploadSuccess('');
    }
  };

  // Upload file to Supabase and update profile
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadError('');
    setUploadSuccess('');

    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${profile.id}_${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, selectedFile, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      setUploadError('Upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }

    // Get public URL of uploaded image
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const publicUrl = urlData?.publicUrl;

    // Update profile photo in the database
    const { error: updateError } = await supabase
      .from('admin_profiles')
      .update({ photo_url: publicUrl })
      .eq('id', profile.id);

    if (updateError) {
      setUploadError('Failed to update profile in database');
    } else {
      setPhotoPreview(publicUrl);
      setProfile((prev: any) => ({ ...prev, photo: publicUrl }));
      setUploadSuccess('Photo uploaded successfully!');
      setSelectedFile(null);
    }

    setUploading(false);
  };

  return (
    <div className="space-y-4">
      {/* Profile photo preview */}
      <div className="mb-2">
        <img
          src={photoPreview || '/default-avatar.png'}
          alt="Profile Preview"
          className="w-32 h-32 rounded-full object-cover border shadow"
        />
      </div>

      {/* Choose Photo Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                   file:rounded file:border-0 file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload Photo'}
      </button>

      {/* Feedback messages */}
      {uploadError && <p className="text-red-600 text-sm">{uploadError}</p>}
      {uploadSuccess && <p className="text-green-600 text-sm">{uploadSuccess}</p>}
    </div>
  );
}
