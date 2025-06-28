import React from 'react';

const SupportFeedbackPanel = () => {
  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
      <h2 className="text-lg font-bold mb-2">Support Tickets</h2>
      <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
        <li>🧾 Payment issue - Open</li>
        <li>🛒 Vehicle refund - Resolved</li>
        <li>📨 Account login - Pending</li>
      </ul>
    </div>
  );
};

export default SupportFeedbackPanel;