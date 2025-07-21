import { supabase } from './supabaseClient';

export async function testSupabaseConnection() {
  try {
    const { error } = await supabase.from('cars').select('id').limit(1);
    if (error) {
      if (typeof window !== 'undefined' && window.SHOW_PRIVATE_LOGS) {
        console.error('❌ Supabase connection failed:', error.message);
      }
    } else {
      if (typeof window !== 'undefined' && window.SHOW_PRIVATE_LOGS) {
        console.log('✅ Supabase connection successful');
      }
    }
  } catch (err) {
    if (typeof window !== 'undefined' && window.SHOW_PRIVATE_LOGS) {
      console.error('❌ Supabase connection test failed:', err);
    }
  }
}

if (typeof window !== 'undefined') {
  setTimeout(() => {
    testSupabaseConnection();
  }, 1000);
} 