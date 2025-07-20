import React from 'react';

const SystemHealthMonitor = () => {
  return (
    <div className="glass-panel p-4 rounded-xl shadow-lg">
      <h2 className="text-lg font-bold mb-2">System Health Monitor</h2>
      <ul className="text-sm text-white space-y-1">
        <li>🖥️ Frontend: Online ✅</li>
        <li>⚙️ Backend: Stable ✅</li>
        <li>💾 Database Load: 42%</li>
        <li>📶 Network Latency: 150ms</li>
        <li>🧠 Memory Usage: 67%</li>
      </ul>
    </div>
  );
};

export default SystemHealthMonitor;