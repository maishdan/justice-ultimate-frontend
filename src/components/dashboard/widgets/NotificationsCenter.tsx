// 📁 File: src/components/dashboard/widgets/NotificationsCenter.tsx

import React from 'react';
import { BellRing, CheckCircle, Info } from 'lucide-react';

const notifications = [
  {
    type: 'success',
    message: 'Your booking for Toyota Prado has been confirmed!',
    time: 'Just now'
  },
  {
    type: 'info',
    message: 'A new offer is available: 15% off all SUVs this weekend!',
    time: '2 hours ago'
  },
  {
    type: 'success',
    message: 'Your payment of KES 6,500 was successful.',
    time: 'Yesterday'
  }
];

export default function NotificationsCenter() {
  return (
    <div className="bg-green-700/90 p-6 rounded-2xl shadow-lg hover:shadow-lime-400/40 transition-all duration-300">
      <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <BellRing className="text-lime-300" /> Notification Center
      </h3>
      <ul className="space-y-3 text-sm text-green-100">
        {notifications.map((notif, i) => (
          <li
            key={i}
            className={`p-3 rounded-md bg-green-800/60 border-l-4 ${
              notif.type === 'success' ? 'border-lime-400' : 'border-blue-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {notif.type === 'success' ? (
                  <CheckCircle className="text-lime-400" size={18} />
                ) : (
                  <Info className="text-blue-300" size={18} />
                )}
                <p>{notif.message}</p>
              </div>
              <span className="text-xs opacity-60">{notif.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
