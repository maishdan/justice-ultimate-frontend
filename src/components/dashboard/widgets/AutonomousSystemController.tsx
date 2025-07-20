import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlay, FiPause, FiSettings, FiShield, FiTrendingUp, FiActivity,
  FiCpu, FiZap, FiAlertTriangle, FiCheckCircle, FiClock,
  FiBarChart, FiTarget, FiRefreshCw, FiPower, FiEye, FiEyeOff
} from 'react-icons/fi';
import { autonomousEngine } from '../../../ai/AutonomousDecisionEngine';
import { supabase } from '../../../lib/supabaseClient';

interface AutonomousModule {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error' | 'maintenance';
  confidence: number;
  lastActivity: Date;
  performance: {
    decisionsMade: number;
    successRate: number;
    avgResponseTime: number;
    businessImpact: string;
  };
  settings: {
    enabled: boolean;
    autoExecute: boolean;
    requireConfirmation: boolean;
    threshold: number;
  };
}

interface SystemMetrics {
  totalDecisions: number;
  successRate: number;
  activeModules: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
  lastUpdate: Date;
  anomalies: number;
  businessValue: string;
}

export default function AutonomousSystemController() {
  const [modules, setModules] = useState<AutonomousModule[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalDecisions: 0,
    successRate: 0,
    activeModules: 0,
    systemHealth: 'good',
    lastUpdate: new Date(),
    anomalies: 0,
    businessValue: 'KES 0'
  });
  const [view, setView] = useState<'overview' | 'modules' | 'analytics' | 'settings'>('overview');
  const [systemEnabled, setSystemEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState<AutonomousModule | null>(null);

  useEffect(() => {
    initializeModules();
    loadSystemMetrics();
    const interval = setInterval(loadSystemMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const initializeModules = () => {
    const initialModules: AutonomousModule[] = [
      {
        id: 'pricing',
        name: 'Dynamic Pricing Engine',
        description: 'Automatically optimizes vehicle prices based on demand, competition, and market conditions',
        status: 'active',
        confidence: 0.92,
        lastActivity: new Date(),
        performance: {
          decisionsMade: 156,
          successRate: 0.94,
          avgResponseTime: 2.3,
          businessImpact: '+15.2% revenue'
        },
        settings: {
          enabled: true,
          autoExecute: true,
          requireConfirmation: false,
          threshold: 0.85
        }
      },
      {
        id: 'inventory',
        name: 'Inventory Management',
        description: 'Predicts demand and manages inventory levels autonomously',
        status: 'active',
        confidence: 0.88,
        lastActivity: new Date(Date.now() - 300000),
        performance: {
          decisionsMade: 89,
          successRate: 0.91,
          avgResponseTime: 5.1,
          businessImpact: '-12.8% costs'
        },
        settings: {
          enabled: true,
          autoExecute: true,
          requireConfirmation: true,
          threshold: 0.80
        }
      },
      {
        id: 'security',
        name: 'Security Monitoring',
        description: 'Detects and responds to security threats automatically',
        status: 'active',
        confidence: 0.95,
        lastActivity: new Date(),
        performance: {
          decisionsMade: 23,
          successRate: 0.96,
          avgResponseTime: 0.8,
          businessImpact: '100% threat prevention'
        },
        settings: {
          enabled: true,
          autoExecute: true,
          requireConfirmation: false,
          threshold: 0.90
        }
      },
      {
        id: 'maintenance',
        name: 'Maintenance Scheduler',
        description: 'Schedules vehicle maintenance based on usage and condition',
        status: 'active',
        confidence: 0.90,
        lastActivity: new Date(Date.now() - 600000),
        performance: {
          decisionsMade: 67,
          successRate: 0.93,
          avgResponseTime: 3.2,
          businessImpact: '+8.5% uptime'
        },
        settings: {
          enabled: true,
          autoExecute: true,
          requireConfirmation: true,
          threshold: 0.85
        }
      },
      {
        id: 'customer_service',
        name: 'Customer Service AI',
        description: 'Handles customer inquiries and resolves issues autonomously',
        status: 'active',
        confidence: 0.85,
        lastActivity: new Date(Date.now() - 120000),
        performance: {
          decisionsMade: 234,
          successRate: 0.87,
          avgResponseTime: 1.5,
          businessImpact: '+22.1% satisfaction'
        },
        settings: {
          enabled: true,
          autoExecute: true,
          requireConfirmation: false,
          threshold: 0.80
        }
      },
      {
        id: 'analytics',
        name: 'Business Analytics',
        description: 'Analyzes business performance and provides insights',
        status: 'active',
        confidence: 0.89,
        lastActivity: new Date(Date.now() - 900000),
        performance: {
          decisionsMade: 45,
          successRate: 0.91,
          avgResponseTime: 8.7,
          businessImpact: '+18.3% efficiency'
        },
        settings: {
          enabled: true,
          autoExecute: false,
          requireConfirmation: true,
          threshold: 0.85
        }
      }
    ];

    setModules(initialModules);
  };

  const loadSystemMetrics = async () => {
    try {
      const systemHealth = autonomousEngine.getSystemHealth();
      const decisionHistory = autonomousEngine.getDecisionHistory();
      
      const totalDecisions = decisionHistory.length;
      const successRate = systemHealth.avgSuccessRate;
      const activeModules = modules.filter(m => m.status === 'active').length;
      
      // Calculate business value (simplified)
      const businessValue = `KES ${(totalDecisions * 1500).toLocaleString()}`;
      
      // Detect anomalies
      const anomalies = await autonomousEngine.detectAnomalies();
      
      setMetrics({
        totalDecisions,
        successRate,
        activeModules,
        systemHealth: successRate > 0.9 ? 'excellent' : successRate > 0.8 ? 'good' : successRate > 0.7 ? 'warning' : 'critical',
        lastUpdate: new Date(),
        anomalies: anomalies.length,
        businessValue
      });
    } catch (error) {
      console.error('Error loading system metrics:', error);
    }
  };

  const toggleModule = async (moduleId: string) => {
    setLoading(true);
    try {
      const updatedModules = modules.map(module => 
        module.id === moduleId 
          ? { ...module, settings: { ...module.settings, enabled: !module.settings.enabled } }
          : module
      );
      setModules(updatedModules);
      
      // Update in database
      await supabase.from('autonomous_modules').upsert({
        module_id: moduleId,
        enabled: !modules.find(m => m.id === moduleId)?.settings.enabled,
        updated_at: new Date().toISOString()
      });
      
      await loadSystemMetrics();
    } catch (error) {
      console.error('Error toggling module:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSystem = async () => {
    setLoading(true);
    try {
      setSystemEnabled(!systemEnabled);
      
      // Update all modules
      const updatedModules = modules.map(module => ({
        ...module,
        settings: { ...module.settings, enabled: !systemEnabled }
      }));
      setModules(updatedModules);
      
      // Log system state change
      await supabase.from('system_events').insert({
        event_type: 'autonomous_system_toggle',
        details: `System ${!systemEnabled ? 'enabled' : 'disabled'}`,
        timestamp: new Date().toISOString()
      });
      
      await loadSystemMetrics();
    } catch (error) {
      console.error('Error toggling system:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* System Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
          <button
            onClick={toggleSystem}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              systemEnabled
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
          >
            <FiPower className="text-sm" />
            <span>{systemEnabled ? 'Active' : 'Inactive'}</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getHealthColor(metrics.systemHealth)}`}>
              {metrics.activeModules}
            </div>
            <div className="text-sm text-gray-600">Active Modules</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {metrics.totalDecisions}
            </div>
            <div className="text-sm text-gray-600">Total Decisions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {(metrics.successRate * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {metrics.businessValue}
            </div>
            <div className="text-sm text-gray-600">Business Value</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button
            onClick={() => setView('modules')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <FiSettings className="text-blue-500 text-xl mb-2" />
            <div className="font-medium">Module Settings</div>
            <div className="text-sm text-gray-600">Configure autonomous modules</div>
          </button>
          <button
            onClick={() => setView('analytics')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <FiBarChart className="text-green-500 text-xl mb-2" />
            <div className="font-medium">Analytics</div>
            <div className="text-sm text-gray-600">View performance metrics</div>
          </button>
          <button
            onClick={loadSystemMetrics}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <FiRefreshCw className="text-purple-500 text-xl mb-2" />
            <div className="font-medium">Refresh Data</div>
            <div className="text-sm text-gray-600">Update system metrics</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {modules.slice(0, 3).map(module => (
            <div key={module.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${module.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                <div>
                  <div className="font-medium">{module.name}</div>
                  <div className="text-sm text-gray-600">
                    Last activity: {module.lastActivity.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{(module.performance.successRate * 100).toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderModules = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Autonomous Modules</h3>
        <div className="text-sm text-gray-600">
          {modules.filter(m => m.settings.enabled).length} of {modules.length} active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {modules.map(module => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">{module.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{module.description}</p>
              </div>
              <button
                onClick={() => toggleModule(module.id)}
                disabled={loading}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  module.settings.enabled
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {module.settings.enabled ? 'Active' : 'Inactive'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {(module.confidence * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Confidence</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {module.performance.decisionsMade}
                </div>
                <div className="text-sm text-gray-600">Decisions</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Success Rate:</span>
                <span className="font-medium">{(module.performance.successRate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Response Time:</span>
                <span className="font-medium">{module.performance.avgResponseTime}s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Business Impact:</span>
                <span className="font-medium text-green-600">{module.performance.businessImpact}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span>Auto Execute:</span>
                <span className={`font-medium ${module.settings.autoExecute ? 'text-green-600' : 'text-gray-600'}`}>
                  {module.settings.autoExecute ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Performance Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Decision Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Decision Trends</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Decisions:</span>
              <span className="font-medium">{metrics.totalDecisions}</span>
            </div>
            <div className="flex justify-between">
              <span>Success Rate:</span>
              <span className="font-medium">{(metrics.successRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Active Modules:</span>
              <span className="font-medium">{metrics.activeModules}</span>
            </div>
            <div className="flex justify-between">
              <span>Anomalies Detected:</span>
              <span className="font-medium text-red-600">{metrics.anomalies}</span>
            </div>
          </div>
        </div>

        {/* Business Impact */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Business Impact</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Revenue Impact:</span>
              <span className="font-medium text-green-600">+15.2%</span>
            </div>
            <div className="flex justify-between">
              <span>Cost Reduction:</span>
              <span className="font-medium text-green-600">-12.8%</span>
            </div>
            <div className="flex justify-between">
              <span>Efficiency Gain:</span>
              <span className="font-medium text-green-600">+18.3%</span>
            </div>
            <div className="flex justify-between">
              <span>Customer Satisfaction:</span>
              <span className="font-medium text-green-600">+22.1%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Module Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Module Performance</h4>
        <div className="space-y-4">
          {modules.map(module => (
            <div key={module.id} className="flex items-center space-x-4">
              <div className="w-32 text-sm font-medium">{module.name}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${module.performance.successRate * 100}%` }}
                />
              </div>
              <div className="w-16 text-sm text-right">
                {(module.performance.successRate * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Global Settings</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Autonomous Mode</div>
              <div className="text-sm text-gray-600">Allow system to make decisions automatically</div>
            </div>
            <button
              onClick={toggleSystem}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                systemEnabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  systemEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Require Confirmation</div>
              <div className="text-sm text-gray-600">Ask for approval before executing actions</div>
            </div>
            <input type="checkbox" className="rounded" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Log All Decisions</div>
              <div className="text-sm text-gray-600">Record all autonomous decisions for audit</div>
            </div>
            <input type="checkbox" className="rounded" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Autonomous System Controller</h2>
          <p className="text-gray-600">Manage and monitor autonomous business operations</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(systemEnabled ? 'active' : 'inactive')}`}>
            {systemEnabled ? 'System Active' : 'System Inactive'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: FiActivity },
          { id: 'modules', label: 'Modules', icon: FiCpu },
          { id: 'analytics', label: 'Analytics', icon: FiBarChart },
          { id: 'settings', label: 'Settings', icon: FiSettings }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setView(id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
              view === id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="text-sm" />
            <span>{label}</span>
          </button>
        ))}
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
          {view === 'modules' && renderModules()}
          {view === 'analytics' && renderAnalytics()}
          {view === 'settings' && renderSettings()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 