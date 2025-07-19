import React from 'react';

interface Stat {
  label: string;
  value: number;
  icon: string;
}

interface StatsOverviewProps {
  stats?: Stat[];
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  if (!stats || stats.length === 0) return null;
  return (
    <div className="bg-green-900/70 rounded-xl p-6 shadow-lg w-full min-w-0">
      <h3 className="text-2xl font-bold mb-4 text-white">Stats Overview</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full min-w-0">
        {stats.map((stat, index) => (
          <div key={index} className="bg-green-800/80 p-4 rounded-lg flex flex-col items-center text-center w-full min-w-0">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-green-100">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
