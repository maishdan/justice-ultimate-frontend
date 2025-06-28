import React from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Topbar from '../../components/dashboard/Topbar';

export default function MechanicDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6">
          <h1 className="text-xl font-bold">Mechanic Dashboard</h1>
        </main>
      </div>
    </div>
  );
}