import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gzmgfgcgytafngvliqqj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bWdmZ2NneXRhZm5ndmxpcXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNTQzODEsImV4cCI6MjA2ODgzMDM4MX0.8xGAFdz9I4q-FOMjSBLMSqGpPL-_7hHh-5gjzt3uvwM';
// Service role key (do not expose in frontend):
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bWdmZ2NneXRhZm5ndmxpcXFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzI1NDM4MSwiZXhwIjoyMDY4ODMwMzgxfQ.J6G9gjn3hRSKXmwHnFFb_RVKWqrj6lIUh5kCh6UwDIQ

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 