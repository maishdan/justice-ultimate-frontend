import { supabase } from './supabaseClient';

export async function quickConnectionTest() {
  console.log('🚀 Quick connection test starting...');
  
  try {
    // Simple ping test - just check if we can reach Supabase
    const startTime = Date.now();
    const { data, error } = await supabase.from('cars').select('id').limit(1);
    const duration = Date.now() - startTime;
    
    if (error) {
      console.error('❌ Quick connection failed:', error.message);
      return { success: false, error: error.message, duration };
    }
    
    console.log(`✅ Quick connection successful in ${duration}ms`);
    return { success: true, duration };
    
  } catch (err) {
    console.error('❌ Quick connection test failed:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// Auto-run quick test
if (typeof window !== 'undefined') {
  setTimeout(() => {
    quickConnectionTest();
  }, 1000);
} 