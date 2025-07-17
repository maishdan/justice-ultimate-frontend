import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiLink, FiSettings, FiCheck, FiX, FiRefreshCw, FiPlus, FiEdit, FiTrash2,
  FiMail, FiMessageSquare, FiSlack, FiCreditCard, FiTruck, FiMap, FiDatabase,
  FiShield, FiZap, FiActivity, FiDownload, FiUpload, FiKey, FiGlobe
} from 'react-icons/fi';

interface Integration {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'payment' | 'shipping' | 'maps' | 'database' | 'api' | 'webhook';
  provider: string;
  status: 'connected' | 'disconnected' | 'error' | 'configuring';
  apiKey?: string;
  endpoint?: string;
  lastSync?: Date;
  syncInterval: number; // in minutes
  config: any;
  description: string;
  icon: string;
  webhookUrl?: string;
  webhookSecret?: string;
}

interface ApiEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  description: string;
  rateLimit: number;
  lastUsed?: Date;
  status: 'active' | 'inactive' | 'error';
}

export default function IntegrationHub() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [apiEndpoints, setApiEndpoints] = useState<ApiEndpoint[]>([]);
  const [view, setView] = useState<'integrations' | 'apis' | 'webhooks' | 'logs'>('integrations');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>({});

  useEffect(() => {
    loadIntegrations();
    loadApiEndpoints();
  }, []);

  const loadIntegrations = () => {
    const mockIntegrations: Integration[] = [
      {
        id: '1',
        name: 'Email Service',
        type: 'email',
        provider: 'SendGrid',
        status: 'connected',
        apiKey: 'sg_****',
        endpoint: 'https://api.sendgrid.com/v3',
        lastSync: new Date(Date.now() - 1000 * 60 * 30),
        syncInterval: 5,
        config: { fromEmail: 'noreply@justice.com', templates: ['welcome', 'order'] },
        description: 'Email delivery service for notifications and marketing',
        icon: 'FiMail'
      },
      {
        id: '2',
        name: 'SMS Gateway',
        type: 'sms',
        provider: 'Africa\'s Talking',
        status: 'connected',
        apiKey: 'at_****',
        endpoint: 'https://api.africastalking.com/version1',
        lastSync: new Date(Date.now() - 1000 * 60 * 15),
        syncInterval: 2,
        config: { senderId: 'JUSTICE', countryCode: 'KE' },
        description: 'SMS delivery service for notifications',
        icon: 'FiMessageSquare'
      },
      {
        id: '3',
        name: 'Payment Gateway',
        type: 'payment',
        provider: 'M-Pesa',
        status: 'connected',
        apiKey: 'mpesa_****',
        endpoint: 'https://sandbox.safaricom.co.ke/mpesa',
        lastSync: new Date(Date.now() - 1000 * 60 * 5),
        syncInterval: 1,
        config: { businessShortCode: '174379', passkey: '****' },
        description: 'Mobile money payment processing',
        icon: 'FiCreditCard'
      },
      {
        id: '4',
        name: 'Shipping API',
        type: 'shipping',
        provider: 'DHL',
        status: 'error',
        apiKey: 'dhl_****',
        endpoint: 'https://api.dhl.com/parcel/de/v2',
        lastSync: new Date(Date.now() - 1000 * 60 * 60),
        syncInterval: 30,
        config: { accountNumber: '123456789', serviceType: 'express' },
        description: 'International shipping and tracking',
        icon: 'FiTruck'
      },
      {
        id: '5',
        name: 'Maps Service',
        type: 'maps',
        provider: 'Google Maps',
        status: 'connected',
        apiKey: 'gmaps_****',
        endpoint: 'https://maps.googleapis.com/maps/api',
        lastSync: new Date(Date.now() - 1000 * 60 * 10),
        syncInterval: 10,
        config: { apiKey: 'gmaps_****', services: ['geocoding', 'directions'] },
        description: 'Location services and mapping',
        icon: 'FiMap'
      },
      {
        id: '6',
        name: 'Slack Integration',
        type: 'api',
        provider: 'Slack',
        status: 'connected',
        webhookUrl: 'https://hooks.slack.com/services/****',
        webhookSecret: 'slack_****',
        lastSync: new Date(Date.now() - 1000 * 60 * 20),
        syncInterval: 5,
        config: { channels: ['#sales', '#support'], events: ['new_order', 'support_ticket'] },
        description: 'Team communication and notifications',
        icon: 'FiSlack'
      }
    ];
    setIntegrations(mockIntegrations);
  };

  const loadApiEndpoints = () => {
    const mockEndpoints: ApiEndpoint[] = [
      {
        id: '1',
        name: 'Customer API',
        method: 'GET',
        url: '/api/customers',
        description: 'Retrieve customer information',
        rateLimit: 1000,
        lastUsed: new Date(Date.now() - 1000 * 60 * 5),
        status: 'active'
      },
      {
        id: '2',
        name: 'Order API',
        method: 'POST',
        url: '/api/orders',
        description: 'Create new orders',
        rateLimit: 500,
        lastUsed: new Date(Date.now() - 1000 * 60 * 2),
        status: 'active'
      },
      {
        id: '3',
        name: 'Inventory API',
        method: 'PUT',
        url: '/api/inventory',
        description: 'Update inventory levels',
        rateLimit: 200,
        lastUsed: new Date(Date.now() - 1000 * 60 * 15),
        status: 'active'
      },
      {
        id: '4',
        name: 'Analytics API',
        method: 'GET',
        url: '/api/analytics',
        description: 'Retrieve analytics data',
        rateLimit: 100,
        lastUsed: new Date(Date.now() - 1000 * 60 * 30),
        status: 'inactive'
      }
    ];
    setApiEndpoints(mockEndpoints);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'disconnected':
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'configuring':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return <FiCheck className="text-green-500" />;
      case 'disconnected':
      case 'inactive':
        return <FiX className="text-gray-500" />;
      case 'error':
        return <FiX className="text-red-500" />;
      case 'configuring':
        return <FiSettings className="text-yellow-500" />;
      default:
        return <FiSettings className="text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <FiMail className="text-blue-500" />;
      case 'sms': return <FiMessageSquare className="text-green-500" />;
      case 'payment': return <FiCreditCard className="text-purple-500" />;
      case 'shipping': return <FiTruck className="text-orange-500" />;
      case 'maps': return <FiMap className="text-red-500" />;
      case 'database': return <FiDatabase className="text-indigo-500" />;
      case 'api': return <FiGlobe className="text-cyan-500" />;
      case 'webhook': return <FiZap className="text-yellow-500" />;
      default: return <FiLink className="text-gray-500" />;
    }
  };

  const testIntegration = async (integrationId: string) => {
    setLoading(true);
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = Math.random() > 0.3; // 70% success rate
      setTestResults(prev => ({
        ...prev,
        [integrationId]: {
          success,
          message: success ? 'Connection successful' : 'Connection failed',
          timestamp: new Date()
        }
      }));

      if (success) {
        setIntegrations(prev => prev.map(integration => 
          integration.id === integrationId 
            ? { ...integration, status: 'connected' as const, lastSync: new Date() }
            : integration
        ));
      }
    } catch (error) {
      console.error('Test failed:', error);
      setTestResults(prev => ({
        ...prev,
        [integrationId]: {
          success: false,
          message: 'Test failed',
          timestamp: new Date()
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const disconnectIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'disconnected' as const }
        : integration
    ));
  };

  const deleteIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.filter(integration => integration.id !== integrationId));
  };

  const toggleEndpoint = (endpointId: string) => {
    setApiEndpoints(prev => prev.map(endpoint => 
      endpoint.id === endpointId 
        ? { ...endpoint, status: endpoint.status === 'active' ? 'inactive' : 'active' }
        : endpoint
    ));
  };

  const renderIntegrations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Service Integrations</h3>
        <button
          onClick={() => setSelectedIntegration({
            id: 'new',
            name: '',
            type: 'email',
            provider: '',
            status: 'disconnected',
            apiKey: '',
            endpoint: '',
            lastSync: undefined,
            syncInterval: 5,
            config: {},
            description: '',
            icon: 'FiMail'
          })}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Integration</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getTypeIcon(integration.type)}
                <div>
                  <h4 className="font-semibold text-gray-900">{integration.name}</h4>
                  <p className="text-sm text-gray-600">{integration.provider}</p>
                </div>
              </div>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                {getStatusIcon(integration.status)}
                <span className="capitalize">{integration.status}</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Last Sync:</span>
                <span>{integration.lastSync?.toLocaleTimeString() || 'Never'}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Sync Interval:</span>
                <span>{integration.syncInterval} min</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => testIntegration(integration.id)}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
                >
                  Test
                </button>
                <button
                  onClick={() => setSelectedIntegration(integration)}
                  className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                >
                  Configure
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => disconnectIntegration(integration.id)}
                  className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                >
                  Disconnect
                </button>
                <button
                  onClick={() => deleteIntegration(integration.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Test Results */}
            {testResults[integration.id] && (
              <div className={`mt-3 p-2 rounded text-xs ${
                testResults[integration.id].success 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {testResults[integration.id].message}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderApis = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">API Endpoints</h3>
        <button
          onClick={() => setSelectedIntegration({
            id: 'new',
            name: '',
            type: 'api',
            provider: '',
            status: 'disconnected',
            apiKey: '',
            endpoint: '',
            lastSync: undefined,
            syncInterval: 5,
            config: {},
            description: '',
            icon: 'FiGlobe'
          })}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Endpoint</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900">API Documentation</h4>
        </div>
        <div className="divide-y divide-gray-200">
          {apiEndpoints.map((endpoint) => (
            <div key={endpoint.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                    endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                    endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {endpoint.method}
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">{endpoint.name}</h5>
                    <p className="text-sm text-gray-600">{endpoint.url}</p>
                    <p className="text-xs text-gray-500">{endpoint.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{endpoint.rateLimit}/min</p>
                    <p className="text-xs text-gray-500">Rate Limit</p>
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(endpoint.status)}`}>
                    {getStatusIcon(endpoint.status)}
                    <span className="capitalize">{endpoint.status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleEndpoint(endpoint.id)}
                      className={`text-sm font-medium ${
                        endpoint.status === 'active' 
                          ? 'text-yellow-600 hover:text-yellow-700' 
                          : 'text-green-600 hover:text-green-700'
                      }`}
                    >
                      {endpoint.status === 'active' ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => setSelectedIntegration(endpoint)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWebhooks = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Webhook Configuration</h3>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
            <input
              type="url"
              defaultValue="https://api.justice.com/webhooks"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
            <input
              type="password"
              defaultValue="webhook_secret_****"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Events</label>
            <div className="space-y-2">
              {['order.created', 'order.updated', 'customer.registered', 'payment.completed'].map((event) => (
                <label key={event} className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">{event}</span>
                </label>
              ))}
            </div>
          </div>
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Save Webhook Configuration
          </button>
        </div>
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Integration Logs</h3>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  i % 4 === 0 ? 'bg-green-500' : 
                  i % 4 === 1 ? 'bg-yellow-500' : 
                  i % 4 === 2 ? 'bg-red-500' : 'bg-blue-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {i % 4 === 0 ? 'Integration successful' : 
                     i % 4 === 1 ? 'API rate limit warning' : 
                     i % 4 === 2 ? 'Connection failed' : 'Webhook received'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {i % 4 === 0 ? 'SendGrid API' : 
                     i % 4 === 1 ? 'M-Pesa API' : 
                     i % 4 === 2 ? 'DHL API' : 'Slack Webhook'}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(Date.now() - i * 60000).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Integration Hub</h2>
          <p className="text-gray-600">Manage external service integrations and API connections</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              loadIntegrations();
              loadApiEndpoints();
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'integrations', label: 'Integrations', icon: FiLink },
            { id: 'apis', label: 'APIs', icon: FiGlobe },
            { id: 'webhooks', label: 'Webhooks', icon: FiZap },
            { id: 'logs', label: 'Logs', icon: FiActivity }
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
          {view === 'integrations' && renderIntegrations()}
          {view === 'apis' && renderApis()}
          {view === 'webhooks' && renderWebhooks()}
          {view === 'logs' && renderLogs()}
        </motion.div>
      </AnimatePresence>

      {/* Integration Details Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Configure Integration</h3>
              <button
                onClick={() => setSelectedIntegration(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">API Key</label>
                <input
                  type="password"
                  defaultValue={selectedIntegration.apiKey}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Endpoint URL</label>
                <input
                  type="url"
                  defaultValue={selectedIntegration.endpoint}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Sync Interval (minutes)</label>
                <input
                  type="number"
                  defaultValue={selectedIntegration.syncInterval}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setSelectedIntegration(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setSelectedIntegration(null)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 