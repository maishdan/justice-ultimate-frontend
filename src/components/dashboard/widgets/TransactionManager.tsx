import React from 'react';

const TransactionManager = () => {
  return (
    <div className="glass-panel p-4 rounded-xl shadow">
      <h2 className="text-lg font-bold mb-4">Transaction Overview</h2>
      <ul className="text-sm text-white space-y-1">
        <li>📦 M-Pesa: 1,233 KES</li>
        <li>💳 Stripe: $4,200</li>
        <li>📥 Refund Requests: 3</li>
      </ul>
    </div>
  );
};

export default TransactionManager;