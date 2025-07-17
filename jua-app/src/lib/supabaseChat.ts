import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://tyypdmhxuehzddudeuww.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5eXBkbWh4dWVoemRkdWRldXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MDg1MTMsImV4cCI6MjA2ODE4NDUxM30.eFoatxJAJrIxMGvs4FVTnzDpOUsL-pdKM8VAsw7E10Y";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function sendMessage({ sender_id, content }: { sender_id: string, content: string }) {
  return supabase.from('messages').insert([{ sender_id, content }]);
}

export function subscribeToMessages(callback: (msg: any) => void) {
  return supabase
    .channel('messages')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
      callback(payload.new);
    })
    .subscribe();
} 