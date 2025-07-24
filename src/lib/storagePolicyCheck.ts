import { supabase } from './supabaseClient';

export async function checkStoragePolicies() {
  console.log('🔍 Checking storage policies...');
  
  try {
    // Test 1: Try to list files (should work if bucket is public)
    console.log('Testing file listing...');
    const { data: files, error: listError } = await supabase.storage.from('cars').list('', { limit: 1 });
    
    if (listError) {
      console.error('❌ File listing failed:', listError.message);
      console.log('💡 This suggests the bucket might not be public or RLS policies are blocking access');
    } else {
      console.log('✅ File listing works');
      console.log('Files found:', files.length);
    }
    
    // Test 2: Try to upload a test file
    console.log('Testing file upload...');
    const testContent = 'Test file for policy check';
    const testFile = new File([testContent], 'policy_test.txt', { type: 'text/plain' });
    const fileName = `policy_test_${Date.now()}.txt`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage.from('cars').upload(fileName, testFile, {
      upsert: true
    });
    
    if (uploadError) {
      console.error('❌ File upload failed:', uploadError.message);
      if (uploadError.message.includes('row-level security policy')) {
        console.log('💡 RLS Policy Issue: Storage policies need to be updated');
        console.log('💡 Run the SQL commands in UPDATE_STORAGE_POLICIES.sql');
        console.log('💡 This will allow anonymous uploads for testing');
      } else if (uploadError.message.includes('authenticated')) {
        console.log('💡 Authentication Issue: User needs to be logged in');
        console.log('💡 Your policy requires authentication with UID: 379891e8-e124-4f08-a361-a3b1081f63c6');
      } else {
        console.log('💡 This suggests INSERT policies might be missing or too restrictive');
      }
    } else {
      console.log('✅ File upload works');
      
      // Clean up test file
      const { error: deleteError } = await supabase.storage.from('cars').remove([fileName]);
      if (deleteError) {
        console.error('⚠️ File cleanup failed:', deleteError.message);
      } else {
        console.log('✅ File cleanup works');
      }
    }
    
    // Test 3: Try to get public URL
    console.log('Testing public URL access...');
    const { data: urlData } = supabase.storage.from('cars').getPublicUrl('test.jpg');
    console.log('Public URL format:', urlData.publicUrl);
    
    console.log('📋 Storage Policy Summary:');
    console.log('- If file listing works: Bucket is accessible');
    console.log('- If file upload works: INSERT policies are configured');
    console.log('- If file cleanup works: DELETE policies are configured');
    console.log('- Public URLs are available for serving files');
    
  } catch (err) {
    console.error('❌ Storage policy check failed:', err);
  }
}

// Auto-run policy check
if (typeof window !== 'undefined') {
  setTimeout(() => {
    checkStoragePolicies();
  }, 4000);
} 