import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://tyypdmhxuehzddudeuww.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5eXBkbWh4dWVoemRkdWRldXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MDg1MTMsImV4cCI6MjA2ODE4NDUxM30.eFoatxJAJrIxMGvs4FVTnzDpOUsL-pdKM8VAsw7E10Y";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function addVehicle({ make, model, year, price, status }: { make: string, model: string, year: number, price: number, status: string }) {
  return supabase.from('inventory').insert([{ make, model, year, price, status }]);
}

export function subscribeToInventory(callback: (vehicle: any) => void) {
  return supabase
    .channel('inventory')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'inventory' }, payload => {
      callback(payload.new);
    })
    .subscribe();
} 