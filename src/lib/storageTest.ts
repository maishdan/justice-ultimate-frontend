import { supabase } from './supabaseClient';

export async function testStorageConfiguration() {
  try {
    const { data, error } = await supabase.storage.from('cars').list('', { limit: 1 });
    if (error && typeof window !== 'undefined' && window.SHOW_PRIVATE_LOGS) {
      console.error('❌ Storage test failed:', error.message);
    }
  } catch (err) {
    if (typeof window !== 'undefined' && window.SHOW_PRIVATE_LOGS) {
      console.error('❌ Storage test error:', err);
    }
  }
}

if (typeof window !== 'undefined') {
  setTimeout(() => {
    testStorageConfiguration();
  }, 2000);
} 