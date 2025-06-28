import React from 'react';

const ListingsManager = () => {
  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
      <h2 className="text-lg font-bold mb-4">Listings Management</h2>
      <div className="space-y-2 text-sm">
        <p>📥 Pending Listings: 4</p>
        <p>✅ Approved Listings: 23</p>
        <p>🚫 Flagged Listings: 2</p>
        <button className="mt-2 px-4 py-1 bg-blue-500 text-white rounded">View All</button>
      </div>
    </div>
  );
};

export default ListingsManager;