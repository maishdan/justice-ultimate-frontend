import React from 'react';

const LeaveManager = () => {
  const leaves = [
    { id: 1, name: 'Carlos Nunez', from: '2025-07-01', to: '2025-07-10', reason: 'Medical', status: 'Approved' },
    { id: 2, name: 'Jane Mwangi', from: '2025-08-05', to: '2025-08-15', reason: 'Vacation', status: 'Pending' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Leave Manager</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="text-left p-2">Employee</th>
            <th className="text-left p-2">From</th>
            <th className="text-left p-2">To</th>
            <th className="text-left p-2">Reason</th>
            <th className="text-left p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(leave => (
            <tr key={leave.id} className="border-b dark:border-gray-700">
              <td className="p-2">{leave.name}</td>
              <td className="p-2">{new Date(leave.from).toLocaleDateString()}</td>
              <td className="p-2">{new Date(leave.to).toLocaleDateString()}</td>
              <td className="p-2">{leave.reason}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${leave.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{leave.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveManager;