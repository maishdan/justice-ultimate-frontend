// Automation System for Justice Ultimate Automobiles
// Handles email/SMS notifications, Slack/Teams integration, and advanced analytics

export interface NotificationConfig {
  email: {
    enabled: boolean;
    smtp: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
    };
    templates: {
      welcome: string;
      booking: string;
      reminder: string;
      alert: string;
    };
  };
  sms: {
    enabled: boolean;
    provider: 'twilio' | 'africastalking' | 'mpesa';
    credentials: {
      accountSid?: string;
      authToken?: string;
      apiKey?: string;
      username?: string;
    };
    templates: {
      welcome: string;
      booking: string;
      reminder: string;
      alert: string;
    };
  };
  slack: {
    enabled: boolean;
    webhookUrl: string;
    channels: {
      sales: string;
      support: string;
      alerts: string;
      analytics: string;
    };
  };
  teams: {
    enabled: boolean;
    webhookUrl: string;
    channels: {
      sales: string;
      support: string;
      alerts: string;
      analytics: string;
    };
  };
}

export interface AutomationRule {
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

export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'button_click' | 'form_submit' | 'purchase' | 'booking' | 'support_ticket';
  userId?: string;
  sessionId: string;
  timestamp: Date;
  data: Record<string, any>;
  metadata: {
    userAgent: string;
    ip: string;
    referrer?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  };
}

export class AutomationEngine {
  private config: NotificationConfig;
  private rules: AutomationRule[] = [];
  private analyticsEvents: AnalyticsEvent[] = [];

  constructor(config: NotificationConfig) {
    this.config = config;
    this.loadRules();
  }

  // Email Notifications
  async sendEmail(to: string, template: string, data: Record<string, any>): Promise<boolean> {
    if (!this.config.email.enabled) return false;

    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransporter(this.config.email.smtp);

      const html = this.renderEmailTemplate(template, data);
      const subject = this.getEmailSubject(template, data);

      await transporter.sendMail({
        from: this.config.email.smtp.auth.user,
        to,
        subject,
        html,
      });

      this.logAnalyticsEvent('email_sent', { to, template, subject });
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  // SMS Notifications
  async sendSMS(to: string, template: string, data: Record<string, any>): Promise<boolean> {
    if (!this.config.sms.enabled) return false;

    try {
      const message = this.renderSMSTemplate(template, data);
      
      switch (this.config.sms.provider) {
        case 'twilio':
          return await this.sendTwilioSMS(to, message);
        case 'africastalking':
          return await this.sendAfricasTalkingSMS(to, message);
        case 'mpesa':
          return await this.sendMpesaSMS(to, message);
        default:
          throw new Error(`Unsupported SMS provider: ${this.config.sms.provider}`);
      }
    } catch (error) {
      console.error('SMS sending failed:', error);
      return false;
    }
  }

  // Slack Integration
  async sendSlackMessage(channel: string, message: string, attachments?: any[]): Promise<boolean> {
    if (!this.config.slack.enabled) return false;

    try {
      const payload = {
        channel,
        text: message,
        attachments,
        username: 'Justice AI',
        icon_emoji: ':car:',
      };

      const response = await fetch(this.config.slack.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        this.logAnalyticsEvent('slack_message_sent', { channel, message });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Slack message failed:', error);
      return false;
    }
  }

  // Teams Integration
  async sendTeamsMessage(channel: string, message: string, cards?: any[]): Promise<boolean> {
    if (!this.config.teams.enabled) return false;

    try {
      const payload = {
        type: 'message',
        attachments: cards || [{
          contentType: 'application/vnd.microsoft.card.adaptive',
          content: {
            type: 'AdaptiveCard',
            version: '1.0',
            body: [{ type: 'TextBlock', text: message }],
          },
        }],
      };

      const response = await fetch(this.config.teams.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        this.logAnalyticsEvent('teams_message_sent', { channel, message });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Teams message failed:', error);
      return false;
    }
  }

  // Automation Rules Engine
  async processEvent(eventType: string, data: Record<string, any>): Promise<void> {
    // Process event, schedule, webhook, or user_action triggers
    for (const rule of this.rules) {
      if (!rule.enabled) continue;
      if (
        (rule.trigger === 'event' && eventType === data.type) ||
        (rule.trigger === 'schedule' && eventType === 'schedule') ||
        (rule.trigger === 'webhook' && eventType === 'webhook') ||
        (rule.trigger === 'user_action' && eventType === 'user_action')
      ) {
        if (this.evaluateConditions(rule.conditions, data)) {
          await this.executeActions(rule.actions, data);
        }
      }
    }
  }

  // Analytics Tracking
  logAnalyticsEvent(type: string, data: Record<string, any>): void {
    const event: AnalyticsEvent = {
      id: crypto.randomUUID(),
      type: type as any,
      userId: data.userId,
      sessionId: data.sessionId || this.getSessionId(),
      timestamp: new Date(),
      data,
      metadata: {
        userAgent: navigator.userAgent,
        ip: data.ip || 'unknown',
        referrer: document.referrer,
        utm_source: this.getUrlParameter('utm_source'),
        utm_medium: this.getUrlParameter('utm_medium'),
        utm_campaign: this.getUrlParameter('utm_campaign'),
      },
    };

    this.analyticsEvents.push(event);
    this.persistAnalyticsEvent(event);
  }

  // Advanced Analytics
  getAnalyticsReport(startDate: Date, endDate: Date, filters?: Record<string, any>) {
    const events = this.analyticsEvents.filter(event => 
      event.timestamp >= startDate && 
      event.timestamp <= endDate &&
      this.matchesFilters(event, filters)
    );

    return {
      totalEvents: events.length,
      eventsByType: this.groupBy(events, 'type'),
      eventsByUser: this.groupBy(events, 'userId'),
      conversionFunnel: this.calculateConversionFunnel(events),
      userJourney: this.analyzeUserJourney(events),
      topPages: this.getTopPages(events),
      topActions: this.getTopActions(events),
      revenueMetrics: this.calculateRevenueMetrics(events),
      customerSegments: this.segmentCustomers(events),
    };
  }

  // Real-time Dashboard Data
  getRealTimeMetrics() {
    const now = new Date();
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentEvents = this.analyticsEvents.filter(event => 
      event.timestamp >= last24Hours
    );

    return {
      activeUsers: this.getActiveUsers(recentEvents),
      pageViews: this.getPageViews(recentEvents),
      conversions: this.getConversions(recentEvents),
      revenue: this.getRevenue(recentEvents),
      alerts: this.getSystemAlerts(),
      performance: this.getSystemPerformance(),
    };
  }

  /**
   * Detect anomalies in a numeric array using z-score method
   * Returns indices and values of outliers
   */
  public detectAnomalies(data: number[], threshold: number = 2.5): { index: number, value: number, z: number }[] {
    if (!data.length) return [];
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const std = Math.sqrt(data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length);
    return data
      .map((value, index) => ({ index, value, z: std ? (value - mean) / std : 0 }))
      .filter(point => Math.abs(point.z) > threshold);
  }

  /**
   * Get anomalies for a given metric in analytics events
   */
  public getAnomalies(events: AnalyticsEvent[], metric: 'revenue' | 'page_view' | 'conversions' = 'revenue') {
    let values: number[] = [];
    if (metric === 'revenue') {
      values = events.filter(e => e.type === 'purchase').map(e => e.data.amount || 0);
    } else if (metric === 'page_view') {
      // Group by day/hour and count
      const grouped: Record<string, number> = {};
      events.filter(e => e.type === 'page_view').forEach(e => {
        const key = e.timestamp.toISOString().slice(0, 10);
        grouped[key] = (grouped[key] || 0) + 1;
      });
      values = Object.values(grouped);
    } else if (metric === 'conversions') {
      // Group by day/hour and count
      const grouped: Record<string, number> = {};
      events.filter(e => e.type === 'purchase' || e.type === 'booking').forEach(e => {
        const key = e.timestamp.toISOString().slice(0, 10);
        grouped[key] = (grouped[key] || 0) + 1;
      });
      values = Object.values(grouped);
    }
    return this.detectAnomalies(values);
  }

  // Private helper methods
  private async sendTwilioSMS(to: string, message: string): Promise<boolean> {
    const { accountSid, authToken } = this.config.sms.credentials;
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: to,
        From: '+1234567890', // Your Twilio number
        Body: message,
      }),
    });
    return response.ok;
  }

  private async sendAfricasTalkingSMS(to: string, message: string): Promise<boolean> {
    const { apiKey, username } = this.config.sms.credentials;
    const payload = JSON.stringify({ username, to, message, from: 'Justice' });
    const response = await fetch('https://api.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: {
        'apiKey': apiKey!,
        'Content-Type': 'application/json',
      },
      body: payload,
    });
    return response.ok;
  }

  private async sendMpesaSMS(to: string, message: string): Promise<boolean> {
    // M-Pesa SMS integration (custom implementation)
    console.log(`Sending M-Pesa SMS to ${to}: ${message}`);
    return true;
  }

  private renderEmailTemplate(template: string, data: Record<string, any>): string {
    let html = this.config.email.templates[template as keyof typeof this.config.email.templates] || '';
    
    // Replace placeholders with actual data
    Object.entries(data).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    return html;
  }

  private renderSMSTemplate(template: string, data: Record<string, any>): string {
    let message = this.config.sms.templates[template as keyof typeof this.config.sms.templates] || '';
    
    Object.entries(data).forEach(([key, value]) => {
      message = message.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    return message;
  }

  private getEmailSubject(template: string, data: Record<string, any>): string {
    const subjects: Record<string, string> = {
      welcome: 'Welcome to Justice Ultimate Automobiles!',
      booking: 'Your Test Drive Booking Confirmation',
      reminder: 'Reminder: Your Upcoming Appointment',
      alert: 'Important Alert from Justice Ultimate Automobiles',
    };
    return subjects[template] || 'Message from Justice Ultimate Automobiles';
  }

  private evaluateConditions(conditions: any[], data: Record<string, any>): boolean {
    return conditions.every(condition => {
      const value = data[condition.field];
      switch (condition.operator) {
        case 'equals': return value === condition.value;
        case 'not_equals': return value !== condition.value;
        case 'contains': return String(value).includes(condition.value);
        case 'greater_than': return value > condition.value;
        case 'less_than': return value < condition.value;
        default: return false;
      }
    });
  }

  private async executeActions(actions: any[], data: Record<string, any>): Promise<void> {
    for (const action of actions) {
      switch (action.type) {
        case 'email':
          await this.sendEmail(data.email, action.config.template, data);
          break;
        case 'sms':
          await this.sendSMS(data.phone, action.config.template, data);
          break;
        case 'slack':
          await this.sendSlackMessage(action.config.channel, action.config.message, action.config.attachments);
          break;
        case 'teams':
          await this.sendTeamsMessage(action.config.channel, action.config.message, action.config.cards);
          break;
        case 'webhook':
          await this.callWebhook(action.config.url, data);
          break;
        case 'database':
          await this.updateDatabase(action.config.table, action.config.operation, data);
          break;
      }
    }
  }

  private async callWebhook(url: string, data: Record<string, any>): Promise<void> {
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Webhook call failed:', error);
    }
  }

  private async updateDatabase(table: string, operation: string, data: Record<string, any>): Promise<void> {
    // Database update logic here
    console.log(`Database ${operation} on ${table}:`, data);
  }

  private loadRules(): void {
    // Load automation rules from storage/database
    const storedRules = localStorage.getItem('automation_rules');
    if (storedRules) {
      this.rules = JSON.parse(storedRules);
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  private getUrlParameter(name: string): string | undefined {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name) || undefined;
  }

  private persistAnalyticsEvent(event: AnalyticsEvent): void {
    // Store analytics event in localStorage or send to server
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    events.push(event);
    localStorage.setItem('analytics_events', JSON.stringify(events.slice(-1000))); // Keep last 1000 events
  }

  private groupBy(array: any[], key: string): Record<string, any[]> {
    return array.reduce((groups, item) => {
      const group = item[key] || 'unknown';
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  }

  private calculateConversionFunnel(events: AnalyticsEvent[]): any {
    // Calculate conversion funnel metrics
    const funnel = {
      pageViews: events.filter(e => e.type === 'page_view').length,
      formSubmits: events.filter(e => e.type === 'form_submit').length,
      bookings: events.filter(e => e.type === 'booking').length,
      purchases: events.filter(e => e.type === 'purchase').length,
    };

    return {
      ...funnel,
      conversionRates: {
        formToPage: funnel.formSubmits / funnel.pageViews,
        bookingToForm: funnel.bookings / funnel.formSubmits,
        purchaseToBooking: funnel.purchases / funnel.bookings,
      },
    };
  }

  private analyzeUserJourney(events: AnalyticsEvent[]): any {
    // Analyze user journey patterns
    const userJourneys = this.groupBy(events, 'userId');
    
    return Object.entries(userJourneys).map(([userId, userEvents]) => ({
      userId,
      journey: userEvents
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        .map(e => ({ type: e.type, timestamp: e.timestamp, data: e.data })),
    }));
  }

  private getTopPages(events: AnalyticsEvent[]): any[] {
    const pageViews = events.filter(e => e.type === 'page_view');
    const pageCounts = this.groupBy(pageViews, 'data.page');
    
    return Object.entries(pageCounts)
      .map(([page, views]) => ({ page, views: views.length }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }

  private getTopActions(events: AnalyticsEvent[]): any[] {
    const actionCounts = this.groupBy(events, 'type');
    
    return Object.entries(actionCounts)
      .map(([action, events]) => ({ action, count: events.length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private calculateRevenueMetrics(events: AnalyticsEvent[]): any {
    const purchases = events.filter(e => e.type === 'purchase');
    const totalRevenue = purchases.reduce((sum, e) => sum + (e.data.amount || 0), 0);
    
    return {
      totalRevenue,
      averageOrderValue: totalRevenue / purchases.length || 0,
      purchaseCount: purchases.length,
      revenueByProduct: this.groupBy(purchases, 'data.product'),
    };
  }

  private segmentCustomers(events: AnalyticsEvent[]): any {
    // Customer segmentation logic
    const userEvents = this.groupBy(events, 'userId');
    
    return Object.entries(userEvents).map(([userId, userEvents]) => {
      const totalSpent = userEvents
        .filter(e => e.type === 'purchase')
        .reduce((sum, e) => sum + (e.data.amount || 0), 0);
      
      const visitCount = userEvents.filter(e => e.type === 'page_view').length;
      
      return {
        userId,
        segment: this.determineSegment(totalSpent, visitCount),
        totalSpent,
        visitCount,
        lastVisit: Math.max(...userEvents.map(e => e.timestamp.getTime())),
      };
    });
  }

  private determineSegment(totalSpent: number, visitCount: number): string {
    if (totalSpent > 1000000) return 'VIP';
    if (totalSpent > 500000) return 'Premium';
    if (totalSpent > 100000) return 'Regular';
    if (visitCount > 10) return 'Engaged';
    return 'New';
  }

  private getActiveUsers(events: AnalyticsEvent[]): number {
    const lastHour = new Date(Date.now() - 60 * 60 * 1000);
    const recentEvents = events.filter(e => e.timestamp >= lastHour);
    return new Set(recentEvents.map(e => e.userId)).size;
  }

  private getPageViews(events: AnalyticsEvent[]): number {
    return events.filter(e => e.type === 'page_view').length;
  }

  private getConversions(events: AnalyticsEvent[]): number {
    return events.filter(e => e.type === 'purchase' || e.type === 'booking').length;
  }

  private getRevenue(events: AnalyticsEvent[]): number {
    return events
      .filter(e => e.type === 'purchase')
      .reduce((sum, e) => sum + (e.data.amount || 0), 0);
  }

  private getSystemAlerts(): any[] {
    // System alerts logic
    return [];
  }

  private getSystemPerformance(): any {
    // System performance metrics
    return {
      responseTime: Math.random() * 100 + 50,
      uptime: 99.9,
      memoryUsage: Math.random() * 20 + 60,
      cpuUsage: Math.random() * 30 + 40,
    };
  }

  private matchesFilters(event: AnalyticsEvent, filters?: Record<string, any>): boolean {
    if (!filters) return true;
    
    return Object.entries(filters).every(([key, value]) => {
      if (key.includes('.')) {
        const [obj, prop] = key.split('.');
        if (typeof event[obj as keyof AnalyticsEvent] === 'object' && event[obj as keyof AnalyticsEvent] !== null) {
          return (event[obj as keyof AnalyticsEvent] as Record<string, any>)[prop] === value;
        }
      }
      return event[key as keyof AnalyticsEvent] === value;
    });
  }
}

// Default configuration
export const defaultConfig: NotificationConfig = {
  email: {
    enabled: true,
    smtp: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: import.meta.env.VITE_EMAIL_USER || '',
        pass: import.meta.env.VITE_EMAIL_PASS || '',
      },
    },
    templates: {
      welcome: `
        <h2>Welcome to Justice Ultimate Automobiles!</h2>
        <p>Dear {{name}},</p>
        <p>Thank you for joining our community. We're excited to help you find your perfect vehicle.</p>
        <p>Best regards,<br>The Justice Team</p>
      `,
      booking: `
        <h2>Test Drive Booking Confirmation</h2>
        <p>Dear {{name}},</p>
        <p>Your test drive for {{carModel}} has been confirmed for {{date}} at {{time}}.</p>
        <p>Location: {{location}}</p>
        <p>Best regards,<br>The Justice Team</p>
      `,
      reminder: `
        <h2>Appointment Reminder</h2>
        <p>Dear {{name}},</p>
        <p>This is a friendly reminder about your upcoming appointment on {{date}}.</p>
        <p>Best regards,<br>The Justice Team</p>
      `,
      alert: `
        <h2>Important Alert</h2>
        <p>{{message}}</p>
        <p>Best regards,<br>The Justice Team</p>
      `,
    },
  },
  sms: {
    enabled: true,
    provider: 'africastalking',
    credentials: {
      apiKey: import.meta.env.VITE_AFRICASTALKING_API_KEY || '',
      username: import.meta.env.VITE_AFRICASTALKING_USERNAME || '',
    },
    templates: {
      welcome: 'Welcome to Justice Ultimate Automobiles! We\'re excited to help you find your perfect vehicle.',
      booking: 'Your test drive for {{carModel}} is confirmed for {{date}} at {{time}}. Location: {{location}}',
      reminder: 'Reminder: Your appointment is scheduled for {{date}}. We look forward to seeing you!',
      alert: 'Alert: {{message}}',
    },
  },
  slack: {
    enabled: true,
    webhookUrl: import.meta.env.VITE_SLACK_WEBHOOK_URL || '',
    channels: {
      sales: '#sales',
      support: '#support',
      alerts: '#alerts',
      analytics: '#analytics',
    },
  },
  teams: {
    enabled: true,
    webhookUrl: import.meta.env.VITE_TEAMS_WEBHOOK_URL || '',
    channels: {
      sales: 'Sales',
      support: 'Support',
      alerts: 'Alerts',
      analytics: 'Analytics',
    },
  },
};

// Create global automation instance
export const automation = new AutomationEngine(defaultConfig);

// Export utility functions
export const sendWelcomeEmail = (email: string, name: string) => 
  automation.sendEmail(email, 'welcome', { name, email });

export const sendBookingConfirmation = (email: string, phone: string, bookingData: any) => {
  automation.sendEmail(email, 'booking', bookingData);
  automation.sendSMS(phone, 'booking', bookingData);
};

export const sendAppointmentReminder = (email: string, phone: string, appointmentData: any) => {
  automation.sendEmail(email, 'reminder', appointmentData);
  automation.sendSMS(phone, 'reminder', appointmentData);
};

export const sendSystemAlert = (message: string, channel: 'slack' | 'teams' = 'slack') => {
  if (channel === 'slack') {
    automation.sendSlackMessage('alerts', message);
  } else {
    automation.sendTeamsMessage('alerts', message);
  }
};

export const trackEvent = (type: string, data: Record<string, any>) => {
  automation.logAnalyticsEvent(type, data);
};

export const getAnalytics = (startDate: Date, endDate: Date, filters?: Record<string, any>) => {
  return automation.getAnalyticsReport(startDate, endDate, filters);
};

export const getRealTimeData = () => {
  return automation.getRealTimeMetrics();
}; 

// Export getAnomalies for use in analytics panels
export const getAnomalies = (events: AnalyticsEvent[], metric: 'revenue' | 'page_view' | 'conversions' = 'revenue') =>
  automation.getAnomalies(events, metric); 

export async function fetchSystemMetrics(token: string) {
  let url = '/api/system-metrics';
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    url = 'https://backend-jua.onrender.com/api/system-metrics';
  }
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch system metrics');
  return res.json();
} 