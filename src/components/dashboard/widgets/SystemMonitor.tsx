import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiActivity, FiServer, FiDatabase, FiWifi, FiCpu, FiHardDrive,
  FiShield, FiAlertCircle, FiCheckCircle, FiClock, FiRefreshCw,
  FiTrendingUp, FiTrendingDown, FiSettings, FiBarChart, FiZap
} from 'react-icons/fi';

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
  const [view, setView] = useState<'overview' | 'metrics' | 'services' | 'alerts'>('overview');
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    loadSystemData();
    const interval = setInterval(loadSystemData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSystemData = async () => {
    setLoading(true);
    try {
      // Simulate loading system metrics
      const mockMetrics: SystemMetric[] = [
        {
          name: 'CPU Usage',
          value: 45,
          unit: '%',
          status: 'healthy',
          trend: 'up',
          threshold: { warning: 70, critical: 90 },
          lastUpdated: new Date()
        },
        {
          name: 'Memory Usage',
          value: 68,
          unit: '%',
          status: 'warning',
          trend: 'up',
          threshold: { warning: 75, critical: 90 },
          lastUpdated: new Date()
        },
        {
          name: 'Disk Usage',
          value: 82,
          unit: '%',
          status: 'warning',
          trend: 'stable',
          threshold: { warning: 80, critical: 95 },
          lastUpdated: new Date()
        },
        {
          name: 'Network Traffic',
          value: 1250,
          unit: 'Mbps',
          status: 'healthy',
          trend: 'down',
          threshold: { warning: 2000, critical: 3000 },
          lastUpdated: new Date()
        },
        {
          name: 'Database Connections',
          value: 45,
          unit: '',
          status: 'healthy',
          trend: 'stable',
          threshold: { warning: 80, critical: 100 },
          lastUpdated: new Date()
        },
        {
          name: 'Active Users',
          value: 127,
          unit: '',
          status: 'healthy',
          trend: 'up',
          threshold: { warning: 200, critical: 300 },
          lastUpdated: new Date()
        }
      ];

      const mockServices: ServiceStatus[] = [
        {
          name: 'Web Server',
          status: 'online',
          responseTime: 45,
          uptime: 99.98,
          lastCheck: new Date(),
          endpoint: 'https://justice.com',
          description: 'Main web application server'
        },
        {
          name: 'Database',
          status: 'online',
          responseTime: 12,
          uptime: 99.99,
          lastCheck: new Date(),
          endpoint: 'postgresql://localhost:5432',
          description: 'Primary database server'
        },
        {
          name: 'Email Service',
          status: 'degraded',
          responseTime: 250,
          uptime: 98.5,
          lastCheck: new Date(),
          endpoint: 'smtp://mail.justice.com',
          description: 'Email delivery service'
        },
        {
          name: 'Payment Gateway',
          status: 'online',
          responseTime: 89,
          uptime: 99.95,
          lastCheck: new Date(),
          endpoint: 'https://api.payments.justice.com',
          description: 'Payment processing service'
        },
        {
          name: 'File Storage',
          status: 'online',
          responseTime: 67,
          uptime: 99.97,
          lastCheck: new Date(),
          endpoint: 'https://storage.justice.com',
          description: 'File storage and CDN service'
        },
        {
          name: 'Analytics API',
          status: 'maintenance',
          responseTime: 0,
          uptime: 0,
          lastCheck: new Date(),
          endpoint: 'https://analytics.justice.com',
          description: 'Analytics and reporting API'
        }
      ];

      const mockAlerts: Alert[] = [
        {
          id: '1',
          type: 'warning',
          title: 'High Memory Usage',
          message: 'Memory usage has exceeded 75% threshold',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          acknowledged: false,
          service: 'System'
        },
        {
          id: '2',
          type: 'error',
          title: 'Email Service Degraded',
          message: 'Email delivery service experiencing high latency',
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          acknowledged: true,
          service: 'Email Service'
        },
        {
          id: '3',
          type: 'info',
          title: 'Scheduled Maintenance',
          message: 'Analytics API will be under maintenance for 2 hours',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          acknowledged: false,
          service: 'Analytics API'
        }
      ];

      setMetrics(mockMetrics);
      setServices(mockServices);
      setAlerts(mockAlerts);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to load system data:', error);
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
            { id: 'alerts', label: 'Alerts', icon: FiAlertCircle }
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 