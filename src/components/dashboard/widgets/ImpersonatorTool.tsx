import React from 'react';

const ImpersonatorTool = () => {
  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
      <h2 className="text-lg font-bold mb-2">Impersonate User</h2>
      <p className="text-sm">Login as customer, staff or agent to test UI</p>
      <button className="mt-2 px-4 py-1 bg-green-600 text-white rounded">Start Impersonation</button>
    </div>
  );
};

export default ImpersonatorTool;
