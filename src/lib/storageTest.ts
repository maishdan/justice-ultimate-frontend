import { supabase } from './supabaseClient';

export async function testStorageConfiguration() {
  console.log('🔍 Testing storage configuration...');
  
  try {
    // Test 1: Check if vehicles bucket is accessible (direct test)
    console.log('Testing vehicles bucket access...');
    const { data: files, error: listError } = await supabase.storage.from('vehicles').list('', { limit: 1 });
    
    if (listError) {
      console.error('❌ Vehicles bucket access failed:', listError);
      return false;
    }
    
    console.log('✅ Vehicles bucket accessible');
    console.log('Bucket contains files:', files.length);
    
    // Test 2: Check if we can get bucket info
    console.log('Testing bucket info...');
    try {
      const { data: bucketInfo, error: bucketError } = await supabase.storage.getBucket('vehicles');
      if (bucketError) {
        console.log('⚠️ Cannot get bucket info (anon key limitation)');
      } else {
        console.log('✅ Bucket info accessible');
        console.log('Bucket public:', bucketInfo.public);
      }
    } catch (err) {
      console.log('⚠️ Bucket info test skipped (permissions)');
    }
    
    return true;
    
  } catch (err) {
    console.error('❌ Storage test failed:', err);
    return false;
  }
}

// Auto-run storage test
if (typeof window !== 'undefined') {
  setTimeout(() => {
    testStorageConfiguration();
  }, 3000);
} 