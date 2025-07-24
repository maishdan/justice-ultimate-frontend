import { autonomousEngine } from '../ai/AutonomousDecisionEngine';
import { supabase } from './supabaseClient';
import { automation } from './automation';

export interface AutonomousEvent {
  id: string;
  type: 'user_action' | 'system_event' | 'business_rule' | 'anomaly' | 'scheduled';
  source: string;
  data: Record<string, any>;
  timestamp: Date;
  processed: boolean;
  result?: any;
}

export interface AutonomousTrigger {
  id: string;
  name: string;
  eventType: string;
  conditions: Record<string, any>;
  actions: string[];
  enabled: boolean;
  priority: number;
}

export class AutonomousIntegration {
  private triggers: AutonomousTrigger[] = [];
  private eventQueue: AutonomousEvent[] = [];
  private isProcessing = false;

  constructor() {
    this.initializeTriggers();
    this.startEventProcessing();
  }

  private initializeTriggers() {
    this.triggers = [
      {
        id: '1',
        name: 'High Demand Pricing',
        eventType: 'rental_request',
        conditions: {
          demand_threshold: 80,
          inventory_threshold: 30
        },
        actions: ['optimize_pricing', 'send_notification'],
        enabled: true,
        priority: 1
      },
      {
        id: '2',
        name: 'Security Threat Response',
        eventType: 'security_event',
        conditions: {
          threat_level: 'high',
          failed_attempts: 5
        },
        actions: ['security_response', 'admin_alert'],
        enabled: true,
        priority: 1
      },
      {
        id: '3',
        name: 'Maintenance Scheduling',
        eventType: 'vehicle_usage',
        conditions: {
          mileage_threshold: 10000,
          days_since_maintenance: 90
        },
        actions: ['schedule_maintenance', 'update_vehicle_status'],
        enabled: true,
        priority: 2
      },
      {
        id: '4',
        name: 'Inventory Replenishment',
        eventType: 'inventory_update',
        conditions: {
          stock_level: 20,
          demand_trend: 'increasing'
        },
        actions: ['predict_demand', 'generate_purchase_order'],
        enabled: true,
        priority: 2
      },
      {
        id: '5',
        name: 'Customer Service Automation',
        eventType: 'customer_inquiry',
        conditions: {
          inquiry_type: 'general',
          response_time: 300
        },
        actions: ['auto_response', 'escalate_if_needed'],
        enabled: true,
        priority: 3
      }
    ];
  }

  private startEventProcessing() {
    setInterval(() => {
      this.processEventQueue();
    }, 5000); // Process events every 5 seconds
  }

  public async triggerEvent(eventType: string, source: string, data: Record<string, any>): Promise<void> {
    const event: AutonomousEvent = {
      id: crypto.randomUUID(),
      type: 'user_action',
      source,
      data,
      timestamp: new Date(),
      processed: false
    };

    this.eventQueue.push(event);
    console.log(`🤖 Autonomous Integration: Event triggered - ${eventType} from ${source}`);
  }

  private async processEventQueue(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) return;

    this.isProcessing = true;
    const event = this.eventQueue.shift();

    if (event) {
      try {
        await this.processEvent(event);
      } catch (error) {
        if (error instanceof Error) {
          // handle error as Error
          console.error(error.message);
        } else {
          // handle error as unknown
          console.error(String(error));
        }
      }
    }

    this.isProcessing = false;
  }

  private async processEvent(event: AutonomousEvent): Promise<void> {
    console.log(`🤖 Processing event: ${event.type} from ${event.source}`);

    // Find applicable triggers
    const applicableTriggers = this.triggers
      .filter(trigger => trigger.enabled && this.matchesEventType(trigger, event))
      .sort((a, b) => b.priority - a.priority);

    for (const trigger of applicableTriggers) {
      if (this.evaluateConditions(trigger.conditions, event.data)) {
        await this.executeActions(trigger.actions, event);
        console.log(`🤖 Trigger executed: ${trigger.name}`);
      }
    }

    // Process with autonomous engine
    await autonomousEngine.processBusinessEvent(event.type, event.data);

    event.processed = true;
    event.result = { triggers_executed: applicableTriggers.length };

    // Log event processing
    await this.logEventProcessing(event);
  }

  private matchesEventType(trigger: AutonomousTrigger, event: AutonomousEvent): boolean {
    return trigger.eventType === event.type || trigger.eventType === 'any';
  }

  private evaluateConditions(conditions: Record<string, any>, data: Record<string, any>): boolean {
    for (const [key, value] of Object.entries(conditions)) {
      const dataValue = data[key];
      
      if (typeof value === 'number') {
        if (dataValue < value) return false;
      } else if (typeof value === 'string') {
        if (dataValue !== value) return false;
      } else if (Array.isArray(value)) {
        if (!value.includes(dataValue)) return false;
      }
    }
    
    return true;
  }

  private async executeActions(actions: string[], event: AutonomousEvent): Promise<void> {
    for (const action of actions) {
      try {
        switch (action) {
          case 'optimize_pricing':
            await this.executePricingOptimization(event);
            break;
          case 'send_notification':
            await this.sendNotification(event);
            break;
          case 'security_response':
            await this.executeSecurityResponse(event);
            break;
          case 'admin_alert':
            await this.sendAdminAlert(event);
            break;
          case 'schedule_maintenance':
            await this.scheduleMaintenance(event);
            break;
          case 'update_vehicle_status':
            await this.updateVehicleStatus(event);
            break;
          case 'predict_demand':
            await this.predictDemand(event);
            break;
          case 'generate_purchase_order':
            await this.generatePurchaseOrder(event);
            break;
          case 'auto_response':
            await this.sendAutoResponse(event);
            break;
          case 'escalate_if_needed':
            await this.escalateIfNeeded(event);
            break;
          default:
            console.warn(`Unknown action: ${action}`);
        }
      } catch (error) {
        if (error instanceof Error) {
          // handle error as Error
          console.error(error.message);
        } else {
          // handle error as unknown
          console.error(String(error));
        }
      }
    }
  }

  private async executePricingOptimization(event: AutonomousEvent): Promise<void> {
    const { vehicle_id, current_price } = event.data;
    if (vehicle_id && current_price) {
      const optimizedPrice = await autonomousEngine.optimizePricing(vehicle_id, current_price);
      
      // Update vehicle price in database
      await supabase
        .from('cars')
        .update({ price: optimizedPrice })
        .eq('id', vehicle_id);

      // Log price change
      await supabase.from('price_changes').insert({
        vehicle_id,
        old_price: current_price,
        new_price: optimizedPrice,
        reason: 'Autonomous optimization triggered by high demand',
        automated: true,
        created_at: new Date().toISOString()
      });

      console.log(`🤖 Price optimized for vehicle ${vehicle_id}: ${current_price} → ${optimizedPrice}`);
    }
  }

  private async sendNotification(event: AutonomousEvent): Promise<void> {
    const message = `Autonomous system has taken action based on ${event.type} event. Check dashboard for details.`;
    
    await automation.sendSlackMessage('alerts', message);
    await automation.sendTeamsMessage('alerts', message);
    
    console.log(`🤖 Notification sent for event: ${event.type}`);
  }

  private async executeSecurityResponse(event: AutonomousEvent): Promise<void> {
    const { user_id, ip_address, threat_level } = event.data;
    
    if (threat_level === 'high') {
      // Implement security response
      await supabase.from('security_events').insert({
        event_type: 'autonomous_response',
        user_id,
        ip: ip_address,
        details: 'Autonomous security response activated',
        timestamp: new Date().toISOString()
      });

      // Temporary lockout
      await supabase.from('user_locks').insert({
        user_id,
        reason: 'Autonomous security response',
        duration: 3600,
        created_at: new Date().toISOString()
      });

      console.log(`🤖 Security response executed for user ${user_id}`);
    }
  }

  private async sendAdminAlert(event: AutonomousEvent): Promise<void> {
    const alertMessage = `🚨 SECURITY ALERT: Autonomous system detected and responded to security threat. Event: ${event.type}`;
    
    // Send to all admins
    const { data: admins } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('role', 'admin');

    if (admins) {
      for (const admin of admins) {
        await supabase.from('notifications').insert({
          user_id: admin.id,
          type: 'security_alert',
          title: 'Autonomous Security Alert',
          message: alertMessage,
          created_at: new Date().toISOString(),
          read: false
        });
      }
    }

    console.log(`🤖 Admin alert sent for security event`);
  }

  private async scheduleMaintenance(event: AutonomousEvent): Promise<void> {
    const { vehicle_id } = event.data;
    
    if (vehicle_id) {
      const maintenanceDate = new Date();
      maintenanceDate.setDate(maintenanceDate.getDate() + 7); // Schedule for next week

      await supabase.from('maintenance_schedule').insert({
        vehicle_id,
        service_type: 'routine',
        scheduled_date: maintenanceDate.toISOString(),
        priority: 'medium',
        automated: true,
        status: 'scheduled',
        created_at: new Date().toISOString()
      });

      console.log(`🤖 Maintenance scheduled for vehicle ${vehicle_id}`);
    }
  }

  private async updateVehicleStatus(event: AutonomousEvent): Promise<void> {
    const { vehicle_id, status } = event.data;
    
    if (vehicle_id && status) {
      await supabase
        .from('cars')
        .update({ status })
        .eq('id', vehicle_id);

      console.log(`🤖 Vehicle ${vehicle_id} status updated to ${status}`);
    }
  }

  private async predictDemand(event: AutonomousEvent): Promise<void> {
    const predictions = await autonomousEngine.predictInventoryNeeds();
    
    // Store predictions in database
    for (const prediction of predictions) {
      await supabase.from('demand_predictions').insert({
        vehicle_id: prediction.vehicleId,
        predicted_demand: prediction.predictedDemand,
        confidence: prediction.confidence,
        recommended_action: prediction.recommendedAction,
        timeframe: prediction.timeframe,
        created_at: new Date().toISOString()
      });
    }

    console.log(`🤖 Demand predictions generated for ${predictions.length} vehicles`);
  }

  private async generatePurchaseOrder(event: AutonomousEvent): Promise<void> {
    const { vehicle_id, quantity_needed } = event.data;
    
    if (vehicle_id && quantity_needed) {
      await supabase.from('purchase_orders').insert({
        vehicle_id,
        quantity: quantity_needed,
        status: 'pending',
        automated: true,
        created_at: new Date().toISOString()
      });

      console.log(`🤖 Purchase order generated for vehicle ${vehicle_id}`);
    }
  }

  private async sendAutoResponse(event: AutonomousEvent): Promise<void> {
    const { customer_id, inquiry_text } = event.data;
    
    if (customer_id && inquiry_text) {
      // Generate automated response using knowledge base
      const response = this.generateAutoResponse(inquiry_text);
      
      await supabase.from('customer_responses').insert({
        customer_id,
        inquiry: inquiry_text,
        response,
        automated: true,
        created_at: new Date().toISOString()
      });

      console.log(`🤖 Auto response sent to customer ${customer_id}`);
    }
  }

  private generateAutoResponse(inquiry: string): string {
    // Simple response generation logic
    const responses = {
      'pricing': 'Thank you for your inquiry about pricing. Our rates are competitive and vary based on vehicle type and duration. Please check our website for current rates or contact our sales team for a personalized quote.',
      'availability': 'Thank you for checking availability. Our inventory is updated in real-time. You can check current availability on our website or contact us for specific dates.',
      'booking': 'Thank you for your interest in booking. You can make a reservation through our website or by calling our booking line. We require a valid ID and credit card for all bookings.',
      'default': 'Thank you for contacting us. Our team will review your inquiry and respond within 24 hours. For urgent matters, please call our support line.'
    };

    const lowerInquiry = inquiry.toLowerCase();
    if (lowerInquiry.includes('price') || lowerInquiry.includes('cost')) {
      return responses.pricing;
    } else if (lowerInquiry.includes('available') || lowerInquiry.includes('in stock')) {
      return responses.availability;
    } else if (lowerInquiry.includes('book') || lowerInquiry.includes('reserve')) {
      return responses.booking;
    } else {
      return responses.default;
    }
  }

  private async escalateIfNeeded(event: AutonomousEvent): Promise<void> {
    const { customer_id, inquiry_complexity } = event.data;
    
    if (inquiry_complexity === 'high') {
      // Escalate to human agent
      await supabase.from('escalations').insert({
        customer_id,
        reason: 'Complex inquiry requiring human intervention',
        priority: 'high',
        created_at: new Date().toISOString()
      });

      console.log(`🤖 Customer inquiry escalated for customer ${customer_id}`);
    }
  }

  private async logEventProcessing(event: AutonomousEvent): Promise<void> {
    await supabase.from('autonomous_events').insert({
      event_id: event.id,
      event_type: event.type,
      source: event.source,
      data: event.data,
      processed: event.processed,
      result: event.result,
      timestamp: event.timestamp.toISOString()
    });
  }

  // Public methods for external integration
  public async handleRentalRequest(vehicleId: string, customerId: string, duration: number): Promise<void> {
    await this.triggerEvent('rental_request', 'booking_system', {
      vehicle_id: vehicleId,
      customer_id: customerId,
      duration,
      timestamp: new Date().toISOString()
    });
  }

  public async handleSecurityEvent(userId: string, eventType: string, details: any): Promise<void> {
    await this.triggerEvent('security_event', 'security_system', {
      user_id: userId,
      event_type: eventType,
      details,
      timestamp: new Date().toISOString()
    });
  }

  public async handleVehicleUsage(vehicleId: string, mileage: number, usageData: any): Promise<void> {
    await this.triggerEvent('vehicle_usage', 'tracking_system', {
      vehicle_id: vehicleId,
      mileage,
      usage_data: usageData,
      timestamp: new Date().toISOString()
    });
  }

  public async handleInventoryUpdate(vehicleId: string, newStock: number, demandData: any): Promise<void> {
    await this.triggerEvent('inventory_update', 'inventory_system', {
      vehicle_id: vehicleId,
      stock_level: newStock,
      demand_data: demandData,
      timestamp: new Date().toISOString()
    });
  }

  public async handleCustomerInquiry(customerId: string, inquiry: string, inquiryType: string): Promise<void> {
    await this.triggerEvent('customer_inquiry', 'support_system', {
      customer_id: customerId,
      inquiry_text: inquiry,
      inquiry_type: inquiryType,
      timestamp: new Date().toISOString()
    });
  }

  // System monitoring methods
  public getEventQueueStatus(): any {
    return {
      queueLength: this.eventQueue.length,
      isProcessing: this.isProcessing,
      activeTriggers: this.triggers.filter(t => t.enabled).length,
      totalTriggers: this.triggers.length
    };
  }

  public getTriggerStats(): any {
    return this.triggers.map(trigger => ({
      id: trigger.id,
      name: trigger.name,
      enabled: trigger.enabled,
      priority: trigger.priority,
      eventType: trigger.eventType
    }));
  }

  public async updateTrigger(triggerId: string, updates: Partial<AutonomousTrigger>): Promise<void> {
    const triggerIndex = this.triggers.findIndex(t => t.id === triggerId);
    if (triggerIndex !== -1) {
      this.triggers[triggerIndex] = { ...this.triggers[triggerIndex], ...updates };
      
      // Update in database
      await supabase.from('autonomous_triggers').upsert({
        trigger_id: triggerId,
        ...updates,
        updated_at: new Date().toISOString()
      });
    }
  }
}

// Export singleton instance
export const autonomousIntegration = new AutonomousIntegration(); 