import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://tyypdmhxuehzddudeuww.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5eXBkbWh4dWVoemRkdWRldXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MDg1MTMsImV4cCI6MjA2ODE4NDUxM30.eFoatxJAJrIxMGvs4FVTnzDpOUsL-pdKM8VAsw7E10Y";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createOrder({ user_id, vehicle_id, amount, status }: { user_id: string, vehicle_id: string, amount: number, status: string }) {
  return supabase.from('orders').insert([{ user_id, vehicle_id, amount, status }]);
}

export function subscribeToOrders(callback: (order: any) => void) {
  return supabase
    .channel('orders')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
      callback(payload.new);
    })
    .subscribe();
} 