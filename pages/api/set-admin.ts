import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ADMIN_EMAIL = 'daniwesttechnologies@gmail.com';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (email !== ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Unauthorized: This email is not allowed to be admin' });
  }

  const { data: users, error: listError } = await supabase.auth.admin.listUsers({ email });

  if (listError || !users || users.users.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  const userId = users.users[0].id;

  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    app_metadata: { role: 'admin' }
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    message: `Admin role assigned to ${email}`,
    user: data,
  });
} 