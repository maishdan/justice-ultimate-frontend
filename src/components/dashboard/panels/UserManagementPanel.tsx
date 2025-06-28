import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserManagementPanel() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error("User data is not an array:", response.data);
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    }
  };

  const updateUserRole = async (userId: number, role: string) => {
    try {
      await axios.put(`/api/users/${userId}/role`, { role });
      fetchUsers();
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">User Management Panel</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="text-left">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.map((user: any) => (
            <tr key={user.id}>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="sales_staff">Sales Staff</option>
                  <option value="agent">Agent</option>
                  <option value="mechanic">Mechanic</option>
                  <option value="car_owner">Car Owner</option>
                  <option value="customer">Customer</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}