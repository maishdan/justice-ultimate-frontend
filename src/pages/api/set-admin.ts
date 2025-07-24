import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

const supabaseUrl = 'https://gzmgfgcgytafngvliqqj.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bWdmZ2NneXRhZm5ndmxpcXFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzI1NDM4MSwiZXhwIjoyMDY4ODMwMzgxfQ.J6G9gjn3hRSKXmwHnFFb_RVKWqrj6lIUh5kCh6UwDIQ';

const supabase = createClient(
  supabaseUrl,
  serviceRoleKey
);

const ADMIN_EMAIL = 'daniwesttechnologies@gmail.com';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, role = 'admin' } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Only allow setting admin role for specific email
  if (role === 'admin' && email !== ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Unauthorized: This email is not allowed to be admin' });
  }

  try {
    // 1. Get user from auth
    const { data: users, error: listError } = await supabase.auth.admin.listUsers({ email });

    if (listError || !users || users.users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users.users[0];
    const userId = user.id;

    // 2. Update user metadata with role
    const { data: authData, error: authError } = await supabase.auth.admin.updateUserById(userId, {
      app_metadata: { role: role }
    });

    if (authError) {
      return res.status(500).json({ error: authError.message });
    }

    // 3. Create or update profile in profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: user.email,
        full_name: user.user_metadata?.full_name || '',
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        role: role,
        status: 'active',
        created_at: user.created_at,
        avatar_url: user.user_metadata?.avatar_url || '',
        verified: true
      }, {
        onConflict: 'id'
      });

    if (profileError) {
      console.error('Profile update error:', profileError);
      // Don't fail the request if profile update fails, just log it
    }

    return res.status(200).json({
      message: `${role} role assigned to ${email}`,
      user: authData,
      profile: profileData
    });

  } catch (error: any) {
    console.error('Error setting user role:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
} 