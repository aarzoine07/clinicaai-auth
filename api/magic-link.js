// api/magic-link.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Allow your Framer site to POST here
function setCors(res) {
  const origin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const redirect = process.env.EMAIL_REDIRECT_URL || 'https://clinicaai.com/onboarding';

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirect }
  });

  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ message: 'Magic link sent' });
};
