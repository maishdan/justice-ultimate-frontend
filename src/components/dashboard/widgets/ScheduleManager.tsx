import React from 'react';

const ScheduleManager = () => {
  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
      <h2 className="text-lg font-bold mb-2">Staff Scheduling</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">Mechanics on shift: 3</p>
      <p className="text-sm text-gray-600 dark:text-gray-300">Next leave approval: pending</p>
    </div>
  );
};

export default ScheduleManager;