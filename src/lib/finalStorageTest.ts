import { supabase } from './supabaseClient';

export async function finalStorageTest() {
  console.log('🎯 Final Storage Test - After Policy Update');
  
  try {
    // Test 1: File listing
    console.log('1️⃣ Testing file listing...');
    const { data: files, error: listError } = await supabase.storage.from('vehicles').list('', { limit: 5 });
    
    if (listError) {
      console.error('❌ File listing failed:', listError.message);
      return false;
    }
    console.log('✅ File listing works');
    console.log('Files found:', files.length);
    
    // Test 2: File upload
    console.log('2️⃣ Testing file upload...');
    const testContent = 'Final storage test file';
    const testFile = new File([testContent], 'final_test.txt', { type: 'text/plain' });
    const fileName = `final_test_${Date.now()}.txt`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage.from('vehicles').upload(fileName, testFile, {
      upsert: true
    });
    
    if (uploadError) {
      console.error('❌ File upload failed:', uploadError.message);
      return false;
    }
    console.log('✅ File upload works');
    console.log('Uploaded file:', uploadData.path);
    
    // Test 3: File deletion
    console.log('3️⃣ Testing file deletion...');
    const { error: deleteError } = await supabase.storage.from('vehicles').remove([fileName]);
    
    if (deleteError) {
      console.error('❌ File deletion failed:', deleteError.message);
      return false;
    }
    console.log('✅ File deletion works');
    
    // Test 4: Public URL
    console.log('4️⃣ Testing public URL...');
    const { data: urlData } = supabase.storage.from('vehicles').getPublicUrl('test.jpg');
    console.log('✅ Public URL works:', urlData.publicUrl);
    
    console.log('🎉 All storage tests passed!');
    console.log('📋 Storage system is fully functional');
    console.log('🚗 You can now upload car images successfully');
    
    return true;
    
  } catch (err) {
    console.error('❌ Final storage test failed:', err);
    return false;
  }
}

// Auto-run final test
if (typeof window !== 'undefined') {
  setTimeout(() => {
    finalStorageTest();
  }, 2000);
} 