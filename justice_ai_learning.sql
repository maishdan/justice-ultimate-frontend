-- Justice AI Learning Database Schema
-- This database stores machine learning data for the Justice AI chatbot

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Justice AI Learning Table - Stores conversation patterns and responses
CREATE TABLE IF NOT EXISTS justice_ai_learning (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_input TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    context TEXT,
    user_role VARCHAR(50),
    current_page VARCHAR(255),
    pattern TEXT,
    confidence DECIMAL(3,2) DEFAULT 0.0,
    usage_count INTEGER DEFAULT 1,
    helpful BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Justice AI Conversation History - Stores detailed conversation logs
CREATE TABLE IF NOT EXISTS justice_ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255),
    user_id VARCHAR(255),
    user_role VARCHAR(50),
    conversation_data JSONB,
    page_context VARCHAR(255),
    interaction_count INTEGER DEFAULT 0,
    session_duration INTEGER, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE
);

-- Justice AI Knowledge Patterns - Stores learned patterns and their effectiveness
CREATE TABLE IF NOT EXISTS justice_ai_patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pattern_type VARCHAR(100), -- 'greeting', 'help_request', 'feature_question', 'page_guidance'
    pattern_text TEXT NOT NULL,
    response_template TEXT NOT NULL,
    success_rate DECIMAL(3,2) DEFAULT 0.0,
    usage_count INTEGER DEFAULT 0,
    last_used TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Justice AI System Features - Stores information about system features for context
CREATE TABLE IF NOT EXISTS justice_ai_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feature_name VARCHAR(100) UNIQUE NOT NULL,
    feature_description TEXT,
    page_path VARCHAR(255),
    user_roles TEXT[], -- Array of roles that can access this feature
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Justice AI User Preferences - Stores user-specific AI preferences
CREATE TABLE IF NOT EXISTS justice_ai_user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) UNIQUE NOT NULL,
    user_role VARCHAR(50),
    preferred_language VARCHAR(10) DEFAULT 'en',
    ai_personality VARCHAR(50) DEFAULT 'friendly', -- 'friendly', 'professional', 'casual'
    response_length VARCHAR(20) DEFAULT 'medium', -- 'short', 'medium', 'detailed'
    auto_suggestions BOOLEAN DEFAULT true,
    voice_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Justice AI Performance Metrics - Stores AI performance analytics
CREATE TABLE IF NOT EXISTS justice_ai_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_date DATE DEFAULT CURRENT_DATE,
    total_interactions INTEGER DEFAULT 0,
    successful_responses INTEGER DEFAULT 0,
    failed_responses INTEGER DEFAULT 0,
    avg_response_time DECIMAL(5,2), -- in seconds
    user_satisfaction_score DECIMAL(3,2),
    most_common_queries JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_justice_ai_learning_user_input ON justice_ai_learning(user_input);
CREATE INDEX IF NOT EXISTS idx_justice_ai_learning_pattern ON justice_ai_learning(pattern);
CREATE INDEX IF NOT EXISTS idx_justice_ai_learning_user_role ON justice_ai_learning(user_role);
CREATE INDEX IF NOT EXISTS idx_justice_ai_learning_created_at ON justice_ai_learning(created_at);
CREATE INDEX IF NOT EXISTS idx_justice_ai_learning_helpful ON justice_ai_learning(helpful);

CREATE INDEX IF NOT EXISTS idx_justice_ai_conversations_session_id ON justice_ai_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_justice_ai_conversations_user_id ON justice_ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_justice_ai_conversations_created_at ON justice_ai_conversations(created_at);

CREATE INDEX IF NOT EXISTS idx_justice_ai_patterns_pattern_type ON justice_ai_patterns(pattern_type);
CREATE INDEX IF NOT EXISTS idx_justice_ai_patterns_is_active ON justice_ai_patterns(is_active);
CREATE INDEX IF NOT EXISTS idx_justice_ai_patterns_success_rate ON justice_ai_patterns(success_rate);

CREATE INDEX IF NOT EXISTS idx_justice_ai_features_feature_name ON justice_ai_features(feature_name);
CREATE INDEX IF NOT EXISTS idx_justice_ai_features_is_active ON justice_ai_features(is_active);

CREATE INDEX IF NOT EXISTS idx_justice_ai_metrics_metric_date ON justice_ai_metrics(metric_date);

-- Insert initial patterns for Justice AI
INSERT INTO justice_ai_patterns (pattern_type, pattern_text, response_template, success_rate, usage_count) VALUES
('greeting', 'hi|hello|hey|good morning|good afternoon|good evening', 
 '🌟 {time_greeting}! I''m Justice AI, your intelligent assistant. {role_specific_help} 💡 Quick Actions: • Ask me about any feature or service • Get help with navigation • Learn about our vehicles • Book a test drive or service How can I assist you today? 😊', 
 0.95, 0),

('help_request', 'help|support|assist|guide|how to|what can you do|tutorial', 
 '🤖 **Justice AI Help Center** **Current Page:** {current_page} **Your Role:** {user_role} **What I can help you with:** 🚗 **Vehicle Services:** • Browse our vehicle catalog • Get pricing information • Book test drives • Schedule maintenance 💼 **Account Management:** • View your profile • Check bookings • Manage preferences • Get support 🎯 **Quick Commands:** • "Show me cars" - Browse vehicles • "Book test drive" - Schedule test drive • "Check prices" - Get pricing info • "Help with [feature]" - Get specific help **Just ask me anything! I''m here to help make your experience smooth and enjoyable.** ✨', 
 0.90, 0),

('feature_question', 'car|vehicle|book|finance|test drive|maintenance|price|cost', 
 '🎯 **Feature Assistance** I can help you with: • Vehicle browsing and selection • Test drive bookings • Pricing and financing • Maintenance scheduling • Account management • Technical support What specific feature would you like help with?', 
 0.85, 0),

('page_guidance', 'page|where|navigate|find|locate|menu|section', 
 '📍 **Current Page: {current_page}** I can help you navigate and use the features on this page. What would you like to know?', 
 0.80, 0);

-- Insert initial system features
INSERT INTO justice_ai_features (feature_name, feature_description, page_path, user_roles) VALUES
('vehicle_catalog', 'Browse and search vehicle inventory', '/vehicles', ARRAY['guest', 'customer', 'staff', 'admin']),
('booking_system', 'Book test drives and services', '/book', ARRAY['customer', 'staff', 'admin']),
('finance_calculator', 'Calculate financing options', '/finance', ARRAY['customer', 'staff', 'admin']),
('test_drive', 'Schedule test drive appointments', '/test-drive', ARRAY['customer', 'staff', 'admin']),
('maintenance_scheduling', 'Schedule vehicle maintenance', '/maintenance', ARRAY['customer', 'staff', 'mechanic', 'admin']),
('customer_support', 'Get customer support and help', '/support', ARRAY['guest', 'customer', 'staff', 'admin']),
('admin_dashboard', 'Admin panel and system management', '/admin', ARRAY['admin']),
('inventory_management', 'Manage vehicle inventory', '/inventory', ARRAY['staff', 'admin']),
('pricing_optimization', 'Autonomous pricing optimization', '/pricing', ARRAY['admin']);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_justice_ai_learning_updated_at BEFORE UPDATE ON justice_ai_learning FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_justice_ai_patterns_updated_at BEFORE UPDATE ON justice_ai_patterns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_justice_ai_features_updated_at BEFORE UPDATE ON justice_ai_features FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_justice_ai_user_preferences_updated_at BEFORE UPDATE ON justice_ai_user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to increment usage count
CREATE OR REPLACE FUNCTION increment_pattern_usage()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE justice_ai_patterns 
    SET usage_count = usage_count + 1, 
        last_used = NOW(),
        success_rate = CASE 
            WHEN NEW.helpful = true THEN 
                (success_rate * usage_count + 1) / (usage_count + 1)
            ELSE 
                (success_rate * usage_count) / (usage_count + 1)
        END
    WHERE pattern_text ILIKE '%' || NEW.user_input || '%';
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for pattern usage tracking
CREATE TRIGGER track_pattern_usage AFTER INSERT ON justice_ai_learning FOR EACH ROW EXECUTE FUNCTION increment_pattern_usage();

-- Create view for AI learning insights
CREATE OR REPLACE VIEW justice_ai_insights AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_interactions,
    COUNT(CASE WHEN helpful = true THEN 1 END) as helpful_responses,
    ROUND(COUNT(CASE WHEN helpful = true THEN 1 END)::DECIMAL / COUNT(*) * 100, 2) as satisfaction_rate,
    AVG(confidence) as avg_confidence,
    MODE() WITHIN GROUP (ORDER BY user_role) as most_active_role,
    MODE() WITHIN GROUP (ORDER BY current_page) as most_active_page
FROM justice_ai_learning 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Comments for documentation
COMMENT ON TABLE justice_ai_learning IS 'Stores machine learning data for Justice AI chatbot interactions';
COMMENT ON TABLE justice_ai_conversations IS 'Stores conversation session data for analytics';
COMMENT ON TABLE justice_ai_patterns IS 'Stores learned conversation patterns and their effectiveness';
COMMENT ON TABLE justice_ai_features IS 'Stores system features information for context-aware responses';
COMMENT ON TABLE justice_ai_user_preferences IS 'Stores user-specific AI preferences and settings';
COMMENT ON TABLE justice_ai_metrics IS 'Stores daily performance metrics for the AI system'; 