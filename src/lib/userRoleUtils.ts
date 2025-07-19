import { supabase } from './supabaseClient';

export interface UserRole {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

/**
 * Get user role from profiles table - NO DEFAULTS, explicit role required
 * Enhanced with better RLS handling
 */
export const getUserRole = async (userId: string): Promise<string | null> => {
  try {
    // First, try to get role from profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.log('Profile not found or access denied, trying auth metadata:', error.message);
      
      // If profiles table fails due to RLS, try to get user from auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.log('Could not fetch user from auth, NO ROLE ASSIGNED');
        return null; // NO DEFAULT - explicit role required
      }
      
      // Check app_metadata first, then user_metadata
      const role = user.app_metadata?.role || user.user_metadata?.role;
      
      if (role && ['admin', 'staff', 'mechanic', 'customer'].includes(role)) {
        console.log('Found role in auth metadata:', role);
        return role;
      }
      
      console.log('No valid role found in metadata, NO ROLE ASSIGNED');
      return null; // NO DEFAULT - explicit role required
    }

    const role = (data?.role as string);
    
    // Validate the role
    if (role && ['admin', 'staff', 'mechanic', 'customer'].includes(role)) {
      console.log('Found role in profiles table:', role);
      return role;
    }
    
    console.log('Invalid role in profiles table, NO ROLE ASSIGNED');
    return null; // NO DEFAULT - explicit role required
  } catch (error) {
    console.error('Error fetching user role:', error);
    
    // Final fallback - try to get user from auth
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const role = user.app_metadata?.role || user.user_metadata?.role;
        if (role && ['admin', 'staff', 'mechanic', 'customer'].includes(role)) {
          return role;
        }
      }
    } catch (authError) {
      console.error('Auth fallback failed:', authError);
    }
    
    return null; // NO DEFAULT - explicit role required
  }
};

/**
 * Set user role in profiles table and auth metadata
 * Enhanced with better RLS handling
 */
export const setUserRole = async (userId: string, email: string, role: string): Promise<boolean> => {
  try {
    // Validate role
    if (!['admin', 'staff', 'mechanic', 'customer'].includes(role)) {
      console.error('Invalid role:', role);
      return false;
    }

    // Try to update profiles table first
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: email,
        role: role,
        status: 'active',
        created_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (profileError) {
      console.error('Error updating profile (RLS may be blocking):', profileError.message);
      
      // If RLS is blocking, try to update auth metadata only
      try {
        const { error: authError } = await supabase.auth.updateUser({
          data: { role: role }
        });
        
        if (authError) {
          console.error('Error updating auth metadata:', authError);
          return false;
        }
        
        console.log('Role updated in auth metadata only (profiles table blocked by RLS)');
        return true;
      } catch (authError) {
        console.error('Auth metadata update failed:', authError);
        return false;
      }
    }

    // Update auth metadata (this requires service role key)
    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: { role: role }
      });
      
      if (authError) {
        console.error('Error updating auth metadata:', authError);
        // Don't fail if auth update fails, profile update is more important
      }
    } catch (authError) {
      console.error('Auth metadata update failed:', authError);
      // Continue anyway, profile update succeeded
    }

    return true;
  } catch (error) {
    console.error('Error setting user role:', error);
    return false;
  }
};

/**
 * Create profile for new user - NO DEFAULT ROLE
 * Enhanced with better RLS handling
 */
export const createUserProfile = async (user: any, role: string): Promise<boolean> => {
  try {
    // Validate role is provided
    if (!role || !['admin', 'staff', 'mechanic', 'customer'].includes(role)) {
      console.error('Invalid or missing role for profile creation:', role);
      return false;
    }

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      console.log('Profile already exists for user:', user.id);
      return true;
    }

    // Try to create profile
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || '',
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        role: role, // Use provided role, NO DEFAULT
        status: 'active',
        created_at: user.created_at,
        avatar_url: user.user_metadata?.avatar_url || '',
        verified: false
      });

    if (error) {
      console.error('Error creating profile (RLS may be blocking):', error.message);
      
      // If RLS is blocking profile creation, try to set role in auth metadata only
      try {
        const { error: authError } = await supabase.auth.updateUser({
          data: { role: role }
        });
        
        if (authError) {
          console.error('Error updating auth metadata:', authError);
          return false;
        }
        
        console.log('Profile creation blocked by RLS, role set in auth metadata only');
        return true;
      } catch (authError) {
        console.error('Auth metadata update failed:', authError);
        return false;
      }
    }

    console.log('Created profile with explicit role:', role);
    return true;
  } catch (error) {
    console.error('Error creating profile:', error);
    return false;
  }
};

/**
 * Get dashboard path based on role - NO DEFAULT
 */
export const getDashboardPath = (role: string): string | null => {
  switch (role) {
    case 'admin':
      return '/secure-admin-dashboard';
    case 'staff':
      return '/secure-staff-dashboard';
    case 'mechanic':
      return '/secure-mechanic-dashboard';
    case 'customer':
      return '/secure-customer-dashboard';
    default:
      return null; // NO DEFAULT - explicit role required
  }
};

/**
 * Validate if user has access to a specific role
 */
export const validateRoleAccess = (userRole: string, requiredRole: string): boolean => {
  const roleHierarchy = {
    'admin': 4,
    'staff': 3,
    'mechanic': 2,
    'customer': 1
  };

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

  return userLevel >= requiredLevel;
};

/**
 * Get all users with their roles
 */
export const getAllUsers = async (): Promise<UserRole[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role, status, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }

    return (data as UserRole[]) || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

/**
 * Update user role
 */
export const updateUserRole = async (userId: string, newRole: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user role:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
}; 