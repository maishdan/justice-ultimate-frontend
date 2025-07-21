import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBell, FiMail, FiMessageSquare, FiSlack, FiCheck, FiX, FiClock,
  FiAlertCircle, FiInfo, FiCheckCircle, FiStar, FiFilter, FiSearch,
  FiSettings, FiDownload, FiTrash2, FiEye, FiEyeOff, FiRefreshCw, FiSend
} from 'react-icons/fi';
import { Dialog, DialogContent, DialogHeader as DHeader, DialogTitle as DTitle, DialogTrigger, DialogOverlay } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { automation, trackEvent } from '../../../lib/automation';
import { supabase } from '../../../lib/supabaseClient';
import { Switch } from '../../ui/switch';
import { useTranslation } from 'react-i18next';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  title: string;
  message: string;
  channel: 'email' | 'sms' | 'slack' | 'teams' | 'in-app';
  status: 'pending' | 'sent' | 'failed' | 'delivered' | 'read';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  recipient: string;
  scheduledAt?: Date;
  sentAt?: Date;
  readAt?: Date;
  metadata?: any;
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'slack' | 'teams';
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
}

export default function NotificationCenter() {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [view, setView] = useState<'all' | 'pending' | 'sent' | 'failed'>('all');
  const [channel, setChannel] = useState<'all' | 'email' | 'sms' | 'slack' | 'teams' | 'in-app'>('all');
  const [priority, setPriority] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateNotification, setShowCreateNotification] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    sent: 0,
    failed: 0,
    delivered: 0,
    read: 0
  });
  const [popupNotification, setPopupNotification] = useState<Notification | null>(null);
  const popupTimeout = useRef<NodeJS.Timeout | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [sendForm, setSendForm] = useState({
    channel: 'in-app',
    title: '',
    message: '',
    recipient: '',
    priority: 'medium',
    templateId: '',
    schedule: '',
  });
  const [sendError, setSendError] = useState('');
  const [sendSuccess, setSendSuccess] = useState('');
  const [templateForm, setTemplateForm] = useState({
    id: '', name: '', type: 'in-app', subject: '', content: '', variables: '', isActive: true
  });
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [quickReply, setQuickReply] = useState('');
  const [quickReplyLoading, setQuickReplyLoading] = useState(false);
  const [quickReplyError, setQuickReplyError] = useState('');
  const [quickReplySuccess, setQuickReplySuccess] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    notifications: true,
    marketing_emails: false,
    sound: true,
    popup: true,
    dnd: false,
    dndStart: '22:00',
    dndEnd: '07:00',
    dndMessage: 'You’re in Do Not Disturb mode until {end}',
    channels: { sms: true, email: true, push: true, inapp: true },
    types: { system: true, offers: true, messages: true, alerts: true },
    popupPerType: { system: true, offers: true, messages: true, alerts: true } as Record<GranularType, boolean>,
    soundPerType: { system: true, offers: true, messages: true, alerts: true } as Record<GranularType, boolean>,
  });
  const [prefLoading, setPrefLoading] = useState(false);
  const [prefError, setPrefError] = useState('');
  const [prefSuccess, setPrefSuccess] = useState('');
  const [missedNotifications, setMissedNotifications] = useState<Notification[]>([]);
  const [showMissedSummary, setShowMissedSummary] = useState(false);

  type GranularType = 'system' | 'offers' | 'messages' | 'alerts';

  // Utility: Check if current time is within DND window
  function isWithinDND(dnd: boolean, dndStart: string, dndEnd: string) {
    if (!dnd) return false;
    const now = new Date();
    const [startH, startM] = dndStart.split(':').map(Number);
    const [endH, endM] = dndEnd.split(':').map(Number);
    const start = new Date(now);
    start.setHours(startH, startM, 0, 0);
    const end = new Date(now);
    end.setHours(endH, endM, 0, 0);
    if (start < end) {
      // e.g., 22:00–23:00
      return now >= start && now < end;
    } else {
      // Overnight window, e.g., 22:00–07:00
      return now >= start || now < end;
    }
  }

  // Play notification sound (only if allowed)
  const playNotificationSound = () => {
    if (!preferences.notifications) return;
    if (preferences.dnd && isWithinDND(preferences.dnd, preferences.dndStart, preferences.dndEnd)) return;
    if (!preferences.sound) return;
    const audio = new Audio('/car-start.mp3');
    audio.play();
  };

  // Helper to map notification.type to granular control key
  function getGranularType(type: string): GranularType {
    switch (type) {
      case 'info':
      case 'system':
        return 'system';
      case 'success':
      case 'offers':
        return 'offers';
      case 'messages':
        return 'messages';
      case 'warning':
      case 'error':
      case 'alerts':
        return 'alerts';
      default:
        return 'system';
    }
  }

  useEffect(() => {
    loadNotifications();
    loadTemplates();
    loadStats();
    loadPreferences();
  }, []);

  // Fetch notifications from Supabase
  const loadNotifications = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (!error) setNotifications((data as unknown as Notification[]) || []);
    setLoading(false);
  };

  // Real-time subscription for new notifications
  useEffect(() => {
    loadNotifications();
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, payload => {
        const notif = payload.new as Notification;
        const typeKey = getGranularType(notif.type || 'system');
        const allowPopup = preferences.popup && preferences.popupPerType[typeKey];
        const allowSound = preferences.sound && preferences.soundPerType[typeKey];
        // DND logic
        const dndActive = preferences.dnd && isWithinDND(preferences.dnd, preferences.dndStart, preferences.dndEnd);
        if (
          preferences.notifications &&
          !dndActive &&
          allowPopup
        ) {
          setPopupNotification(notif);
          if (allowSound) playNotificationSound();
          if (popupTimeout.current) clearTimeout(popupTimeout.current);
          popupTimeout.current = setTimeout(() => setPopupNotification(null), 30000);
        } else {
          // Queue as missed
          setMissedNotifications(prev => [notif, ...prev]);
        }
        setNotifications(prev => [notif, ...prev]);
      })
      .subscribe();
    return () => { channel.unsubscribe(); };
    // eslint-disable-next-line
  }, [preferences]);

  // Fetch templates from Supabase
  const loadTemplates = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('notification_templates').select('*').order('name');
    if (!error) setTemplates((data as unknown as NotificationTemplate[]) || []);
    setLoading(false);
  };

  // Save template to Supabase
  const saveTemplate = async () => {
    setLoading(true);
    if (editingTemplate) {
      await supabase.from('notification_templates').update({ ...templateForm, variables: templateForm.variables.split(',').map(v=>v.trim()) }).eq('id', editingTemplate.id);
    } else {
      await supabase.from('notification_templates').insert([{ ...templateForm, variables: templateForm.variables.split(',').map(v=>v.trim()) }]);
    }
    setShowTemplatesModal(false);
    setEditingTemplate(null);
    setTemplateForm({ id: '', name: '', type: 'in-app', subject: '', content: '', variables: '', isActive: true });
    loadTemplates();
    setLoading(false);
  };

  // Delete template
  const deleteTemplate = async (id: string) => {
    setLoading(true);
    await supabase.from('notification_templates').delete().eq('id', id);
    loadTemplates();
    setLoading(false);
  };

  // Send notification
  const handleSendNotification = async () => {
    setSendError('');
    setSendSuccess('');
    if (!sendForm.title || !sendForm.message || !sendForm.recipient) {
      setSendError('All fields are required.');
      return;
    }
    setLoading(true);
    await supabase.from('notifications').insert([{
      type: 'info',
      title: sendForm.title,
      message: sendForm.message,
      channel: sendForm.channel,
      status: 'pending',
      priority: sendForm.priority,
      recipient: sendForm.recipient,
      scheduled_at: sendForm.schedule ? new Date(sendForm.schedule) : null,
      created_at: new Date().toISOString(),
      metadata: { templateId: sendForm.templateId }
    }]);
    setSendSuccess('Notification sent!');
    setShowSendModal(false);
    setSendForm({ channel: 'in-app', title: '', message: '', recipient: '', priority: 'medium', templateId: '', schedule: '' });
    setLoading(false);
  };

  const loadStats = () => {
    const total = notifications.length;
    const pending = notifications.filter(n => n.status === 'pending').length;
    const sent = notifications.filter(n => n.status === 'sent').length;
    const failed = notifications.filter(n => n.status === 'failed').length;
    const delivered = notifications.filter(n => n.status === 'delivered').length;
    const read = notifications.filter(n => n.status === 'read').length;

    setStats({ total, pending, sent, failed, delivered, read });
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesView = view === 'all' || notification.status === view;
    const matchesChannel = channel === 'all' || notification.channel === channel;
    const matchesPriority = priority === 'all' || notification.priority === priority;
    const matchesSearch = searchTerm === '' || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.recipient.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesView && matchesChannel && matchesPriority && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <FiCheckCircle className="text-green-500" />;
      case 'delivered': return <FiCheckCircle className="text-blue-500" />;
      case 'read': return <FiEye className="text-purple-500" />;
      case 'failed': return <FiX className="text-red-500" />;
      case 'pending': return <FiClock className="text-yellow-500" />;
      default: return <FiInfo className="text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <FiCheckCircle className="text-green-500" />;
      case 'warning': return <FiAlertCircle className="text-yellow-500" />;
      case 'error': return <FiX className="text-red-500" />;
      case 'info': return <FiInfo className="text-blue-500" />;
      case 'system': return <FiSettings className="text-purple-500" />;
      default: return <FiBell className="text-gray-500" />;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <FiMail className="text-blue-500" />;
      case 'sms': return <FiMessageSquare className="text-green-500" />;
      case 'slack': return <FiSlack className="text-purple-500" />;
      case 'teams': return <FiBell className="text-blue-600" />;
      case 'in-app': return <FiBell className="text-orange-500" />;
      default: return <FiBell className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Mark as Read
  const markAsRead = async (notificationId: string) => {
    await supabase.from('notifications').update({ status: 'read', read_at: new Date().toISOString() }).eq('id', notificationId);
    setNotifications(notifications => notifications.map(n => n.id === notificationId ? { ...n, status: 'read', read_at: new Date() } : n));
  };

  // Retry Notification
  const retryNotification = async (notificationId: string) => {
    setLoading(true);
    await supabase.from('notifications').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', notificationId);
    setNotifications(notifications => notifications.map(n => n.id === notificationId ? { ...n, status: 'sent', sent_at: new Date() } : n));
    setLoading(false);
  };

  // Delete Notification
  const deleteNotification = async (notificationId: string) => {
    await supabase.from('notifications').delete().eq('id', notificationId);
    setNotifications(notifications => notifications.filter(n => n.id !== notificationId));
    trackEvent('notification_deleted', { notificationId });
  };

  const exportNotifications = (format: 'csv' | 'json') => {
    const data = filteredNotifications.map(n => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      channel: n.channel,
      status: n.status,
      priority: n.priority,
      recipient: n.recipient,
      scheduledAt: n.scheduledAt?.toISOString(),
      sentAt: n.sentAt?.toISOString(),
      readAt: n.readAt?.toISOString()
    }));

    if (format === 'csv') {
      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notifications-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } else {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notifications-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    }

    trackEvent('notifications_exported', { format, count: data.length });
  };

  // Load preferences from Supabase profile
  const loadPreferences = async () => {
    setPrefLoading(true);
    setPrefError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile && profile.preferences) {
          setPreferences({
            ...preferences,
            ...profile.preferences,
            channels: { ...preferences.channels, ...(profile.notification_channels || {}) },
          });
        }
      }
    } catch (e) {
      setPrefError('Failed to load preferences.');
    }
    setPrefLoading(false);
  };

  // Save preferences to Supabase profile
  const savePreferences = async () => {
    setPrefLoading(true);
    setPrefError('');
    setPrefSuccess('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({ preferences, notification_channels: preferences.channels }).eq('id', user.id);
        setPrefSuccess('Preferences saved!');
        setTimeout(() => setPrefSuccess(''), 1500);
      }
    } catch (e) {
      setPrefError('Failed to save preferences.');
    }
    setPrefLoading(false);
  };

  useEffect(() => {
    if (showPreferences) loadPreferences();
    // eslint-disable-next-line
  }, [showPreferences]);

  // When DND or notifications are toggled ON, show missed summary
  useEffect(() => {
    if (
      missedNotifications.length > 0 &&
      preferences.notifications &&
      (!preferences.dnd || !isWithinDND(preferences.dnd, preferences.dndStart, preferences.dndEnd)) &&
      preferences.popup
    ) {
      setShowMissedSummary(true);
    }
  }, [missedNotifications, preferences]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('notificationCenter')}</h2>
          <p className="text-gray-600">{t('manageNotifications')}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSendModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <FiBell className="w-4 h-4" />
            <span>{t('sendNotification')}</span>
          </button>
          <button
            onClick={() => setShowTemplatesModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <FiSettings className="w-4 h-4" />
            <span>{t('templates')}</span>
          </button>
          <button
            onClick={() => setShowPreferences(true)}
            className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors flex items-center space-x-2"
            aria-label={t('notificationPreferences')}
          >
            <FiFilter className="w-4 h-4" />
            <span>{t('preferences')}</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center"
          >
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-600 capitalize">{key}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-wrap items-center space-x-4">
            <select
              value={view}
              onChange={(e) => setView(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">{t('allStatus')}</option>
              <option value="pending">{t('pending')}</option>
              <option value="sent">{t('sent')}</option>
              <option value="failed">{t('failed')}</option>
            </select>

            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">{t('allChannels')}</option>
              <option value="email">{t('email')}</option>
              <option value="sms">{t('sms')}</option>
              <option value="slack">{t('slack')}</option>
              <option value="teams">{t('teams')}</option>
              <option value="in-app">{t('inApp')}</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">{t('allPriorities')}</option>
              <option value="urgent">{t('urgent')}</option>
              <option value="high">{t('high')}</option>
              <option value="medium">{t('medium')}</option>
              <option value="low">{t('low')}</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchNotifications')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => exportNotifications('csv')}
              className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              <FiDownload className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('notifications')} ({filteredNotifications.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          <AnimatePresence>
            {filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(notification.type)}
                      {getChannelIcon(notification.channel)}
                      {getStatusIcon(notification.status)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{notification.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{t('to')}: {notification.recipient}</span>
                        {notification.scheduledAt && (
                          <span>{t('scheduled')}: {notification.scheduledAt.toLocaleString()}</span>
                        )}
                        {notification.sentAt && (
                          <span>{t('sent')}: {notification.sentAt.toLocaleString()}</span>
                        )}
                        {notification.readAt && (
                          <span>{t('read')}: {notification.readAt.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {notification.status === 'failed' && (
                      <button
                        onClick={() => retryNotification(notification.id)}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
                      >
                        {t('retry')}
                      </button>
                    )}
                    
                    {notification.status === 'delivered' && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        {t('markRead')}
                      </button>
                    )}
                    
                    <button
                      onClick={() => setSelectedNotification(notification)}
                      className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                    >
                      {t('details')}
                    </button>
                    
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Notification Details Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t('notificationDetails')}</h3>
              <button
                onClick={() => setSelectedNotification(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('title')}</label>
                <p className="text-gray-900">{selectedNotification.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('message')}</label>
                <p className="text-gray-900">{selectedNotification.message}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('type')}</label>
                  <p className="text-gray-900 capitalize">{selectedNotification.type}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('channel')}</label>
                  <p className="text-gray-900 capitalize">{selectedNotification.channel}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('status')}</label>
                  <p className="text-gray-900 capitalize">{selectedNotification.status}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('priority')}</label>
                  <p className="text-gray-900 capitalize">{selectedNotification.priority}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('recipient')}</label>
                <p className="text-gray-900">{selectedNotification.recipient}</p>
              </div>
              
              {selectedNotification.metadata && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('metadata')}</label>
                  <pre className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                    {JSON.stringify(selectedNotification.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

            {/* Add popup notification UI */}
      {popupNotification && preferences.notifications && (!preferences.dnd || !isWithinDND(preferences.dnd, preferences.dndStart, preferences.dndEnd)) && preferences.popup && (
        <div className="fixed top-20 right-6 bg-white dark:bg-gray-900 border border-yellow-400 rounded-xl p-4 animate-fade-in-out w-96 max-w-full" style={{ animationDuration: '30s' }}>
          <div className="flex items-center gap-4 mb-2">
            <FiBell className="text-yellow-400 text-2xl" />
            <div className="flex-1">
              <div className="font-bold text-lg">{popupNotification.title}</div>
              <div className="text-sm text-gray-700 dark:text-gray-200 line-clamp-2">{popupNotification.message}</div>
            </div>
            <button
              aria-label={t('closeNotificationPopup')}
              className="ml-2 text-gray-400 hover:text-gray-700 focus:outline-none"
              onClick={() => setPopupNotification(null)}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          {/* Quick Reply UI */}
          <form
            className="flex items-center gap-2 mt-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!quickReply.trim()) return;
              setQuickReplyLoading(true);
              setQuickReplyError("");
              try {
                await supabase.from('notifications').insert([
                  {
                    type: 'info',
                    title: `${t('reply')}: ${popupNotification.title}`,
                    message: quickReply,
                    channel: 'in-app',
                    status: 'pending',
                    priority: popupNotification.priority,
                    recipient: popupNotification.recipient, // or sender if you want to reply to sender
                    metadata: { replyTo: popupNotification.id },
                    created_at: new Date().toISOString(),
                  },
                ]);
                setQuickReplySuccess('Reply sent!');
                setQuickReply("");
                setTimeout(() => {
                  setQuickReplySuccess("");
                  setPopupNotification(null);
                }, 1500);
              } catch (err) {
                setQuickReplyError('Failed to send reply.');
              } finally {
                setQuickReplyLoading(false);
              }
            }}
            aria-label={t('quickReplyToNotification')}
          >
            <input
              type="text"
              className="flex-1 p-2 rounded border border-gray-300 text-sm bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-yellow-400"
              placeholder={t('typeQuickReply')}
              value={quickReply}
              onChange={e => setQuickReply(e.target.value)}
              aria-label={t('quickReplyInput')}
              disabled={quickReplyLoading}
              autoFocus
            />
            <button
              type="submit"
              className="bg-yellow-400 text-black px-3 py-2 rounded hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
              disabled={quickReplyLoading || !quickReply.trim()}
              aria-label={t('sendQuickReply')}
            >
              {quickReplyLoading ? <FiRefreshCw className="animate-spin" /> : <FiSend />}
            </button>
          </form>
          {quickReplyError && <div className="text-red-500 text-xs mt-1">{quickReplyError}</div>}
          {quickReplySuccess && <div className="text-green-600 text-xs mt-1">{quickReplySuccess}</div>}
        </div>
      )}

      {/* Missed notifications summary popup */}
      {showMissedSummary && (
        <div className="fixed top-20 right-6 bg-blue-700 text-white border border-blue-400 rounded-xl p-4 flex flex-col gap-2 animate-fade-in-out w-96 max-w-full">
          <div className="font-bold text-lg">{t('missedNotificationsCount', { count: missedNotifications.length })}</div>
          <div className="text-sm mb-2">{t('missedNotificationsClick')}</div>
          <button
            className="bg-yellow-400 text-black px-3 py-2 rounded hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-400"
            onClick={() => {
              setSelectedNotification(missedNotifications[0]);
              setMissedNotifications([]);
              setShowMissedSummary(false);
            }}
          >
            {t('reviewNow')}
          </button>
          <button
            className="text-xs text-white underline mt-1"
            onClick={() => setShowMissedSummary(false)}
          >
            {t('dismiss')}
          </button>
        </div>
      )}

      {/* Send Notification Modal */}
      <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
        <DialogContent className="max-w-lg">
          <DHeader><DTitle>{t('sendNotification')}</DTitle></DHeader>
          <div className="space-y-3">
            <select value={sendForm.channel} onChange={e=>setSendForm(f=>({...f, channel: e.target.value}))} className="w-full p-2 rounded border">
              <option value="in-app">{t('inApp')}</option>
              <option value="email">{t('email')}</option>
              <option value="sms">{t('sms')}</option>
              <option value="slack">{t('slack')}</option>
              <option value="teams">{t('teams')}</option>
            </select>
            <Input placeholder={t('title')} value={sendForm.title} onChange={e=>setSendForm(f=>({...f, title: e.target.value}))} />
            <Textarea placeholder={t('message')} value={sendForm.message} onChange={e=>setSendForm(f=>({...f, message: e.target.value}))} rows={4} />
            <Input placeholder={t('recipient')} value={sendForm.recipient} onChange={e=>setSendForm(f=>({...f, recipient: e.target.value}))} />
            <select value={sendForm.priority} onChange={e=>setSendForm(f=>({...f, priority: e.target.value}))} className="w-full p-2 rounded border">
              <option value="urgent">{t('urgent')}</option>
              <option value="high">{t('high')}</option>
              <option value="medium">{t('medium')}</option>
              <option value="low">{t('low')}</option>
            </select>
            <Input placeholder={t('schedule')} value={sendForm.schedule} onChange={e=>setSendForm(f=>({...f, schedule: e.target.value}))} />
            <select value={sendForm.templateId} onChange={e=>setSendForm(f=>({...f, templateId: e.target.value}))} className="w-full p-2 rounded border">
              <option value="">{t('noTemplate')}</option>
              {templates.map(t=>(<option key={t.id} value={t.id}>{t.name}</option>))}
            </select>
            {sendError && <div className="text-red-500 text-sm">{sendError}</div>}
            {sendSuccess && <div className="text-green-600 text-sm">{sendSuccess}</div>}
            <div className="flex gap-2 mt-4">
              <button onClick={handleSendNotification} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">{t('send')}</button>
              <button onClick={()=>setShowSendModal(false)} className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400">{t('cancel')}</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Templates Modal */}
      <Dialog open={showTemplatesModal} onOpenChange={setShowTemplatesModal}>
        <DialogContent className="max-w-2xl">
          <DHeader><DTitle>{t('notificationTemplates')}</DTitle></DHeader>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Template List */}
            <div className="flex-1">
              <h3 className="font-bold mb-2">{t('templates')}</h3>
              <ul className="space-y-2">
                {templates.map(template=>(
                  <li key={template.id} className="flex items-center gap-2 border-b pb-2">
                    <span className="font-semibold">{template.name}</span>
                    <span className="text-xs text-gray-500">({t('type')}: {t(template.type)})</span>
                    <button onClick={()=>{setEditingTemplate(template);setTemplateForm({...template, subject: template.subject || '', variables: template.variables.join(', ')});}} className="text-blue-600 text-xs ml-2">{t('edit')}</button>
                    <button onClick={()=>deleteTemplate(template.id)} className="text-red-500 text-xs ml-2">{t('delete')}</button>
                    <span className={`ml-2 text-xs ${template.isActive ? 'text-green-600' : 'text-gray-400'}`}>{t(template.isActive ? 'active' : 'inactive')}</span>
                  </li>
                ))}
              </ul>
              <button onClick={()=>{setEditingTemplate(null);setTemplateForm({ id: '', name: '', type: 'in-app', subject: '', content: '', variables: '', isActive: true });}} className="mt-4 bg-green-600 text-white px-3 py-1 rounded">{t('newTemplate')}</button>
            </div>
            {/* Template Editor */}
            <div className="flex-1">
              <h3 className="font-bold mb-2">{editingTemplate ? t('editTemplate') : t('newTemplate')}</h3>
              <Input placeholder={t('name')} value={templateForm.name} onChange={e=>setTemplateForm(f=>({...f, name: e.target.value}))} />
              <select value={templateForm.type} onChange={e=>setTemplateForm(f=>({...f, type: e.target.value}))} className="w-full p-2 rounded border mt-2">
                <option value="in-app">{t('inApp')}</option>
                <option value="email">{t('email')}</option>
                <option value="sms">{t('sms')}</option>
                <option value="slack">{t('slack')}</option>
                <option value="teams">{t('teams')}</option>
              </select>
              <Input placeholder={t('subject')} value={templateForm.subject || ''} onChange={e=>setTemplateForm(f=>({...f, subject: e.target.value}))} />
              <Textarea placeholder={t('content')} value={templateForm.content} onChange={e=>setTemplateForm(f=>({...f, content: e.target.value}))} rows={4} />
              <Input placeholder={t('variables')} value={templateForm.variables} onChange={e=>setTemplateForm(f=>({...f, variables: e.target.value}))} />
              <div className="flex gap-2 mt-4">
                <button onClick={saveTemplate} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">{t('save')}</button>
                <button onClick={()=>{setEditingTemplate(null);setTemplateForm({ id: '', name: '', type: 'in-app', subject: '', content: '', variables: '', isActive: true });}} className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400">{t('cancel')}</button>
              </div>
              <div className="mt-2 text-xs text-gray-500">{t('preview')}: {templateForm.content.replace(/\{\{(.*?)\}\}/g, (_, v) => `[${v.trim()}]`)}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Notification Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label={t('notificationPreferences')}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('notificationPreferences')}</h3>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label={t('closePreferences')}
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>{t('enableNotifications')}</span>
                <Switch checked={preferences.notifications} onCheckedChange={v => setPreferences(p => ({ ...p, notifications: v }))} />
              </div>
              <div className="flex items-center justify-between">
                <span>{t('marketingEmails')}</span>
                <Switch checked={preferences.marketing_emails} onCheckedChange={v => setPreferences(p => ({ ...p, marketing_emails: v }))} />
              </div>
              <div className="flex items-center justify-between">
                <span>{t('sound')}</span>
                <Switch checked={preferences.sound} onCheckedChange={v => setPreferences(p => ({ ...p, sound: v }))} />
              </div>
              <div className="flex items-center justify-between">
                <span>{t('popup')}</span>
                <Switch checked={preferences.popup} onCheckedChange={v => setPreferences(p => ({ ...p, popup: v }))} />
              </div>
              <div className="flex items-center justify-between">
                <span>{t('doNotDisturb')}</span>
                <Switch checked={preferences.dnd} onCheckedChange={v => setPreferences(p => ({ ...p, dnd: v }))} />
              </div>
              {preferences.dnd && (
                <div className="flex gap-2 items-center">
                  <span>{t('dndFrom')}</span>
                  <input type="time" value={preferences.dndStart} onChange={e => setPreferences(p => ({ ...p, dndStart: e.target.value }))} className="border rounded p-1" />
                  <span>{t('dndTo')}</span>
                  <input type="time" value={preferences.dndEnd} onChange={e => setPreferences(p => ({ ...p, dndEnd: e.target.value }))} className="border rounded p-1" />
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>{t('customDndMessage')}</span>
                <input
                  type="text"
                  className="border rounded p-1 flex-1 ml-2"
                  value={preferences.dndMessage}
                  onChange={e => setPreferences(p => ({ ...p, dndMessage: e.target.value }))}
                  placeholder={t('customDndMessagePlaceholder')}
                  aria-label={t('customDndMessage')}
                />
              </div>
              <div>
                <div className="font-semibold mb-1">{t('channels')}</div>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(preferences.channels).map(([ch, val]) => (
                    <label key={ch} className="flex items-center gap-2">
                      <Switch checked={val} onCheckedChange={v => setPreferences(p => ({ ...p, channels: { ...p.channels, [ch]: v } }))} />
                      <span className="capitalize">{ch}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-semibold mb-1">{t('types')}</div>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(preferences.types).map(([type, val]) => (
                    <label key={type} className="flex items-center gap-2">
                      <Switch checked={val} onCheckedChange={v => setPreferences(p => ({ ...p, types: { ...p.types, [type]: v } }))} />
                      <span className="capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-semibold mb-1">{t('popupPerType')}</div>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(preferences.popupPerType).map(([type, val]) => (
                    <label key={type} className="flex items-center gap-2">
                      <Switch checked={val} onCheckedChange={v => setPreferences(p => ({ ...p, popupPerType: { ...p.popupPerType, [type]: v } }))} />
                      <span className="capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-semibold mb-1">{t('soundPerType')}</div>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(preferences.soundPerType).map(([type, val]) => (
                    <label key={type} className="flex items-center gap-2">
                      <Switch checked={val} onCheckedChange={v => setPreferences(p => ({ ...p, soundPerType: { ...p.soundPerType, [type]: v } }))} />
                      <span className="capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              {prefError && <div className="text-red-500 text-xs mt-1">{prefError}</div>}
              {prefSuccess && <div className="text-green-600 text-xs mt-1">{prefSuccess}</div>}
              <div className="flex gap-2 mt-4">
                <button onClick={savePreferences} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" disabled={prefLoading}>{t('save')}</button>
                <button onClick={() => setShowPreferences(false)} className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400">{t('cancel')}</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {/* In NotificationCenter main UI, if DND is active, show custom DND message as a banner */}
      {preferences.dnd && isWithinDND(preferences.dnd, preferences.dndStart, preferences.dndEnd) && (
        <div className="w-full bg-yellow-100 text-yellow-800 text-center py-2 rounded mb-2 font-semibold">
          {preferences.dndMessage.replace('{end}', preferences.dndEnd)}
        </div>
      )}
    </div>
  );
} 