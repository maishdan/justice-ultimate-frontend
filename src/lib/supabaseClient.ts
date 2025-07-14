import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bdnotknngzwuopyvypgo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkbm90a25uZ3p3dW9weXZ5cGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MTIzMzgsImV4cCI6MjA2Nzk4ODMzOH0.dezMnUkPS2TmuZTaEDggitSPhrNMf9mqJR_vUea8iCY';
export const supabase = createClient(supabaseUrl, supabaseKey); 