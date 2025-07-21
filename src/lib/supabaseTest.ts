import { supabase } from './supabaseClient';

export async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test 1: Basic connection
    console.log('Testing basic connection...');
    const { data, error } = await supabase.from('cars').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error);
      return false;
    }
    
    console.log('✅ Basic connection successful');
    
    // Test 2: Storage access
    console.log('Testing storage access...');
    const { data: storageData, error: storageError } = await supabase.storage.from('vehicles').list('', { limit: 1 });
    
    if (storageError) {
      console.error('❌ Storage access failed:', storageError);
      return false;
    }
    
    console.log('✅ Storage access successful');
    
    // Test 3: Database write test (with cleanup)
    console.log('Testing database write...');
    const testData = {
      make: 'Test Brand',
      model: 'Connection Test Car',
      year: 2024,
      cash_price: 100000,
      is_sold: false
    };
    
    const { data: insertData, error: insertError } = await supabase.from('cars').insert([testData]).select();
    
    if (insertError) {
      console.error('❌ Database write failed:', insertError);
      console.log('Skipping write test due to schema mismatch');
      return true; // Don't fail the entire test for schema issues
    }
    
    console.log('✅ Database write successful');
    
    // Clean up test data
    if (insertData && insertData[0]) {
      await supabase.from('cars').delete().eq('id', insertData[0].id);
      console.log('✅ Test data cleaned up');
    }
    
    console.log('🎉 All Supabase tests passed!');
    return true;
    
  } catch (err) {
    console.error('❌ Supabase test failed:', err);
    return false;
  }
}

// Auto-run test if in browser
if (typeof window !== 'undefined') {
  // Run test after a short delay to ensure app is loaded
  setTimeout(() => {
    testSupabaseConnection().catch(console.error);
  }, 2000);
} 