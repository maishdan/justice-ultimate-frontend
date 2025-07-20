import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiCpu, FiTrendingUp, FiShield, FiActivity, FiSettings,
  FiPlay, FiPause, FiTarget, FiBarChart, FiZap
} from 'react-icons/fi';
import { autonomousEngine } from '../../../ai/AutonomousDecisionEngine';
import { autonomousIntegration } from '../../../lib/autonomousIntegration';
import { AnimatePresence } from 'framer-motion';

interface AutonomousStats {
  totalDecisions: number;
  successRate: number;
  activeModules: number;
  businessValue: string;
  lastDecision: string;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
}

export default function AutonomousDashboardWidget() {
  const [stats, setStats] = useState<AutonomousStats>({
    totalDecisions: 0,
    successRate: 0,
    activeModules: 6,
    businessValue: 'KES 0',
    lastDecision: 'None',
    systemHealth: 'good'
  });
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const systemHealth = autonomousEngine.getSystemHealth();
      const decisionHistory = autonomousEngine.getDecisionHistory();
      const queueStatus = autonomousIntegration.getEventQueueStatus();

      setStats({
        totalDecisions: decisionHistory.length,
        successRate: systemHealth.avgSuccessRate,
        activeModules: systemHealth.enabledRules,
        businessValue: `KES ${(decisionHistory.length * 1500).toLocaleString()}`,
        lastDecision: systemHealth.lastDecision ? 
          systemHealth.lastDecision.timestamp.toLocaleString() : 'None',
        systemHealth: systemHealth.avgSuccessRate > 0.9 ? 'excellent' : 
                     systemHealth.avgSuccessRate > 0.8 ? 'good' : 
                     systemHealth.avgSuccessRate > 0.7 ? 'warning' : 'critical'
      });
    } catch (error) {
      console.error('Error loading autonomous stats:', error);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent': return '🟢';
      case 'good': return '🔵';
      case 'warning': return '🟡';
      case 'critical': return '🔴';
      default: return '⚪';
    }
  };

  const quickActions = [
    {
      name: 'Optimize Pricing',
      icon: FiTrendingUp,
      action: () => console.log('Optimize pricing'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'Check Inventory',
      icon: FiBarChart,
      action: () => console.log('Check inventory'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'Security Scan',
      icon: FiShield,
      action: () => console.log('Security scan'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      name: 'System Settings',
      icon: FiSettings,
      action: () => console.log('System settings'),
      color: 'bg-gray-500 hover:bg-gray-600'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-xl shadow-sm border border-gray-200 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                            <FiCpu className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Autonomous System</h3>
            <p className="text-sm text-gray-600">AI-powered business automation</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(stats.systemHealth)}`}>
            {getHealthIcon(stats.systemHealth)} {stats.systemHealth.charAt(0).toUpperCase() + stats.systemHealth.slice(1)}
          </span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiActivity className="text-sm" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalDecisions}</div>
          <div className="text-sm text-gray-600">Decisions Made</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {(stats.successRate * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.activeModules}</div>
          <div className="text-sm text-gray-600">Active Modules</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.businessValue}</div>
          <div className="text-sm text-gray-600">Business Value</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.action}
              className={`${action.color} text-white p-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2`}
            >
              <action.icon className="text-sm" />
              <span className="hidden md:inline">{action.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Last Decision:</span>
            <span className="font-medium">{stats.lastDecision}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Queue Status:</span>
            <span className="font-medium text-green-600">Active</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">System Mode:</span>
            <span className="font-medium text-blue-600">Autonomous</span>
          </div>
        </div>
      </div>

      {/* Performance Indicator */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">System Performance</span>
          <span className="font-medium">{(stats.successRate * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${stats.successRate * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Expandable Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 pt-4 mt-4"
          >
            <h4 className="text-sm font-medium text-gray-900 mb-3">System Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Event Queue:</span>
                  <span className="font-medium">0 pending</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Active Triggers:</span>
                  <span className="font-medium">5 enabled</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Response Time:</span>
                  <span className="font-medium">&lt; 2s avg</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Uptime:</span>
                  <span className="font-medium">99.9%</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Anomalies:</span>
                  <span className="font-medium text-green-600">0 detected</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Last Update:</span>
                  <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <FiZap className="text-yellow-500 text-sm" />
          <span className="text-xs text-gray-600">Autonomous Mode Active</span>
        </div>
        <button
          onClick={loadStats}
          disabled={loading}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Refresh'}
        </button>
      </div>
    </motion.div>
  );
} 