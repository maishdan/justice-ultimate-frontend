import { supabase } from '../lib/supabaseClient';

export interface BusinessRule {
  id: string;
  name: string;
  category: 'pricing' | 'inventory' | 'security' | 'customer_service' | 'maintenance';
  conditions: {
    field: string;
    operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'between';
    value: any;
    threshold?: number;
  }[];
  actions: {
    type: 'adjust_price' | 'restock_alert' | 'security_action' | 'send_notification' | 'schedule_maintenance';
    parameters: Record<string, any>;
  }[];
  priority: number;
  enabled: boolean;
  lastExecuted?: Date;
  successRate: number;
}

export interface MarketData {
  demandTrend: 'increasing' | 'decreasing' | 'stable';
  competitorPrices: Record<string, number>;
  seasonalFactors: number;
  economicIndicators: {
    inflation: number;
    fuelPrices: number;
    interestRates: number;
  };
}

export class AutonomousDecisionEngine {
  private rules: BusinessRule[] = [];
  private marketData!: MarketData;
  private decisionHistory: any[] = [];

  constructor() {
    this.loadBusinessRules();
    this.initializeMarketData();
  }

  private async loadBusinessRules() {
    // Load business rules from database or configuration
    this.rules = [
      {
        id: '1',
        name: 'Dynamic Pricing - High Demand',
        category: 'pricing',
        conditions: [
          { field: 'demand_level', operator: 'greater_than', value: 80 },
          { field: 'inventory_level', operator: 'less_than', value: 30 }
        ],
        actions: [
          { 
            type: 'adjust_price', 
            parameters: { adjustment: 0.15, reason: 'High demand, low inventory' }
          }
        ],
        priority: 1,
        enabled: true,
        successRate: 0.85
      },
      {
        id: '2',
        name: 'Security Threat Response',
        category: 'security',
        conditions: [
          { field: 'failed_login_attempts', operator: 'greater_than', value: 5 },
          { field: 'suspicious_activity', operator: 'equals', value: true }
        ],
        actions: [
          { 
            type: 'security_action', 
            parameters: { action: 'temporary_lockout', duration: 3600 }
          },
          {
            type: 'send_notification',
            parameters: { recipients: ['admin'], message: 'Security threat detected' }
          }
        ],
        priority: 1,
        enabled: true,
        successRate: 0.95
      },
      {
        id: '3',
        name: 'Maintenance Scheduling',
        category: 'maintenance',
        conditions: [
          { field: 'vehicle_mileage', operator: 'greater_than', value: 10000 },
          { field: 'last_maintenance', operator: 'less_than', value: 90 }
        ],
        actions: [
          {
            type: 'schedule_maintenance',
            parameters: { service_type: 'routine', priority: 'medium' }
          }
        ],
        priority: 2,
        enabled: true,
        successRate: 0.90
      }
    ];
  }

  private initializeMarketData() {
    this.marketData = {
      demandTrend: 'stable',
      competitorPrices: {
        'toyota_land_cruiser': 120000,
        'bmw_x5': 95000,
        'mercedes_s_class': 150000
      },
      seasonalFactors: 1.0,
      economicIndicators: {
        inflation: 0.05,
        fuelPrices: 150,
        interestRates: 0.12
      }
    };
  }

  public async processBusinessEvent(eventType: string, data: Record<string, any>): Promise<void> {
    console.log(`🤖 Autonomous Engine: Processing ${eventType} event`);
    
    const applicableRules = this.rules
      .filter(rule => rule.enabled)
      .sort((a, b) => b.priority - a.priority);

    for (const rule of applicableRules) {
      if (this.evaluateConditions(rule.conditions, data)) {
        await this.executeActions(rule.actions, data);
        this.updateRuleMetrics(rule, true);
        this.logDecision(rule, data, 'executed');
      }
    }
  }

  public async optimizePricing(vehicleId: string, currentPrice: number): Promise<number> {
    const demandAnalysis = await this.analyzeDemand(vehicleId);
    const competitorAnalysis = await this.analyzeCompetitors(vehicleId);

    let priceAdjustment = 0;

    // Demand-based adjustment
    if (demandAnalysis.demandLevel > 80) {
      priceAdjustment += 0.10; // 10% increase for high demand
    } else if (demandAnalysis.demandLevel < 30) {
      priceAdjustment -= 0.15; // 15% decrease for low demand
    }

    // Competitor-based adjustment
    const avgCompetitorPrice = competitorAnalysis.averagePrice;
    if (currentPrice > avgCompetitorPrice * 1.2) {
      priceAdjustment -= 0.05; // 5% decrease if significantly higher than competitors
    } else if (currentPrice < avgCompetitorPrice * 0.8) {
      priceAdjustment += 0.05; // 5% increase if significantly lower than competitors
    }

    // Seasonal adjustment
    priceAdjustment += (this.marketData.seasonalFactors - 1) * 0.1;

    const newPrice = currentPrice * (1 + priceAdjustment);
    
    this.logDecision(
      { id: 'pricing_optimization', name: 'Dynamic Pricing' },
      { vehicleId, currentPrice, newPrice, adjustments: { demand: demandAnalysis.demandLevel, competitor: avgCompetitorPrice } },
      'pricing_optimized'
    );

    return Math.round(newPrice);
  }

  public async predictInventoryNeeds(): Promise<any[]> {
    const predictions = [];
    
    // Analyze historical data and predict future needs
    const { data: historicalData } = await supabase
      .from('rentals')
      .select('vehicle_id, created_at, duration')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (historicalData) {
      const vehicleDemand = this.analyzeVehicleDemand(historicalData);
      
      for (const [vehicleId, demand] of Object.entries(vehicleDemand)) {
        const prediction = {
          vehicleId,
          predictedDemand: demand.predicted,
          confidence: demand.confidence,
          recommendedAction: this.getInventoryAction(demand.predicted, demand.current),
          timeframe: '30_days'
        };
        predictions.push(prediction);
      }
    }

    return predictions;
  }

  public async detectAnomalies(): Promise<any[]> {
    const anomalies = [];
    
    // Analyze various metrics for anomalies
    const metrics = await this.gatherSystemMetrics();
    
    for (const metric of metrics) {
      const zScore = this.calculateZScore(metric.value, metric.historical);
      if (Math.abs(zScore) > 2.5) {
        anomalies.push({
          type: metric.name,
          value: metric.value,
          zScore,
          severity: Math.abs(zScore) > 3.5 ? 'critical' : 'warning',
          timestamp: new Date()
        });
      }
    }

    return anomalies;
  }

  private evaluateConditions(conditions: any[], data: Record<string, any>): boolean {
    return conditions.every(condition => {
      const value = data[condition.field];
      
      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'greater_than':
          return value > condition.value;
        case 'less_than':
          return value < condition.value;
        case 'contains':
          return String(value).includes(String(condition.value));
        case 'between':
          return value >= condition.value[0] && value <= condition.value[1];
        default:
          return false;
      }
    });
  }

  private async executeActions(actions: any[], data: Record<string, any>): Promise<void> {
    for (const action of actions) {
      try {
        switch (action.type) {
          case 'adjust_price':
            await this.executePriceAdjustment(action.parameters, data);
            break;
          case 'security_action':
            await this.executeSecurityAction(action.parameters, data);
            break;
          case 'send_notification':
            await this.sendNotification(action.parameters, data);
            break;
          case 'schedule_maintenance':
            await this.scheduleMaintenance(action.parameters, data);
            break;
          default:
            console.warn(`Unknown action type: ${action.type}`);
        }
      } catch (error) {
        console.error(`Error executing action ${action.type}:`, error);
      }
    }
  }

  private async executePriceAdjustment(parameters: any, data: any): Promise<void> {
    const { adjustment, reason } = parameters;
    
    // Update vehicle price in database
    const { data: vehicle } = await supabase
      .from('vehicles')
      .select('price')
      .eq('id', data.vehicle_id)
      .single();

    if (vehicle && typeof vehicle.price === 'number') {
      const newPrice = vehicle.price * (1 + adjustment);
      await supabase
        .from('vehicles')
        .update({ price: newPrice })
        .eq('id', data.vehicle_id);

      // Log the price change
      await supabase.from('price_changes').insert({
        vehicle_id: data.vehicle_id,
        old_price: vehicle.price,
        new_price: newPrice,
        reason,
        adjustment_percentage: adjustment * 100,
        automated: true
      });
    }
  }

  private async executeSecurityAction(parameters: any, data: any): Promise<void> {
    const { action, duration } = parameters;
    
    if (action === 'temporary_lockout') {
      // Implement temporary lockout logic
      await supabase.from('security_events').insert({
        event_type: 'automated_lockout',
        user_id: data.user_id,
        ip: data.ip,
        details: `Automated lockout for ${duration} seconds`,
        timestamp: new Date().toISOString()
      });
    }
  }

  private async sendNotification(parameters: any, data: any): Promise<void> {
    const { recipients, message } = parameters;
    
    for (const recipient of recipients) {
      await supabase.from('notifications').insert({
        user_id: recipient,
        type: 'automated_alert',
        title: 'Autonomous System Alert',
        message,
        created_at: new Date().toISOString(),
        read: false
      });
    }
  }

  private async scheduleMaintenance(parameters: any, data: any): Promise<void> {
    const { service_type, priority } = parameters;
    
    await supabase.from('maintenance_schedule').insert({
      vehicle_id: data.vehicle_id,
      service_type,
      priority,
      scheduled_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      automated: true,
      status: 'scheduled'
    });
  }

  private updateRuleMetrics(rule: BusinessRule, success: boolean): void {
    const successCount = rule.successRate * 100;
    const totalCount = 100;
    const newSuccessCount = successCount + (success ? 1 : 0);
    rule.successRate = newSuccessCount / (totalCount + 1);
    rule.lastExecuted = new Date();
  }

  private logDecision(rule: any, data: any, action: string): void {
    this.decisionHistory.push({
      ruleId: rule.id,
      ruleName: rule.name,
      action,
      data,
      timestamp: new Date(),
      confidence: rule.successRate || 0.8
    });
  }

  private async analyzeDemand(vehicleId: string): Promise<any> {
    // Analyze demand for specific vehicle
    const { data: rentals } = await supabase
      .from('rentals')
      .select('created_at')
      .eq('vehicle_id', vehicleId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    const demandLevel = rentals ? (rentals.length / 7) * 100 : 50;
    
    return {
      demandLevel: Math.min(demandLevel, 100),
      trend: demandLevel > 70 ? 'increasing' : demandLevel < 30 ? 'decreasing' : 'stable'
    };
  }

  private async analyzeCompetitors(vehicleId: string): Promise<any> {
    // Mock competitor analysis
    return {
      averagePrice: 100000,
      priceRange: [80000, 120000],
      marketShare: 0.15
    };
  }

  private analyzeVehicleDemand(historicalData: any[]): Record<string, any> {
    const vehicleDemand: Record<string, any> = {};
    
    // Group by vehicle and analyze demand patterns
    historicalData.forEach(rental => {
      if (!vehicleDemand[rental.vehicle_id]) {
        vehicleDemand[rental.vehicle_id] = { count: 0, totalDuration: 0 };
      }
      vehicleDemand[rental.vehicle_id].count++;
      vehicleDemand[rental.vehicle_id].totalDuration += rental.duration;
    });

    // Calculate predictions
    Object.keys(vehicleDemand).forEach(vehicleId => {
      const demand = vehicleDemand[vehicleId];
      const avgDailyDemand = demand.count / 30;
      const predictedDemand = avgDailyDemand * 30 * 1.1; // 10% growth assumption
      
      vehicleDemand[vehicleId] = {
        current: demand.count,
        predicted: Math.round(predictedDemand),
        confidence: 0.85,
        avgDuration: demand.totalDuration / demand.count
      };
    });

    return vehicleDemand;
  }

  private getInventoryAction(predicted: number, current: number): string {
    const ratio = predicted / current;
    if (ratio > 1.5) return 'increase_inventory';
    if (ratio < 0.7) return 'decrease_inventory';
    return 'maintain_current_level';
  }

  private async gatherSystemMetrics(): Promise<any[]> {
    // Gather various system metrics for anomaly detection
    return [
      { name: 'active_users', value: 150, historical: [120, 140, 130, 160, 145] },
      { name: 'rental_requests', value: 45, historical: [35, 40, 38, 42, 39] },
      { name: 'system_response_time', value: 250, historical: [180, 200, 190, 220, 210] }
    ];
  }

  private calculateZScore(value: number, historical: number[]): number {
    const mean = historical.reduce((a, b) => a + b, 0) / historical.length;
    const variance = historical.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / historical.length;
    const stdDev = Math.sqrt(variance);
    return (value - mean) / stdDev;
  }

  public getDecisionHistory(): any[] {
    return this.decisionHistory.slice(-50); // Return last 50 decisions
  }

  public getSystemHealth(): any {
    const totalRules = this.rules.length;
    const enabledRules = this.rules.filter(r => r.enabled).length;
    const avgSuccessRate = this.rules.reduce((sum, r) => sum + r.successRate, 0) / totalRules;

    return {
      totalRules,
      enabledRules,
      avgSuccessRate,
      lastDecision: this.decisionHistory[this.decisionHistory.length - 1],
      systemStatus: avgSuccessRate > 0.8 ? 'healthy' : 'needs_attention'
    };
  }
}

// Export singleton instance
export const autonomousEngine = new AutonomousDecisionEngine(); 