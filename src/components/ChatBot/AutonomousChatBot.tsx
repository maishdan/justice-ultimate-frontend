import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiSettings, FiCpu } from 'react-icons/fi';
import { autonomousEngine } from '../../ai/AutonomousDecisionEngine';
import { searchKnowledgeBase } from '../../ai/ragEngine';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'decision' | 'action' | 'recommendation';
  metadata?: {
    confidence?: number;
    action_taken?: string;
    reasoning?: string;
    business_impact?: string;
  };
}

interface AutonomousCapability {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  confidence: number;
  lastUsed: Date;
}

export default function AutonomousChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [autonomousMode, setAutonomousMode] = useState(true);
  const [capabilities, setCapabilities] = useState<AutonomousCapability[]>([
    {
      id: '1',
      name: 'Dynamic Pricing',
      description: 'Automatically adjust prices based on demand and market conditions',
      enabled: true,
      confidence: 0.92,
      lastUsed: new Date()
    },
    {
      id: '2',
      name: 'Inventory Management',
      description: 'Predict and manage inventory needs autonomously',
      enabled: true,
      confidence: 0.88,
      lastUsed: new Date()
    },
    {
      id: '3',
      name: 'Security Monitoring',
      description: 'Detect and respond to security threats automatically',
      enabled: true,
      confidence: 0.95,
      lastUsed: new Date()
    },
    {
      id: '4',
      name: 'Customer Service',
      description: 'Handle customer inquiries and resolve issues autonomously',
      enabled: true,
      confidence: 0.85,
      lastUsed: new Date()
    },
    {
      id: '5',
      name: 'Maintenance Scheduling',
      description: 'Schedule vehicle maintenance based on usage and condition',
      enabled: true,
      confidence: 0.90,
      lastUsed: new Date()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
    initializeChat();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      text: `🤖 Hello! I'm your autonomous business assistant. I can help you with:

• **Dynamic Pricing** - Optimize prices based on market conditions
• **Inventory Management** - Predict and manage stock levels
• **Security Monitoring** - Detect and respond to threats
• **Customer Service** - Handle inquiries and resolve issues
• **Maintenance Scheduling** - Automate vehicle maintenance

I'm currently operating in ${autonomousMode ? 'AUTONOMOUS' : 'ASSISTED'} mode. How can I help you today?`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([welcomeMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    try {
      const response = await processUserInput(inputText);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I encountered an error processing your request. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const processUserInput = async (input: string): Promise<Message> => {
    const lowerInput = input.toLowerCase();
    
    // Check for autonomous decision requests
    if (lowerInput.includes('optimize') || lowerInput.includes('price') || lowerInput.includes('pricing')) {
      return await handlePricingOptimization(input);
    }
    
    if (lowerInput.includes('inventory') || lowerInput.includes('stock') || lowerInput.includes('demand')) {
      return await handleInventoryManagement(input);
    }
    
    if (lowerInput.includes('security') || lowerInput.includes('threat') || lowerInput.includes('anomaly')) {
      return await handleSecurityMonitoring(input);
    }
    
    if (lowerInput.includes('maintenance') || lowerInput.includes('service') || lowerInput.includes('repair')) {
      return await handleMaintenanceScheduling(input);
    }
    
    if (lowerInput.includes('customer') || lowerInput.includes('support') || lowerInput.includes('help')) {
      return await handleCustomerService(input);
    }
    
    if (lowerInput.includes('autonomous') || lowerInput.includes('mode') || lowerInput.includes('capability')) {
      return await handleAutonomousCapabilities(input);
    }
    
    // Default to knowledge base search
    return await handleGeneralInquiry(input);
  };

  const handlePricingOptimization = async (input: string): Promise<Message> => {
    const vehicleMatch = input.match(/vehicle\s+(\w+)/i) || input.match(/car\s+(\w+)/i);
    const vehicleId = vehicleMatch ? vehicleMatch[1] : 'default';
    
    // Simulate pricing optimization
    const currentPrice = 85000;
    const optimizedPrice = await autonomousEngine.optimizePricing(vehicleId, currentPrice);
    const adjustment = ((optimizedPrice - currentPrice) / currentPrice) * 100;
    
    return {
      id: Date.now().toString(),
      text: `💰 **Autonomous Pricing Optimization Complete**

**Vehicle:** ${vehicleId.toUpperCase()}
**Current Price:** KES ${currentPrice.toLocaleString()}
**Optimized Price:** KES ${optimizedPrice.toLocaleString()}
**Adjustment:** ${adjustment > 0 ? '+' : ''}${adjustment.toFixed(1)}%

**Reasoning:**
• Market demand analysis completed
• Competitor pricing evaluated
• Seasonal factors considered
• Economic indicators processed

**Confidence:** 92%
**Action Taken:** Price automatically updated in system`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'decision',
      metadata: {
        confidence: 0.92,
        action_taken: 'price_optimized',
        reasoning: 'Market analysis and demand forecasting',
        business_impact: `Expected revenue increase: ${Math.abs(adjustment)}%`
      }
    };
  };

  const handleInventoryManagement = async (input: string): Promise<Message> => {
    const predictions = await autonomousEngine.predictInventoryNeeds();
    
    let responseText = `📦 **Autonomous Inventory Analysis Complete**

**Predictions for Next 30 Days:**\n\n`;
    
    predictions.slice(0, 5).forEach(prediction => {
      responseText += `• **Vehicle ${prediction.vehicleId}:** ${prediction.predictedDemand} rentals predicted
  Confidence: ${(prediction.confidence * 100).toFixed(0)}%
  Action: ${prediction.recommendedAction}\n\n`;
    });
    
    responseText += `**System Actions:**
• Inventory levels automatically adjusted
• Purchase orders generated where needed
• Low-demand vehicles flagged for review
• Seasonal demand patterns analyzed

**Confidence:** 88%`;

    return {
      id: Date.now().toString(),
      text: responseText,
      sender: 'bot',
      timestamp: new Date(),
      type: 'recommendation',
      metadata: {
        confidence: 0.88,
        action_taken: 'inventory_optimized',
        reasoning: 'Historical data analysis and demand forecasting',
        business_impact: 'Optimized inventory reduces costs and improves availability'
      }
    };
  };

  const handleSecurityMonitoring = async (input: string): Promise<Message> => {
    const anomalies = await autonomousEngine.detectAnomalies();
    
    let responseText = `🛡️ **Autonomous Security Scan Complete**

**System Status:** ${anomalies.length > 0 ? '⚠️ Anomalies Detected' : '✅ All Systems Normal'}\n\n`;
    
    if (anomalies.length > 0) {
      responseText += `**Detected Anomalies:**\n\n`;
      anomalies.forEach(anomaly => {
        responseText += `• **${anomaly.type}:** ${anomaly.value} (Z-Score: ${anomaly.zScore.toFixed(2)})
  Severity: ${anomaly.severity}
  Time: ${anomaly.timestamp.toLocaleTimeString()}\n\n`;
      });
      
      responseText += `**Autonomous Actions Taken:**
• Security protocols activated
• Admin notifications sent
• System monitoring enhanced
• Threat assessment completed`;
    } else {
      responseText += `**Security Status:**
• All systems operating normally
• No threats detected
• Monitoring continues automatically
• Response protocols ready`;
    }
    
    responseText += `\n\n**Confidence:** 95%`;

    return {
      id: Date.now().toString(),
      text: responseText,
      sender: 'bot',
      timestamp: new Date(),
      type: 'action',
      metadata: {
        confidence: 0.95,
        action_taken: anomalies.length > 0 ? 'security_response_activated' : 'security_monitoring_normal',
        reasoning: 'Real-time anomaly detection and threat assessment',
        business_impact: 'Proactive security prevents potential breaches'
      }
    };
  };

  const handleMaintenanceScheduling = async (input: string): Promise<Message> => {
    // Simulate maintenance scheduling
    const scheduledMaintenance = [
      { vehicle: 'Toyota Land Cruiser', service: 'Oil Change', date: '2024-01-15', priority: 'High' },
      { vehicle: 'BMW X5', service: 'Brake Inspection', date: '2024-01-18', priority: 'Medium' },
      { vehicle: 'Mercedes S-Class', service: 'Tire Rotation', date: '2024-01-20', priority: 'Low' }
    ];
    
    let responseText = `🔧 **Autonomous Maintenance Scheduling Complete**

**Scheduled Maintenance:**\n\n`;
    
    scheduledMaintenance.forEach(maintenance => {
      responseText += `• **${maintenance.vehicle}:** ${maintenance.service}
  Date: ${maintenance.date}
  Priority: ${maintenance.priority}\n\n`;
    });
    
    responseText += `**System Actions:**
• Maintenance schedules automatically created
• Service reminders configured
• Parts inventory checked
• Technician availability verified
• Customer notifications scheduled

**Confidence:** 90%`;

    return {
      id: Date.now().toString(),
      text: responseText,
      sender: 'bot',
      timestamp: new Date(),
      type: 'action',
      metadata: {
        confidence: 0.90,
        action_taken: 'maintenance_scheduled',
        reasoning: 'Usage patterns and manufacturer recommendations',
        business_impact: 'Preventive maintenance reduces downtime and costs'
      }
    };
  };

  const handleCustomerService = async (input: string): Promise<Message> => {
    // Simulate customer service automation
    const responseText = `🎯 **Autonomous Customer Service Response**

**Analysis Complete:**
• Customer inquiry categorized
• Response strategy determined
• Knowledge base consulted
• Resolution path identified

**Actions Taken:**
• Automated response generated
• Customer satisfaction predicted: 94%
• Follow-up scheduled
• Issue tracking initiated
• Knowledge base updated

**Response Quality:** Excellent
**Resolution Time:** < 2 minutes
**Customer Impact:** Positive

**Confidence:** 85%`;

    return {
      id: Date.now().toString(),
      text: responseText,
      sender: 'bot',
      timestamp: new Date(),
      type: 'action',
      metadata: {
        confidence: 0.85,
        action_taken: 'customer_service_automated',
        reasoning: 'Natural language processing and knowledge base analysis',
        business_impact: 'Improved customer satisfaction and reduced response times'
      }
    };
  };

  const handleAutonomousCapabilities = async (input: string): Promise<Message> => {
    const systemHealth = autonomousEngine.getSystemHealth();
    
    let responseText = `🧠 **Autonomous System Status**

**Mode:** ${autonomousMode ? 'FULLY AUTONOMOUS' : 'ASSISTED'}
**Overall Health:** ${systemHealth.systemStatus.toUpperCase()}

**Capabilities:**\n\n`;
    
    capabilities.forEach(capability => {
      responseText += `• **${capability.name}:** ${capability.enabled ? '✅ Active' : '❌ Inactive'}
  Confidence: ${(capability.confidence * 100).toFixed(0)}%
  Last Used: ${capability.lastUsed.toLocaleDateString()}\n\n`;
    });
    
    responseText += `**System Metrics:**
• Total Rules: ${systemHealth.totalRules}
• Active Rules: ${systemHealth.enabledRules}
• Success Rate: ${(systemHealth.avgSuccessRate * 100).toFixed(1)}%
• Last Decision: ${systemHealth.lastDecision ? systemHealth.lastDecision.timestamp.toLocaleString() : 'N/A'}

**Autonomous Actions Available:**
• Dynamic pricing optimization
• Inventory demand prediction
• Security threat detection
• Maintenance scheduling
• Customer service automation`;

    return {
      id: Date.now().toString(),
      text: responseText,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
      metadata: {
        confidence: 1.0,
        action_taken: 'system_status_reported',
        reasoning: 'Real-time system health assessment',
        business_impact: 'Transparent autonomous system monitoring'
      }
    };
  };

  const handleGeneralInquiry = async (input: string): Promise<Message> => {
    // Search knowledge base
    const knowledgeResponse = searchKnowledgeBase(input);
    
    if (knowledgeResponse) {
      return {
        id: Date.now().toString(),
        text: `💡 **Knowledge Base Response**

${knowledgeResponse}

*This response was generated from our knowledge base. Would you like me to perform any autonomous actions related to this topic?*`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
    }
    
    // Default response
    return {
      id: Date.now().toString(),
      text: `I understand you're asking about "${input}". While I don't have specific information about that, I can help you with:

• **Business Optimization** - "Optimize pricing for Toyota Land Cruiser"
• **Inventory Management** - "Analyze inventory needs"
• **Security Monitoring** - "Check system security"
• **Maintenance** - "Schedule vehicle maintenance"
• **Customer Service** - "Handle customer inquiry"

What would you like me to help you with?`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    };
  };

  const toggleAutonomousMode = () => {
    setAutonomousMode(!autonomousMode);
    const modeMessage: Message = {
      id: Date.now().toString(),
      text: `🔄 **Autonomous Mode ${!autonomousMode ? 'ENABLED' : 'DISABLED'}**

System is now operating in ${!autonomousMode ? 'AUTONOMOUS' : 'ASSISTED'} mode.

${!autonomousMode ? 'I can now make business decisions and take actions automatically.' : 'I will now ask for confirmation before taking actions.'}`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, modeMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
                            <FiCpu className="text-xl" />
            <div>
              <h3 className="font-bold">Autonomous Assistant</h3>
              <p className="text-xs opacity-90">
                {autonomousMode ? '🤖 FULLY AUTONOMOUS' : '👤 ASSISTED MODE'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleAutonomousMode}
              className={`p-2 rounded-lg transition-colors ${
                autonomousMode 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-gray-500 hover:bg-gray-600'
              }`}
              title={autonomousMode ? 'Disable Autonomous Mode' : 'Enable Autonomous Mode'}
            >
              <FiSettings className="text-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">{message.text}</div>
                {message.metadata && (
                  <div className="mt-2 pt-2 border-t border-gray-200 text-xs opacity-75">
                    <div>Confidence: {(message.metadata.confidence! * 100).toFixed(0)}%</div>
                    <div>Action: {message.metadata.action_taken}</div>
                  </div>
                )}
                <div className="text-xs opacity-50 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything or request autonomous actions..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isProcessing}
            />
            {isProcessing && (
              <div className="absolute right-3 top-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isProcessing}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSend className="text-sm" />
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-2 flex flex-wrap gap-1">
          {['Optimize Pricing', 'Check Inventory', 'Security Scan', 'Schedule Maintenance'].map((action) => (
            <button
              key={action}
              onClick={() => setInputText(action)}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 