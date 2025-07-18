import { createClient } from '@supabase/supabase-js';

// Hardcoded for immediate fix (replace with env vars for production)
const supabaseUrl = "https://tyypdmhxuehzddudeuww.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5eXBkbWh4dWVoemRkdWRldXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MDg1MTMsImV4cCI6MjA2ODE4NDUxM30.eFoatxJAJrIxMGvs4FVTnzDpOUsL-pdKM8VAsw7E10Y";

// Create singleton instance to prevent multiple GoTrueClient instances
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
})(); 