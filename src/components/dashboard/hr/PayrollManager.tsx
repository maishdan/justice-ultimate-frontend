import React from 'react';

const PayrollManager = () => {
  const payroll = [
    { id: 1, name: 'Jane Mwangi', salary: 95000, currency: 'KES', status: 'Paid' },
    { id: 2, name: 'John Doe', salary: 45000, currency: 'UGX', status: 'Pending' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Payroll Manager</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Salary</th>
            <th className="text-left p-2">Currency</th>
            <th className="text-left p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {payroll.map(emp => (
            <tr key={emp.id} className="border-b dark:border-gray-700">
              <td className="p-2">{emp.name}</td>
              <td className="p-2">{emp.salary.toLocaleString()}</td>
              <td className="p-2">{emp.currency}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${emp.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{emp.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollManager;
