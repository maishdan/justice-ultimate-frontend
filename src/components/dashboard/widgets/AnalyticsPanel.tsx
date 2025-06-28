import React from 'react';
import { BarChart, PieChart } from './Charts';

const AnalyticsPanel = () => {
  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-bold">Analytics Overview</h2>
      <BarChart title="Bar Chart Overview" />
      <PieChart title="Pie Chart Overview" />
    </div>
  );
};

export default AnalyticsPanel;