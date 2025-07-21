import React from 'react';
import SimpleConnectionTest from '../components/SimpleConnectionTest';

export default function ConnectionTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🔍 Database Connection Test Center
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Comprehensive testing of all database connections, storage access, and upload functionality
          </p>
        </div>
        
        <SimpleConnectionTest />
        
        <div className="mt-8 p-6 bg-transparent rounded-xl shadow-lg border border-blue-300 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            📋 What This Tests:
          </h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li>✅ <strong>Supabase Connection:</strong> Basic database connectivity</li>
            <li>✅ <strong>Database Read Access:</strong> Ability to read from cars table</li>
            <li>✅ <strong>Database Write Access:</strong> Ability to insert and delete test data</li>
            <li>✅ <strong>Storage Bucket Access:</strong> Access to vehicles bucket</li>
            <li>✅ <strong>Storage Upload Test:</strong> File upload and deletion</li>
            <li>✅ <strong>Environment Detection:</strong> Development/Production settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 