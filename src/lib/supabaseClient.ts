import { createClient } from '@supabase/supabase-js';

// Use environment variables for both local and Vercel deployments
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://tyypdmhxuehzddudeuww.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5eXBkbWh4dWVoemRkdWRldXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MDg1MTMsImV4cCI6MjA2ODE4NDUxM30.eFoatxJAJrIxMGvs4FVTnzDpOUsL-pdKM8VAsw7E10Y";

// Create singleton instance to prevent multiple GoTrueClient instances
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false, // Disable auto refresh for faster initial connection
        persistSession: false,   // Disable session persistence for faster startup
        detectSessionInUrl: false // Disable URL detection for faster startup
      },
      realtime: {
        params: {
          eventsPerSecond: 1 // Reduce realtime events for faster connection
        }
      },
      global: {
        headers: {
          'X-Client-Info': 'supabase-js/2.0.0'
        }
      }
    });
  }
  return supabaseInstance;
})(); 