import React from 'react';

const EmployeeList = () => {
  const employees = [
    { id: 1, name: 'Jane Mwangi', role: 'Manager', status: 'Active', country: 'Kenya' },
    { id: 2, name: 'John Doe', role: 'Mechanic', status: 'On Leave', country: 'Uganda' },
    { id: 3, name: 'Carlos Nunez', role: 'Sales Staff', status: 'Active', country: 'Mexico' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Employee List</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Role</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Country</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id} className="border-b dark:border-gray-700">
              <td className="p-2">{emp.name}</td>
              <td className="p-2">{emp.role}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{emp.status}</span>
              </td>
              <td className="p-2">{emp.country}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { EmployeeList };