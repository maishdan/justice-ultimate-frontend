import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tyypdmhxuehzddudeuww.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5eXBkbWh4dWVoemRkdWRldXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MDg1MTMsImV4cCI6MjA2ODE4NDUxM30.eFoatxJAJrIxMGvs4FVTnzDpOUsL-pdKM8VAsw7E10Y';

export const supabase = createClient(supabaseUrl, supabaseKey); 