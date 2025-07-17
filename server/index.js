const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const app = express();
const PORT = 5001;

// Load environment variables securely
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow large PDF payloads

// Demo Gmail SMTP credentials (replace with your own for production)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'justiceultimate.demo@gmail.com', // Replace with your email
    pass: 'demo-password', // Replace with your app password
  },
});

const SUPABASE_URL = 'https://tyypdmhxuehzddudeuww.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5eXBkbWh4dWVoemRkdWRldXd3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjYwODUxMywiZXhwIjoyMDY4MTg0NTEzfQ.ubs58n_A0Y70zpl5T9AqHplhsHi3c736hCHKxZC3ND0';

if (!SERVICE_ROLE_KEY) {
  console.warn('WARNING: SUPABASE_SERVICE_ROLE_KEY is not set. This endpoint will not work securely.');
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Optional: Webhook URL for external integrations (set in .env)
const ADMIN_ACTION_WEBHOOK_URL = process.env.ADMIN_ACTION_WEBHOOK_URL;

// Helper to send webhook for admin actions
async function sendAdminActionWebhook(payload) {
  if (!ADMIN_ACTION_WEBHOOK_URL) return;
  try {
    await axios.post(ADMIN_ACTION_WEBHOOK_URL, payload);
  } catch (err) {
    console.error('Failed to send admin action webhook:', err.message);
  }
}

app.post('/send-receipt', async (req, res) => {
  const { to, subject, html, pdfBase64, filename } = req.body;
  if (!to || !subject || !html || !pdfBase64 || !filename) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    await transporter.sendMail({
      from: 'Justice Ultimate Automobiles <justiceultimate.demo@gmail.com>',
      to,
      subject,
      html,
      attachments: [
        {
          filename,
          content: Buffer.from(pdfBase64, 'base64'),
          contentType: 'application/pdf',
        },
      ],
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Improved /auth-users with better error handling
app.get('/auth-users', async (req, res) => {
  try {
    let users = [];
    let page = 1;
    let perPage = 100;
    let done = false;
    while (!done) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
      if (error) {
        console.error('Supabase listUsers error:', error.message);
        return res.status(500).json([]);
      }
      users = users.concat(data.users);
      if (data.users.length < perPage) done = true;
      else page++;
    }
    const result = users.map(u => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      user_metadata: u.user_metadata,
      phone: u.phone,
      last_sign_in_at: u.last_sign_in_at,
      app_metadata: u.app_metadata
    }));
    res.json(result);
  } catch (err) {
    console.error('Unexpected /auth-users error:', err);
    res.status(500).json([]);
  }
});

// Impersonation endpoint (should be protected in production!)
app.post('/impersonate', async (req, res) => {
  const { user_id, admin_id, admin_email } = req.body;
  if (!user_id || !admin_id || !admin_email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    // Create a session for the target user
    const { data, error } = await supabaseAdmin.auth.admin.createSession({ user_id });
    if (error) {
      console.error('Impersonation error:', error.message);
      return res.status(500).json({ error: error.message });
    }
    // Log impersonation in audit_logs
    await supabaseAdmin.from('audit_logs').insert([
      {
        action: 'impersonate',
        admin_id,
        admin_email,
        affected_user_ids: [user_id],
        details: `Admin impersonated user ${user_id}`,
        timestamp: new Date().toISOString(),
      },
    ]);
    res.json({ session: data.session });
  } catch (err) {
    console.error('Unexpected /impersonate error:', err);
    res.status(500).json({ error: err.message || 'Failed to impersonate' });
  }
});

// Global audit log endpoint
app.get('/audit-logs', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('audit_logs').select('*').order('timestamp', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch audit logs' });
  }
});

app.listen(PORT, () => {
  console.log(`Receipt email server running on http://localhost:${PORT}`);
}); 