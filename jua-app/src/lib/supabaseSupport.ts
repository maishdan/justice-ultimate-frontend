import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://tyypdmhxuehzddudeuww.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5eXBkbWh4dWVoemRkdWRldXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MDg1MTMsImV4cCI6MjA2ODE4NDUxM30.eFoatxJAJrIxMGvs4FVTnzDpOUsL-pdKM8VAsw7E10Y";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createTicket({ user_id, subject, message, status }: { user_id: string, subject: string, message: string, status: string }) {
  return supabase.from('support_tickets').insert([{ user_id, subject, message, status }]);
}

export function subscribeToTickets(callback: (ticket: any) => void) {
  return supabase
    .channel('support_tickets')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_tickets' }, payload => {
      callback(payload.new);
    })
    .subscribe();
} 