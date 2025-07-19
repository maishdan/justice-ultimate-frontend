// API configuration for different environments
const getBackendUrl = () => {
  // Check if we're in development (localhost) or production (deployed)
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isDevelopment) {
    return 'http://localhost:5001';
  } else {
    // Production backend URL
    return 'https://backend-jua.onrender.com';
  }
};

export const BACKEND_URL = getBackendUrl();

// API endpoints
export const API_ENDPOINTS = {
  verifyRecaptcha: `${BACKEND_URL}/api/verify-recaptcha`,
  health: `${BACKEND_URL}/health`,
  login: `${BACKEND_URL}/api/login`,
  logout: `${BACKEND_URL}/api/logout-everywhere`,
  systemMetrics: `${BACKEND_URL}/api/system-metrics`,
  sessionLogs: `${BACKEND_URL}/api/admin/session-logs`,
  auditLogs: `${BACKEND_URL}/audit-logs`,
  authUsers: `${BACKEND_URL}/auth-users`,
  impersonate: `${BACKEND_URL}/impersonate`,
  sendReceipt: `${BACKEND_URL}/send-receipt`,
};

// Helper function to make API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${BACKEND_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Test function to verify backend connectivity
export const testBackendConnection = async () => {
  try {
    console.log('Testing backend connection to:', BACKEND_URL);
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    console.log('Backend health check response:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return { success: false, error };
  }
};
