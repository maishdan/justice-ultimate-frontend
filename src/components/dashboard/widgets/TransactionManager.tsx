import React from 'react';

const TransactionManager = () => {
  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
      <h2 className="text-lg font-bold mb-4">Transaction Overview</h2>
      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
        <li>📦 M-Pesa: 1,233 KES</li>
        <li>💳 Stripe: $4,200</li>
        <li>📥 Refund Requests: 3</li>
      </ul>
    </div>
  );
};

export default TransactionManager;