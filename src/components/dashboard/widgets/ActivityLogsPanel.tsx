import React from 'react';

const mockLogs = [
  { type: 'Action', message: 'User JohnDoe updated inventory item #123', time: '2024-05-01 10:23', status: 'success' },
  { type: 'Error', message: 'Failed login attempt from IP 192.168.1.10', time: '2024-05-01 09:58', status: 'error' },
  { type: 'Access', message: 'Admin Daniwest accessed system settings', time: '2024-05-01 09:45', status: 'info' },
  { type: 'Action', message: 'User JaneSmith exported sales report', time: '2024-05-01 09:30', status: 'success' },
  { type: 'Error', message: 'Database connection timeout', time: '2024-05-01 09:10', status: 'error' },
];

export default function ActivityLogsPanel() {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 dark:text-blue-200">Activity Logs</h2>
      <p className="text-gray-500 mb-6">Actions, Errors, and Access logs for system auditing and security.</p>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-blue-50 dark:bg-blue-900/40">
              <th className="px-4 py-2 text-left font-semibold text-blue-700 dark:text-blue-200">Type</th>
              <th className="px-4 py-2 text-left font-semibold text-blue-700 dark:text-blue-200">Message</th>
              <th className="px-4 py-2 text-left font-semibold text-blue-700 dark:text-blue-200">Time</th>
              <th className="px-4 py-2 text-left font-semibold text-blue-700 dark:text-blue-200">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockLogs.map((log, idx) => (
              <tr key={idx} className="border-b border-blue-100 dark:border-blue-800 hover:bg-blue-50/60 dark:hover:bg-blue-900/30 transition">
                <td className="px-4 py-2 font-medium">
                  {log.type === 'Action' && <span className="text-green-600">📝 Action</span>}
                  {log.type === 'Error' && <span className="text-red-600">❌ Error</span>}
                  {log.type === 'Access' && <span className="text-blue-600">🔑 Access</span>}
                </td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{log.message}</td>
                <td className="px-4 py-2 text-gray-500 dark:text-gray-400">{log.time}</td>
                <td className="px-4 py-2">
                  {log.status === 'success' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Success</span>}
                  {log.status === 'error' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">Error</span>}
                  {log.status === 'info' && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">Info</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 text-right">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">Export Logs</button>
      </div>
    </div>
  );
} 