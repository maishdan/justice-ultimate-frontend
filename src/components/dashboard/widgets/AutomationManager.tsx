import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiEdit, FiTrash2, FiToggleRight, FiToggleLeft, FiMail, 
  FiMessageSquare, FiBell, FiSlack, FiZap, FiFilter, FiClock,
  FiUsers, FiDollarSign, FiShoppingCart, FiCalendar, FiSettings
} from 'react-icons/fi';
import { automation, trackEvent } from '../../../lib/automation';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: 'event' | 'schedule' | 'condition' | 'webhook' | 'user_action';
  conditions: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
  }[];
  actions: {
    type: 'email' | 'sms' | 'slack' | 'teams' | 'webhook' | 'database';
    config: any;
  }[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'slack' | 'teams';
  subject?: string;
  content: string;
  variables: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default function AutomationManager() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [view, setView] = useState<'rules' | 'templates' | 'integrations' | 'logs'>('rules');
  const [showCreateRule, setShowCreateRule] = useState(false);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRules();
    loadTemplates();
  }, []);

  const loadRules = () => {
    const storedRules = localStorage.getItem('automation_rules');
    if (storedRules) {
      setRules(JSON.parse(storedRules));
    }
  };

  const loadTemplates = () => {
    const storedTemplates = localStorage.getItem('notification_templates');
    if (storedTemplates) {
      setTemplates(JSON.parse(storedTemplates));
    }
  };

  const createRule = (ruleData: Partial<AutomationRule>) => {
    const newRule: AutomationRule = {
      id: crypto.randomUUID(),
      name: ruleData.name || '',
      description: ruleData.description || '',
      trigger: ruleData.trigger || 'event',
      conditions: ruleData.conditions || [],
      actions: ruleData.actions || [],
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedRules = [...rules, newRule];
    setRules(updatedRules);
    localStorage.setItem('automation_rules', JSON.stringify(updatedRules));
    setShowCreateRule(false);
    trackEvent('automation_rule_created', { ruleId: newRule.id, ruleName: newRule.name });
  };

  const updateRule = (ruleId: string, updates: Partial<AutomationRule>) => {
    const updatedRules = rules.map(rule => 
      rule.id === ruleId 
        ? { ...rule, ...updates, updatedAt: new Date() }
        : rule
    );
    setRules(updatedRules);
    localStorage.setItem('automation_rules', JSON.stringify(updatedRules));
    setSelectedRule(null);
  };

  const deleteRule = (ruleId: string) => {
    const updatedRules = rules.filter(rule => rule.id !== ruleId);
    setRules(updatedRules);
    localStorage.setItem('automation_rules', JSON.stringify(updatedRules));
    trackEvent('automation_rule_deleted', { ruleId });
  };

  const toggleRule = (ruleId: string) => {
    const updatedRules = rules.map(rule => 
      rule.id === ruleId 
        ? { ...rule, enabled: !rule.enabled, updatedAt: new Date() }
        : rule
    );
    setRules(updatedRules);
    localStorage.setItem('automation_rules', JSON.stringify(updatedRules));
  };

  const createTemplate = (templateData: Partial<NotificationTemplate>) => {
    const newTemplate: NotificationTemplate = {
      id: crypto.randomUUID(),
      name: templateData.name || '',
      type: templateData.type || 'email',
      subject: templateData.subject,
      content: templateData.content || '',
      variables: templateData.variables || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem('notification_templates', JSON.stringify(updatedTemplates));
    setShowCreateTemplate(false);
  };

  const updateTemplate = (templateId: string, updates: Partial<NotificationTemplate>) => {
    const updatedTemplates = templates.map(template => 
      template.id === templateId 
        ? { ...template, ...updates, updatedAt: new Date() }
        : template
    );
    setTemplates(updatedTemplates);
    localStorage.setItem('notification_templates', JSON.stringify(updatedTemplates));
    setSelectedTemplate(null);
  };

  const deleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(template => template.id !== templateId);
    setTemplates(updatedTemplates);
    localStorage.setItem('notification_templates', JSON.stringify(updatedTemplates));
  };

  const testNotification = async (type: string, config: any) => {
    setLoading(true);
    try {
      switch (type) {
        case 'email':
          await automation.sendEmail('test@example.com', 'test', config);
          break;
        case 'sms':
          await automation.sendSMS('+254700000000', 'test', config);
          break;
        case 'slack':
          await automation.sendSlackMessage('test', 'Test message from automation system');
          break;
        case 'teams':
          await automation.sendTeamsMessage('test', 'Test message from automation system');
          break;
      }
      trackEvent('notification_tested', { type, config });
    } catch (error) {
      console.error('Test notification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderRules = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Automation Rules</h3>
        <button
          onClick={() => setShowCreateRule(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <FiPlus className="w-4 h-4" />
          <span>Create Rule</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rules.map((rule) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">{rule.name}</h4>
              <button
                onClick={() => toggleRule(rule.id)}
                className={`p-2 rounded-lg transition-colors ${
                  rule.enabled 
                    ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {rule.enabled ? <FiToggleRight className="w-4 h-4" /> : <FiToggleLeft className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">{rule.description}</p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2">
                <FiZap className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Trigger:</span>
                <span className="text-sm text-gray-600 capitalize">{rule.trigger}</span>
              </div>

              <div className="flex items-center space-x-2">
                <FiFilter className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-700">Conditions:</span>
                <span className="text-sm text-gray-600">{rule.conditions.length}</span>
              </div>

              <div className="flex items-center space-x-2">
                <FiBell className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Actions:</span>
                <span className="text-sm text-gray-600">{rule.actions.length}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedRule(rule)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(rule.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Notification Templates</h3>
        <button
          onClick={() => setShowCreateTemplate(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <FiPlus className="w-4 h-4" />
          <span>Create Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">{template.name}</h4>
              <div className="flex items-center space-x-2">
                {template.type === 'email' && <FiMail className="w-4 h-4 text-blue-500" />}
                {template.type === 'sms' && <FiMessageSquare className="w-4 h-4 text-green-500" />}
                {template.type === 'slack' && <FiSlack className="w-4 h-4 text-purple-500" />}
                {template.type === 'teams' && <FiBell className="w-4 h-4 text-blue-600" />}
              </div>
            </div>

            {template.subject && (
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Subject:</span> {template.subject}
              </p>
            )}

            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{template.content}</p>

            {template.variables.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Variables:</p>
                <div className="flex flex-wrap gap-1">
                  {template.variables.map((variable) => (
                    <span
                      key={variable}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    >
                      {variable}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedTemplate(template)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => testNotification(template.type, { content: template.content })}
                  disabled={loading}
                  className="text-green-600 hover:text-green-700 text-sm font-medium disabled:opacity-50"
                >
                  Test
                </button>
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(template.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Integrations</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Integration */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <FiMail className="w-6 h-6 text-blue-500" />
            <h4 className="font-semibold text-gray-900">Email Integration</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
              <input
                type="text"
                defaultValue="smtp.gmail.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                defaultValue="notifications@justice.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Test Connection
            </button>
          </div>
        </motion.div>

        {/* SMS Integration */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <FiMessageSquare className="w-6 h-6 text-green-500" />
            <h4 className="font-semibold text-gray-900">SMS Integration</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="africastalking">Africa's Talking</option>
                <option value="twilio">Twilio</option>
                <option value="mpesa">M-Pesa</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
              Test Connection
            </button>
          </div>
        </motion.div>

        {/* Slack Integration */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <FiSlack className="w-6 h-6 text-purple-500" />
            <h4 className="font-semibold text-gray-900">Slack Integration</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
              <input
                type="url"
                placeholder="https://hooks.slack.com/services/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Channel</label>
              <input
                type="text"
                defaultValue="#general"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Test Connection
            </button>
          </div>
        </motion.div>

        {/* Teams Integration */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <FiBell className="w-6 h-6 text-blue-600" />
            <h4 className="font-semibold text-gray-900">Teams Integration</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
              <input
                type="url"
                placeholder="https://outlook.office.com/webhook/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Channel</label>
              <input
                type="text"
                defaultValue="General"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Test Connection
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Automation Logs</h3>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="all">All Events</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="slack">Slack</option>
              <option value="teams">Teams</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Export Logs
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  i % 3 === 0 ? 'bg-green-500' : i % 3 === 1 ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {i % 3 === 0 ? 'Email sent successfully' : 
                     i % 3 === 1 ? 'SMS delivery failed' : 'Slack message pending'}
                  </p>
                  <p className="text-xs text-gray-500">Rule: Welcome Email • User: john@example.com</p>
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
          <h2 className="text-2xl font-bold text-gray-900">Automation Manager</h2>
          <p className="text-gray-600">Create and manage automation rules, templates, and integrations</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'rules', label: 'Rules', icon: FiZap },
            { id: 'templates', label: 'Templates', icon: FiMail },
            { id: 'integrations', label: 'Integrations', icon: FiSettings },
            { id: 'logs', label: 'Logs', icon: FiClock }
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
          {view === 'rules' && renderRules()}
          {view === 'templates' && renderTemplates()}
          {view === 'integrations' && renderIntegrations()}
          {view === 'logs' && renderLogs()}
        </motion.div>
      </AnimatePresence>

      {/* Create Rule Modal */}
      {showCreateRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Automation Rule</h3>
            {/* Trigger Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Type</label>
              <select
                value={selectedRule?.trigger || 'event'}
                onChange={e => setSelectedRule(selectedRule ? { ...selectedRule, trigger: e.target.value as any } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="event">Event</option>
                <option value="schedule">Schedule</option>
                <option value="condition">Condition</option>
                <option value="webhook">Webhook</option>
                <option value="user_action">User Action</option>
              </select>
            </div>
            {/* Rule creation form would go here */}
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateRule(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => createRule({ name: 'New Rule', description: 'Rule description' })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Rule
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Template Modal */}
      {showCreateTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Notification Template</h3>
            {/* Template creation form would go here */}
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateTemplate(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => createTemplate({ name: 'New Template', type: 'email', content: 'Template content' })}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Template
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 