import { supabase } from './supabaseClient';

export async function checkAuthenticationStatus() {
  console.log('🔍 Checking authentication status...');
  
  try {
    // Get current user
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('❌ Auth check failed:', error.message);
      return false;
    }
    
    if (!user) {
      console.log('⚠️ No user logged in (anonymous access)');
      console.log('💡 Storage uploads require authentication');
      console.log('💡 Expected UID: 379891e8-e124-4f08-a361-a3b1081f63c6');
      return false;
    }
    
    console.log('✅ User is authenticated');
    console.log('User ID:', user.id);
    console.log('User email:', user.email);
    
    // Check if this is the expected admin user
    const expectedUID = '379891e8-e124-4f08-a361-a3b1081f63c6';
    if (user.id === expectedUID) {
      console.log('✅ Correct admin user - storage uploads should work');
      return true;
    } else {
      console.log('⚠️ Different user logged in');
      console.log('Expected UID:', expectedUID);
      console.log('Actual UID:', user.id);
      console.log('💡 Storage uploads may fail due to policy restrictions');
      return false;
    }
    
  } catch (err) {
    console.error('❌ Authentication check failed:', err);
    return false;
  }
}

// Auto-run auth check
if (typeof window !== 'undefined') {
  setTimeout(() => {
    checkAuthenticationStatus();
  }, 1000);
} 