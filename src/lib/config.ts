// Environment configuration for Justice Ultimate Automobiles
export const config = {
  // Backend URLs
  development: {
    backendUrl: 'http://localhost:5001',
    description: 'Local development server'
  },
  production: {
    backendUrl: 'https://backend-jua.onrender.com',
    description: 'Production server on Render'
  },
  
  // Supabase configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "https://tyypdmhxuehzddudeuww.supabase.co",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5eXBkbWh4dWVoemRkdWRldXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MDg1MTMsImV4cCI6MjA2ODE4NDUxM30.eFoatxJAJrIxMGvs4FVTnzDpOUsL-pdKM8VAsw7E10Y"
  },
  
  // reCAPTCHA configuration
  recaptcha: {
    siteKey: '6Lf2HYgrAAAAAGLA2Pdh_EgRNFLVNtFr8wChye0T',
    secretKey: '6Lf2HYgrAAAAAHvpe272LhCc6SfwXK_ak39tLBZl'
  },
  
  // Feature flags
  features: {
    enableRecaptcha: true,
    enableBackendHealthCheck: true,
    enableDebugLogging: import.meta.env.DEV || false
  }
};

// Helper function to get current environment
export const getCurrentEnvironment = () => {
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' || 
                       window.location.port === '5173';
  
  return isDevelopment ? 'development' : 'production';
};

// Helper function to get backend URL for current environment
export const getBackendUrl = () => {
  const env = getCurrentEnvironment();
  return config[env].backendUrl;
};

// Helper function to log environment info
export const logEnvironmentInfo = () => {
  const env = getCurrentEnvironment();
  const backendUrl = getBackendUrl();
  
  console.log('🌍 Environment Information:');
  console.log(`   Environment: ${env}`);
  console.log(`   Backend URL: ${backendUrl}`);
  console.log(`   Description: ${config[env].description}`);
  console.log(`   Debug Logging: ${config.features.enableDebugLogging}`);
  console.log(`   reCAPTCHA Enabled: ${config.features.enableRecaptcha}`);
}; 