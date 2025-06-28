<<<<<<< HEAD
=======
// src/components/dashboard/widgets/SecurityPanel.tsx
>>>>>>> 8202cd886166243aae7d13ab04e8ede3607ebf1c
import React from 'react';

export default function SecurityPanel() {
  return (
<<<<<<< HEAD
    <div className="grid md:grid-cols-2 gap-6">
      {/* Left Panel */}
      <div className="bg-green-900/80 text-white rounded-lg p-6 shadow-xl hover:shadow-green-400 transition duration-300">
        <h3 className="text-2xl font-bold mb-4">🔐 Security & Settings</h3>

        <div className="space-y-4">
          <div>
            <label className="font-semibold">Enable Two-Factor Authentication (2FA)</label>
            <button className="ml-4 px-4 py-2 bg-green-600 rounded hover:bg-green-500 shadow-lg">Enable 2FA</button>
          </div>

          <div>
            <label className="font-semibold">Connected Devices</label>
            <ul className="list-disc list-inside text-sm mt-1">
              <li>Chrome on Windows (Last login: 5 hours ago)</li>
              <li>Firefox on Android (Last login: 1 day ago)</li>
            </ul>
          </div>

          <div>
            <label className="font-semibold">Login History</label>
            <p className="text-sm mt-1">Last 3 logins shown with location & device</p>
          </div>

          <div>
            <label className="font-semibold">Language Preference</label>
            <select className="ml-4 p-1 rounded bg-green-800 text-white">
              <option>English</option>
              <option>Swahili</option>
              <option>French</option>
              <option>Arabic</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">Currency Preference</label>
            <select className="ml-4 p-1 rounded bg-green-800 text-white">
              <option>KES</option>
              <option>USD</option>
              <option>EUR</option>
              <option>AED</option>
            </select>
          </div>

          <div className="pt-4 border-t border-green-700 mt-6">
            <button className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded">🗑 Delete Account</button>
            <p className="text-xs mt-1 text-red-200">Your data will be erased permanently. (GDPR Compliant)</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-2">Security Overview</h2>
        <p className="text-sm text-red-500">⚠️ 3 failed login attempts</p>
        <p className="text-sm">Last admin login: 2 hours ago</p>
        <button className="mt-2 px-3 py-1 bg-red-600 text-white rounded">Ban IP</button>
      </div>
    </div>
  );
}
=======
    <div className="bg-green-900/80 text-white rounded-lg p-6 shadow-xl hover:shadow-green-400 transition duration-300">
      <h3 className="text-2xl font-bold mb-4">🔐 Security & Settings</h3>

      <div className="space-y-4">
        <div>
          <label className="font-semibold">Enable Two-Factor Authentication (2FA)</label>
          <button className="ml-4 px-4 py-2 bg-green-600 rounded hover:bg-green-500 shadow-lg">Enable 2FA</button>
        </div>

        <div>
          <label className="font-semibold">Connected Devices</label>
          <ul className="list-disc list-inside text-sm mt-1">
            <li>Chrome on Windows (Last login: 5 hours ago)</li>
            <li>Firefox on Android (Last login: 1 day ago)</li>
          </ul>
        </div>

        <div>
          <label className="font-semibold">Login History</label>
          <p className="text-sm mt-1">Last 3 logins shown with location & device</p>
        </div>

        <div>
          <label className="font-semibold">Language Preference</label>
          <select className="ml-4 p-1 rounded bg-green-800 text-white">
            <option>English</option>
            <option>Swahili</option>
            <option>French</option>
            <option>Arabic</option>
          </select>
        </div>

        <div>
          <label className="font-semibold">Currency Preference</label>
          <select className="ml-4 p-1 rounded bg-green-800 text-white">
            <option>KES</option>
            <option>USD</option>
            <option>EUR</option>
            <option>AED</option>
          </select>
        </div>

        <div className="pt-4 border-t border-green-700 mt-6">
          <button className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded">🗑 Delete Account</button>
          <p className="text-xs mt-1 text-red-200">Your data will be erased permanently. (GDPR Compliant)</p>
        </div>
      </div>
    </div>
  );
}
>>>>>>> 8202cd886166243aae7d13ab04e8ede3607ebf1c
