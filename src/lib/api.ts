import { getBackendUrl, logEnvironmentInfo } from './config';

// API configuration for different environments
export const BACKEND_URL = getBackendUrl();

// Log environment info on module load
logEnvironmentInfo();

// API endpoints
export const API_ENDPOINTS = {
  health: `${BACKEND_URL}/health`,
  login: `${BACKEND_URL}/api/login`,
  register: `${BACKEND_URL}/api/register`,
  logout: `${BACKEND_URL}/api/logout-everywhere`,
  systemMetrics: `${BACKEND_URL}/api/system-metrics`,
  sessionLogs: `${BACKEND_URL}/api/admin/session-logs`,
  auditLogs: `${BACKEND_URL}/audit-logs`,
  authUsers: `${BACKEND_URL}/auth-users`,
  impersonate: `${BACKEND_URL}/impersonate`,
  sendReceipt: `${BACKEND_URL}/send-receipt`,
};

// Helper function to make API calls with better error handling
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
    console.log(`🌐 Making API call to: ${url}`);
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      console.error(`❌ API call failed: ${response.status} ${response.statusText}`);
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    console.log(`✅ API call successful: ${url}`);
    return response;
  } catch (error) {
    console.error('❌ API call failed:', error);
    throw error;
  }
};

// Enhanced test function to verify backend connectivity
export const testBackendConnection = async () => {
  try {
    console.log('🔍 Testing backend connection to:', BACKEND_URL);
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Backend health check successful:', data);
    return { success: true, data, url: BACKEND_URL };
  } catch (error) {
    console.error('❌ Backend connection test failed:', error);
    return { success: false, error, url: BACKEND_URL };
  }
};
