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
    url: 'https://gzmgfgcgytafngvliqqj.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bWdmZ2NneXRhZm5ndmxpcXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNTQzODEsImV4cCI6MjA2ODgzMDM4MX0.8xGAFdz9I4q-FOMjSBLMSqGpPL-_7hHh-5gjzt3uvwM',
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
  // All environment/config logs removed for security
}; 