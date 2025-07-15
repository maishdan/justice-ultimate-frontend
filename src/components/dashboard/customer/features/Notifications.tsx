import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { FiBell, FiCheckCircle, FiAlertTriangle, FiSettings, FiDownload, FiVolume2, FiVolumeX, FiTrash2 } from 'react-icons/fi';
import jsPDF from 'jspdf';

const mockNotifications = [
  { id: '1', type: 'booking_confirmed', title: 'Booking Confirmed', message: 'Your booking for BMW X5 has been confirmed for January 15-18, 2024.', timestamp: '2024-01-14T10:30:00Z', isRead: false, priority: 'high', category: 'booking' },
  { id: '2', type: 'payment_successful', title: 'Payment Successful', message: 'Payment of KES 135,000 for your rental has been processed successfully.', timestamp: '2024-01-14T09:15:00Z', isRead: true, priority: 'medium', category: 'payment' },
  { id: '3', type: 'reminder', title: 'Upcoming Test Drive', message: 'Reminder: Your test drive for Mercedes S-Class is scheduled for tomorrow at 2:00 PM.', timestamp: '2024-01-13T16:45:00Z', isRead: false, priority: 'high', category: 'reminder' },
  { id: '4', type: 'offer', title: 'Special Offer Available', message: 'Get 20% off on all luxury vehicles this weekend. Use code: LUXURY20', timestamp: '2024-01-13T14:20:00Z', isRead: false, priority: 'medium', category: 'offer' },
  { id: '5', type: 'service', title: 'Vehicle Service Due', message: 'Your Toyota Land Cruiser is due for service. Schedule an appointment now.', timestamp: '2024-01-13T11:30:00Z', isRead: true, priority: 'low', category: 'service' },
  { id: '6', type: 'security', title: 'New Login Detected', message: 'New login detected from Nairobi, Kenya. If this wasn\'t you, please contact support.', timestamp: '2024-01-12T20:15:00Z', isRead: true, priority: 'high', category: 'security' },
  { id: '7', type: 'loyalty', title: 'Loyalty Points Earned', message: 'You earned 250 loyalty points for your recent rental. Total points: 1,500', timestamp: '2024-01-12T18:30:00Z', isRead: false, priority: 'low', category: 'loyalty' },
  { id: '8', type: 'system', title: 'System Maintenance', message: 'Scheduled maintenance on January 15, 2024 from 2:00 AM to 4:00 AM. Service may be temporarily unavailable.', timestamp: '2024-01-12T15:00:00Z', isRead: true, priority: 'medium', category: 'system' }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [muted, setMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play notification sound on new unread notification
  useEffect(() => {
    if (!muted && notifications.some(n => !n.isRead)) {
      audioRef.current?.play();
    }
  }, [notifications, muted]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Download notification log as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Justice Ultimate Automobiles - Notification Log', 10, 10);
    notifications.forEach((n, i) => {
      doc.text(`${i + 1}. [${n.title}] ${n.message} (${n.timestamp})`, 10, 20 + i * 10);
    });
    doc.save('NotificationLog.pdf');
  };

  return (
    <div className="space-y-8 w-full">
      <audio ref={audioRef} src="/sounds/iphone-notification.mp3" preload="auto" />
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-r from-blue-600 to-purple-500 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg text-yellow-400">Notifications & Messages</h1>
          <p className="text-blue-100 mt-2">Stay updated with real-time alerts, messages, and important updates.</p>
        </div>
        <div className="flex gap-4 ml-auto">
          <Button onClick={markAllAsRead} disabled={unreadCount === 0} aria-label="Mark all notifications as read"><FiCheckCircle className="mr-2" />Mark All as Read</Button>
          <Button variant="outline" onClick={() => setShowSettings(!showSettings)} aria-label="Open notification settings"><FiSettings className="mr-2" />Settings</Button>
          <Button variant="outline" onClick={downloadPDF} aria-label="Download notification log"><FiDownload className="mr-2" />Download Log</Button>
          <Button variant="outline" onClick={() => setMuted(m => !m)} aria-label={muted ? 'Unmute notifications' : 'Mute notifications'}>{muted ? <FiVolumeX className="mr-2" /> : <FiVolume2 className="mr-2" />}{muted ? 'Unmute' : 'Mute'}</Button>
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        {notifications.map((n) => (
          <Card key={n.id} className={`flex items-center gap-4 p-4 ${n.isRead ? 'bg-white/10' : 'bg-yellow-400/10 border-l-4 border-yellow-400'}`}> 
            <FiBell className="text-yellow-400 text-2xl" />
            <div className="flex-1">
              <div className="font-semibold text-white">{n.title}</div>
              <div className="text-xs text-blue-100">{n.message}</div>
              <div className="text-xs text-blue-200">{n.timestamp}</div>
            </div>
            <div className="flex gap-2 items-center">
              {!n.isRead && <Button size="sm" variant="outline" onClick={() => markAsRead(n.id)} aria-label="Mark notification as read">Mark Read</Button>}
              <Button size="sm" variant="outline" onClick={() => deleteNotification(n.id)} aria-label="Delete notification"><FiTrash2 /></Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white/10 p-6 rounded-xl shadow-xl mt-4">
          <h3 className="text-lg font-bold mb-2 text-yellow-400">Notification Settings</h3>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!muted} onChange={() => setMuted(m => !m)} aria-label="Enable notification sound" /> Enable Notification Sound
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={true} readOnly aria-label="Email notifications enabled" /> Email Notifications (enabled)
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={true} readOnly aria-label="Push notifications enabled" /> Push Notifications (enabled)
            </label>
          </div>
        </div>
      )}
    </div>
  );
} 