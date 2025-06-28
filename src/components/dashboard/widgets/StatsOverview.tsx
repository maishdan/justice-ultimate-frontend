import React from 'react';

const stats = [
  {
    label: 'Cars Booked',
    value: 12,
    icon: '🚗',
  },
  {
    label: 'Test Drives',
    value: 5,
    icon: '📅',
  },
  {
    label: 'Purchases',
    value: 3,
    icon: '🛒',
  },
  {
    label: 'Services Requested',
    value: 8,
    icon: '🛠️',
  },
];

export default function StatsOverview() {
  return (
    <div className="bg-green-900/70 rounded-xl p-6 shadow-lg hover:shadow-2xl transition duration-300">
      <h3 className="text-2xl font-bold mb-4 text-white">📊 Stats Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-green-800/80 p-4 rounded-lg flex flex-col items-center text-center hover:scale-105 hover:bg-green-700/80 transition duration-300 shadow-md hover:shadow-xl"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-green-100">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
