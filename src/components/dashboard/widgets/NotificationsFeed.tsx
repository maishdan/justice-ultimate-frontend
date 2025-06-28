import React from 'react';

const notifications = [
  {
    message: 'Your booking for BMW X6 is confirmed.',
    time: 'Just now',
    type: 'success',
  },
  {
    message: 'New test drive slot available for Toyota Hilux.',
    time: '1 hour ago',
    type: 'info',
  },
  {
    message: 'Your payment for KES 25,000 has been received.',
    time: 'Today, 9:30 AM',
    type: 'payment',
  },
];

export default function NotificationsFeed() {
  return (
<<<<<<< HEAD
    <div className="grid md:grid-cols-2 gap-6">
      {/* First Notification Panel */}
      <div className="bg-green-900/70 p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
        <h3 className="text-2xl font-bold text-white mb-4">🔔 Notifications</h3>
        <ul className="space-y-4">
          {notifications.map((note, idx) => (
            <li
              key={idx}
              className="p-4 bg-green-800/80 rounded-lg hover:scale-[1.02] transition"
            >
              <div className="text-white text-sm">{note.message}</div>
              <div className="text-green-200 text-xs mt-1">⏰ {note.time}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Second Notification Panel */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-2">Recent Notifications</h2>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
          <li>🚲 Maintenance scheduled at 11 PM tonight.</li>
          <li>🔐 New login from Nairobi, Kenya.</li>
          <li>🚗 New car listing approved.</li>
        </ul>
      </div>
=======
    <div className="bg-green-900/70 p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
      <h3 className="text-2xl font-bold text-white mb-4">🔔 Notifications</h3>
      <ul className="space-y-4">
        {notifications.map((note, idx) => (
          <li
            key={idx}
            className="p-4 bg-green-800/80 rounded-lg hover:scale-[1.02] transition"
          >
            <div className="text-white text-sm">{note.message}</div>
            <div className="text-green-200 text-xs mt-1">⏰ {note.time}</div>
          </li>
        ))}
      </ul>
>>>>>>> 8202cd886166243aae7d13ab04e8ede3607ebf1c
    </div>
  );
}
