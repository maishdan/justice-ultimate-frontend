import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiActivity, FiServer, FiDatabase, FiWifi, FiCpu, FiHardDrive,
  FiShield, FiAlertCircle, FiCheckCircle, FiClock, FiRefreshCw,
  FiTrendingUp, FiTrendingDown, FiSettings, FiBarChart, FiZap
} from 'react-icons/fi';
import SecurityEventsTable from '../../security/SecurityEventsTable';
import { getRealTimeData, fetchSystemMetrics } from '../../../lib/automation';
import { supabase } from '../../../lib/supabaseClient';

function getSystemMetricsApiUrl() {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5001/api/system-metrics';
  }
  return 'https://backend-jua.onrender.com/api/system-metrics';
}

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  trend: 'up' | 'down' | 'stable';
  threshold: {
    warning: number;
    critical: number;
  };
  lastUpdated: Date;
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  responseTime: number;
  uptime: number;
  lastCheck: Date;
  endpoint: string;
  description: string;
}

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  service?: string;
}

export default function SystemMonitor() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [view, setView] = useState<'overview' | 'metrics' | 'services' | 'alerts' | 'security'>('overview');
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadSystemData();
    const interval = setInterval(loadSystemData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSystemData = async () => {
    setLoading(true);
    setErrorMsg(null); // Clear previous errors
    try {
      // Force session refresh to get latest 2FA status
      await supabase.auth.refreshSession();
      const session = await supabase.auth.getSession();
      const token = session?.data?.session?.access_token;
      const { data: userData, error: userError } = await supabase.auth.getUser();
      console.log('SystemMonitor: current user', userData, userError);
      if (!userData?.user) {
        setErrorMsg('You must be logged in as an admin to view system metrics.');
        setLoading(false);
        return;
      }
      if (userData.user.app_metadata?.role !== 'admin') {
        setErrorMsg('Only admins can view system metrics.');
        setLoading(false);
        return;
      }
      if (!token) {
        setErrorMsg('No session token. Please log in again.');
        setLoading(false);
        return;
      }
      // Fetch real system metrics from backend
      let realData;
      try {
        const apiUrl = getSystemMetricsApiUrl();
        const res = await fetch(apiUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const text = await res.text();
        try {
          realData = JSON.parse(text);
        } catch (err) {
          if (text.startsWith('<!DOCTYPE')) {
            throw new Error('System metrics endpoint returned HTML. Backend may not be running or you are not authorized.');
          }
          throw new Error('Failed to parse system metrics response: ' + text);
        }
        if (!res.ok) {
          throw new Error(realData.error || 'Failed to fetch system metrics');
        }
      } catch (err) {
        const e = err as Error;
        throw new Error('Failed to fetch system metrics: ' + (e.message || e));
      }
      const metrics: SystemMetric[] = [
        {
          name: 'CPU Usage',
          value: realData.cpuUsage,
          unit: '%',
          status: realData.cpuUsage > 90 ? 'critical' : realData.cpuUsage > 70 ? 'warning' : 'healthy',
          trend: 'stable',
          threshold: { warning: 70, critical: 90 },
          lastUpdated: new Date()
        },
        {
          name: 'Memory Usage',
          value: realData.memoryUsage,
          unit: '%',
          status: realData.memoryUsage > 90 ? 'critical' : realData.memoryUsage > 75 ? 'warning' : 'healthy',
          trend: 'stable',
          threshold: { warning: 75, critical: 90 },
          lastUpdated: new Date()
        },
        {
          name: 'Disk Usage',
          value: realData.diskUsage,
          unit: '%',
          status: realData.diskUsage > 95 ? 'critical' : realData.diskUsage > 80 ? 'warning' : 'healthy',
          trend: 'stable',
          threshold: { warning: 80, critical: 95 },
          lastUpdated: new Date()
        },
        {
          name: 'Network Traffic',
          value: realData.networkTraffic,
          unit: 'Mbps',
          status: realData.networkTraffic > 3000 ? 'critical' : realData.networkTraffic > 2000 ? 'warning' : 'healthy',
          trend: 'stable',
          threshold: { warning: 2000, critical: 3000 },
          lastUpdated: new Date()
        },
        {
          name: 'Database Connections',
          value: realData.dbConnections,
          unit: '',
          status: realData.dbConnections > 100 ? 'critical' : realData.dbConnections > 80 ? 'warning' : 'healthy',
          trend: 'stable',
          threshold: { warning: 80, critical: 100 },
          lastUpdated: new Date()
        },
        {
          name: 'Active Users',
          value: realData.activeUsers,
          unit: '',
          status: realData.activeUsers > 300 ? 'critical' : realData.activeUsers > 200 ? 'warning' : 'healthy',
          trend: 'stable',
          threshold: { warning: 200, critical: 300 },
          lastUpdated: new Date()
        }
      ];
      setMetrics(metrics);
      // Fetch real alerts from notifications table
      let alertsData, error;
      try {
        const res = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        alertsData = res.data;
        error = res.error;
      } catch (err) {
        const e = err as Error;
        throw new Error('Failed to fetch notifications: ' + (e.message || e));
      }
      if (error) throw new Error('Error fetching notifications: ' + (error as Error).message);
      const alerts: Alert[] = (alertsData || []).map((a: any) => ({
        id: a.id,
        type: a.type || 'info',
        title: a.title || a.subject || 'System Alert',
        message: a.message || a.body || '',
        timestamp: new Date(a.created_at),
        acknowledged: !!a.acknowledged,
        service: a.service || 'System'
      }));
      setAlerts(alerts);
      setLastRefresh(new Date());
    } catch (error) {
      const e = error as Error;
      console.error('Failed to load system data:', e);
      alert(e.message || e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return 'text-green-600 bg-green-100';
      case 'warning':
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
      case 'offline':
        return 'text-red-600 bg-red-100';
      case 'maintenance':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return <FiCheckCircle className="text-green-500" />;
      case 'warning':
      case 'degraded':
        return <FiAlertCircle className="text-yellow-500" />;
      case 'critical':
      case 'offline':
        return <FiAlertCircle className="text-red-500" />;
      case 'maintenance':
        return <FiSettings className="text-blue-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <FiTrendingUp className="text-green-500" />;
      case 'down':
        return <FiTrendingDown className="text-red-500" />;
      default:
        return <FiBarChart className="text-gray-500" />;
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true }
        : alert
    ));
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const getSystemHealth = () => {
    const criticalCount = metrics.filter(m => m.status === 'critical').length;
    const warningCount = metrics.filter(m => m.status === 'warning').length;
    const offlineCount = services.filter(s => s.status === 'offline').length;
    const degradedCount = services.filter(s => s.status === 'degraded').length;

    if (criticalCount > 0 || offlineCount > 0) return 'critical';
    if (warningCount > 0 || degradedCount > 0) return 'warning';
    return 'healthy';
  };

  const systemHealth = getSystemHealth();

  const renderOverview = () => (
    <div className="space-y-6">
      {/* System Health Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(systemHealth)}`}>
            {getStatusIcon(systemHealth)}
            <span className="text-sm font-medium capitalize">{systemHealth}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{metrics.length}</div>
            <div className="text-sm text-gray-600">Active Metrics</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{services.length}</div>
            <div className="text-sm text-gray-600">Monitored Services</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{alerts.filter(a => !a.acknowledged).length}</div>
            <div className="text-sm text-gray-600">Active Alerts</div>
          </div>
        </div>
      </div>

      {/* Critical Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.filter(m => m.status === 'critical' || m.status === 'warning').map((metric) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">{metric.name}</h4>
              <div className="flex items-center space-x-2">
                {getStatusIcon(metric.status)}
                {getTrendIcon(metric.trend)}
              </div>
            </div>

            <div className="text-3xl font-bold text-gray-900 mb-2">
              {metric.value}{metric.unit}
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full ${
                  metric.status === 'critical' ? 'bg-red-500' :
                  metric.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(metric.value, 100)}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Warning: {metric.threshold.warning}{metric.unit}</span>
              <span>Critical: {metric.threshold.critical}{metric.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Service Status Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Status</h3>
        <div className="space-y-3">
          {services.slice(0, 4).map((service) => (
            <div key={service.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(service.status)}
                <div>
                  <p className="font-medium text-gray-900">{service.name}</p>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{service.responseTime}ms</p>
                <p className="text-xs text-gray-600">{service.uptime}% uptime</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMetrics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{metric.name}</h4>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(metric.status)}
                  {getTrendIcon(metric.trend)}
                </div>
              </div>

              <div className="text-2xl font-bold text-gray-900 mb-2">
                {metric.value}{metric.unit}
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    metric.status === 'critical' ? 'bg-red-500' :
                    metric.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(metric.value, 100)}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>W: {metric.threshold.warning}{metric.unit}</span>
                <span>C: {metric.threshold.critical}{metric.unit}</span>
                <span>{metric.lastUpdated.toLocaleTimeString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Status</h3>
        <div className="space-y-4">
          {services.map((service) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(service.status)}
                  <div>
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.description}</p>
                    <p className="text-xs text-gray-500">{service.endpoint}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{service.responseTime}ms</p>
                      <p className="text-xs text-gray-600">Response Time</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{service.uptime}%</p>
                      <p className="text-xs text-gray-600">Uptime</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(service.status)}`}>
                      {service.status}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAlerts(alerts.map(alert => ({ ...alert, acknowledged: true })))}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Acknowledge All
            </button>
            <button
              onClick={() => setAlerts([])}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`border-l-4 p-4 rounded-r-lg ${
                  alert.type === 'critical' ? 'border-red-500 bg-red-50' :
                  alert.type === 'error' ? 'border-red-400 bg-red-50' :
                  alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{alert.title}</h4>
                      {alert.service && (
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                          {alert.service}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                    <p className="text-xs text-gray-500">
                      {alert.timestamp.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Acknowledge
                      </button>
                    )}
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Monitor</h2>
          <p className="text-gray-600">Real-time system health monitoring and alerts</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <button
            onClick={loadSystemData}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'overview', label: 'Overview', icon: FiActivity },
            { id: 'metrics', label: 'Metrics', icon: FiBarChart },
            { id: 'services', label: 'Services', icon: FiServer },
            { id: 'alerts', label: 'Alerts', icon: FiAlertCircle },
            { id: 'security', label: 'Security Events', icon: FiShield }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                view === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {view === 'overview' && renderOverview()}
          {view === 'metrics' && renderMetrics()}
          {view === 'services' && renderServices()}
          {view === 'alerts' && renderAlerts()}
          {view === 'security' && <SecurityEventsTable />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 