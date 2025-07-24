import type { NextApiRequest, NextApiResponse } from 'next';

const RECAPTCHA_SECRET_KEY = '6Lf2HYgrAAAAAHvpe272LhCc6SfwXK_ak39tLBZl';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, error: 'No token provided' });
  }

  try {
    const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
    });
    const data = await verifyRes.json();
    if (data.success && data.score && data.score > 0.5) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false, error: 'Failed reCAPTCHA verification', score: data.score });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error verifying reCAPTCHA' });
  }
} 