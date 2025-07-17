import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  FiTrendingUp, FiTrendingDown, FiUsers, FiDollarSign, FiShoppingCart,
  FiMail, FiMessageSquare, FiBell, FiSettings, FiRefreshCw, FiDownload,
  FiFilter, FiCalendar, FiBarChart, FiPieChart, FiActivity
} from 'react-icons/fi';
import { automation, trackEvent, getAnalytics, getRealTimeData, getAnomalies } from '../../../lib/automation';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#6366f1', '#f59e42', '#10b981'];

interface AnalyticsData {
  totalEvents: number;
  eventsByType: Record<string, any[]>;
  eventsByUser: Record<string, any[]>;
  conversionFunnel: any;
  userJourney: any[];
  topPages: any[];
  topActions: any[];
  revenueMetrics: any;
  customerSegments: any[];
}

interface RealTimeMetrics {
  activeUsers: number;
  pageViews: number;
  conversions: number;
  revenue: number;
  alerts: any[];
  performance: any;
}

export default function AdvancedAnalyticsPanel() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [realTimeData, setRealTimeData] = useState<RealTimeMetrics | null>(null);
  const [dateRange, setDateRange] = useState('7d');
  const [view, setView] = useState<'overview' | 'realtime' | 'automation' | 'reports'>('overview');
  const [loading, setLoading] = useState(false);
  const [automationRules, setAutomationRules] = useState<any[]>([]);
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [anomalies, setAnomalies] = useState<{ metric: string, anomalies: any[] }[]>([]);

  useEffect(() => {
    loadAnalyticsData();
    loadRealTimeData();
    fetchAnomalies();
    const interval = setInterval(loadRealTimeData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case '1d':
          startDate.setDate(endDate.getDate() - 1);
          break;
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
      }

      const data = getAnalytics(startDate, endDate);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRealTimeData = async () => {
    try {
      const data = getRealTimeData();
      setRealTimeData(data);
    } catch (error) {
      console.error('Failed to load real-time data:', error);
    }
  };

  const fetchAnomalies = () => {
    if (!analyticsData) return;
    const events = Object.values(analyticsData.eventsByType).flat();
    const revenueAnomalies = getAnomalies(events, 'revenue');
    const conversionAnomalies = getAnomalies(events, 'conversions');
    const pageViewAnomalies = getAnomalies(events, 'page_view');
    setAnomalies([
      { metric: 'Revenue', anomalies: revenueAnomalies },
      { metric: 'Conversions', anomalies: conversionAnomalies },
      { metric: 'Page Views', anomalies: pageViewAnomalies },
    ]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-KE').format(num);
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'revenue': return <FiDollarSign className="text-green-500" />;
      case 'users': return <FiUsers className="text-blue-500" />;
      case 'conversions': return <FiShoppingCart className="text-purple-500" />;
      case 'pageviews': return <FiBarChart className="text-orange-500" />;
      default: return <FiActivity className="text-gray-500" />;
    }
  };

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'revenue': return 'Revenue';
      case 'users': return 'Active Users';
      case 'conversions': return 'Conversions';
      case 'pageviews': return 'Page Views';
      default: return metric;
    }
  };

  const getMetricValue = (metric: string) => {
    if (!realTimeData) return 0;
    
    switch (metric) {
      case 'revenue': return realTimeData.revenue;
      case 'users': return realTimeData.activeUsers;
      case 'conversions': return realTimeData.conversions;
      case 'pageviews': return realTimeData.pageViews;
      default: return 0;
    }
  };

  const getMetricChange = (metric: string) => {
    // Simulate change percentage
    const changes = {
      revenue: 12.5,
      users: -2.3,
      conversions: 8.7,
      pageviews: 15.2
    };
    return changes[metric as keyof typeof changes] || 0;
  };

  const exportReport = (format: 'csv' | 'pdf' | 'excel') => {
    trackEvent('report_exported', { format, dateRange });
    // Implementation for export functionality
    console.log(`Exporting report in ${format} format`);
  };

  const createAutomationRule = () => {
    // Implementation for creating automation rules
    console.log('Creating new automation rule');
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Anomaly Alerts */}
      {anomalies.filter(a => a.anomalies.length > 0).length > 0 && (
        <div className="bg-red-100 border border-red-300 text-red-800 rounded-lg p-4 mb-4">
          <strong>⚠️ Anomaly Detected:</strong>
          <ul className="list-disc ml-6 mt-2">
            {anomalies.filter(a => a.anomalies.length > 0).map(a => (
              <li key={a.metric}>
                {a.metric}: {a.anomalies.length} outlier(s) detected
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {['revenue', 'users', 'conversions', 'pageviews'].map((metric) => (
          <motion.div
            key={metric}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{getMetricLabel(metric)}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metric === 'revenue' ? formatCurrency(getMetricValue(metric)) : formatNumber(getMetricValue(metric))}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                {getMetricIcon(metric)}
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {getMetricChange(metric) > 0 ? (
                <FiTrendingUp className="text-green-500 mr-1" />
              ) : (
                <FiTrendingDown className="text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                getMetricChange(metric) > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(getMetricChange(metric))}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <FiBarChart className="text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData?.revenueMetrics?.dailyData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Conversion Funnel</h3>
            <FiPieChart className="text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData?.conversionFunnel?.stages || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Customer Segments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Customer Segments</h3>
          <FiUsers className="text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analyticsData?.customerSegments?.map((segment: any, index: number) => (
            <div key={segment.segment} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{segment.count}</div>
              <div className="text-sm text-gray-600">{segment.segment}</div>
              <div className="text-xs text-gray-500">{segment.percentage}%</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderRealTime = () => (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Active Users</p>
              <p className="text-3xl font-bold">{realTimeData?.activeUsers || 0}</p>
            </div>
            <FiUsers className="text-4xl text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Page Views</p>
              <p className="text-3xl font-bold">{realTimeData?.pageViews || 0}</p>
            </div>
            <FiBarChart className="text-4xl text-green-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Conversions</p>
              <p className="text-3xl font-bold">{realTimeData?.conversions || 0}</p>
            </div>
            <FiShoppingCart className="text-4xl text-purple-200" />
          </div>
        </motion.div>
      </div>

      {/* Live Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Live Activity</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Live</span>
          </div>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New user registered</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderAutomation = () => (
    <div className="space-y-6">
      {/* Automation Rules */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Automation Rules</h3>
          <button
            onClick={createAutomationRule}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Rule
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {automationRules.map((rule, index) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{rule.name}</h4>
                <div className={`w-3 h-3 rounded-full ${rule.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {rule.trigger}
                </span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  {rule.actions.length} actions
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive email alerts for important events</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-600">Receive SMS alerts for urgent matters</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Slack Integration</p>
              <p className="text-sm text-gray-600">Send alerts to Slack channels</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Generate Reports</h3>
          <div className="flex items-center space-x-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button
              onClick={() => exportReport('csv')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiDownload className="inline mr-2" />
              Export CSV
            </button>
            <button
              onClick={() => exportReport('pdf')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <FiDownload className="inline mr-2" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
          <div className="space-y-3">
            {analyticsData?.topPages?.slice(0, 5).map((page, index) => (
              <div key={page.page} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <span className="text-sm text-gray-900">{page.page}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{page.views}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Actions</h3>
          <div className="space-y-3">
            {analyticsData?.topActions?.slice(0, 5).map((action, index) => (
              <div key={action.action} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <span className="text-sm text-gray-900">{action.action}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{action.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-gray-600">Comprehensive insights and automation controls</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadAnalyticsData}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`inline mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'overview', label: 'Overview', icon: FiBarChart },
            { id: 'realtime', label: 'Real-time', icon: FiActivity },
            { id: 'automation', label: 'Automation', icon: FiSettings },
            { id: 'reports', label: 'Reports', icon: FiDownload }
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
          {view === 'realtime' && renderRealTime()}
          {view === 'automation' && renderAutomation()}
          {view === 'reports' && renderReports()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 