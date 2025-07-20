import React from 'react';

interface Notification {
  message: string;
  time: string;
  type?: string;
}

interface NotificationsFeedProps {
  notifications?: Notification[];
}

export default function NotificationsFeed({ notifications }: NotificationsFeedProps) {
  if (!notifications || notifications.length === 0) return null;
  return (
    <div className="glass-panel p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold text-white mb-4">Notifications</h3>
      <ul className="space-y-4">
        {notifications.map((note, idx) => (
          <li key={idx} className="glass-panel p-4 rounded-lg">
            <div className="text-white text-sm">{note.message}</div>
            <div className="text-green-200 text-xs mt-1">{note.time}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
