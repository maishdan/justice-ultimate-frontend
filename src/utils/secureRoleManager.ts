import { supabase } from '../lib/supabaseClient';
import { createUserProfile, setUserRole, getUserRole } from '../lib/userRoleUtils';

/**
 * Secure Role Management Utility
 * Ensures no default roles and proper role assignment
 */

export interface RoleAssignment {
  userId: string;
  email: string;
  role: string;
  assignedBy: string;
  assignedAt: string;
  reason: string;
}

/**
 * Valid roles in the system
 */
export const VALID_ROLES = ['admin', 'staff', 'mechanic', 'customer'] as const;
export type ValidRole = typeof VALID_ROLES[number];

/**
 * Role hierarchy for access control
 */
export const ROLE_HIERARCHY = {
  admin: 4,
  staff: 3,
  mechanic: 2,
  customer: 1
} as const;

/**
 * Validate if a role is valid
 */
export const isValidRole = (role: string): role is ValidRole => {
  return VALID_ROLES.includes(role as ValidRole);
};

/**
 * Check if user has permission to assign a specific role
 */
export const canAssignRole = (assignerRole: string, targetRole: string): boolean => {
  const assignerLevel = ROLE_HIERARCHY[assignerRole as keyof typeof ROLE_HIERARCHY] || 0;
  const targetLevel = ROLE_HIERARCHY[targetRole as keyof typeof ROLE_HIERARCHY] || 0;
  
  // Only admins can assign admin roles
  if (targetRole === 'admin' && assignerRole !== 'admin') {
    return false;
  }
  
  // Users can only assign roles at or below their level
  return assignerLevel >= targetLevel;
};

/**
 * Securely assign a role to a user
 */
export const secureRoleAssignment = async (
  userId: string,
  email: string,
  role: string,
  assignedBy: string,
  reason: string = 'Role assignment'
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Validate role
    if (!isValidRole(role)) {
      return { success: false, error: 'Invalid role specified' };
    }

    // Get current user's role to check permissions
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const currentUserRole = await getUserRole(user.id);
    if (!currentUserRole) {
      return { success: false, error: 'Current user has no role assigned' };
    }

    // Check if current user can assign this role
    if (!canAssignRole(currentUserRole, role)) {
      return { success: false, error: 'Insufficient permissions to assign this role' };
    }

    // Set the role
    const roleSet = await setUserRole(userId, email, role);
    if (!roleSet) {
      return { success: false, error: 'Failed to set user role' };
    }

    // Log the role assignment for audit
    await logRoleAssignment({
      userId,
      email,
      role,
      assignedBy,
      assignedAt: new Date().toISOString(),
      reason
    });

    return { success: true };
  } catch (error) {
    console.error('Error in secure role assignment:', error);
    return { success: false, error: 'Internal server error' };
  }
};

/**
 * Log role assignment for audit trail
 */
const logRoleAssignment = async (assignment: RoleAssignment): Promise<void> => {
  try {
    // You can implement this to log to a separate audit table
    console.log('Role assignment logged:', assignment);
    
    // Example: Log to a role_assignments table
    // await supabase.from('role_assignments').insert(assignment);
  } catch (error) {
    console.error('Error logging role assignment:', error);
  }
};

/**
 * Get user's current role with validation
 */
export const getCurrentUserRole = async (): Promise<ValidRole | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const role = await getUserRole(user.id);
    return isValidRole(role || '') ? (role as ValidRole) : null;
  } catch (error) {
    console.error('Error getting current user role:', error);
    return null;
  }
};

/**
 * Check if current user has access to a specific dashboard
 */
export const hasDashboardAccess = async (requiredRole: ValidRole): Promise<boolean> => {
  try {
    const currentRole = await getCurrentUserRole();
    if (!currentRole) return false;

    const currentLevel = ROLE_HIERARCHY[currentRole];
    const requiredLevel = ROLE_HIERARCHY[requiredRole];

    return currentLevel >= requiredLevel;
  } catch (error) {
    console.error('Error checking dashboard access:', error);
    return false;
  }
};

/**
 * Get all users with their roles (admin only)
 */
export const getAllUsersWithRoles = async (): Promise<Array<{ id: string; email: string; role: string; status: string }>> => {
  try {
    const currentRole = await getCurrentUserRole();
    if (currentRole !== 'admin') {
      throw new Error('Insufficient permissions');
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role, status')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching users with roles:', error);
    return [];
  }
};

/**
 * Update user role (admin only)
 */
export const updateUserRole = async (
  userId: string,
  newRole: ValidRole,
  reason: string = 'Role update'
): Promise<{ success: boolean; error?: string }> => {
  try {
    const currentRole = await getCurrentUserRole();
    if (currentRole !== 'admin') {
      return { success: false, error: 'Only admins can update user roles' };
    }

    return await secureRoleAssignment(userId, '', newRole, 'admin', reason);
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: 'Internal server error' };
  }
};

/**
 * Remove user role (admin only)
 */
export const removeUserRole = async (userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const currentRole = await getCurrentUserRole();
    if (currentRole !== 'admin') {
      return { success: false, error: 'Only admins can remove user roles' };
    }

    const { error } = await supabase
      .from('profiles')
      .update({ role: null })
      .eq('id', userId);

    if (error) {
      return { success: false, error: 'Failed to remove user role' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error removing user role:', error);
    return { success: false, error: 'Internal server error' };
  }
};

/**
 * Get role statistics
 */
export const getRoleStatistics = async (): Promise<Record<ValidRole, number>> => {
  try {
    const currentRole = await getCurrentUserRole();
    if (!currentRole || currentRole === 'customer') {
      throw new Error('Insufficient permissions');
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('role');

    if (error) throw error;

    const stats: Record<ValidRole, number> = {
      admin: 0,
      staff: 0,
      mechanic: 0,
      customer: 0
    };

    data?.forEach(profile => {
      if (isValidRole(profile.role)) {
        stats[profile.role as ValidRole]++;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error getting role statistics:', error);
    return {
      admin: 0,
      staff: 0,
      mechanic: 0,
      customer: 0
    };
  }
}; 