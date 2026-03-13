export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { password } = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'zeitzone2024';
  const ADMIN_SECRET = process.env.ADMIN_SECRET || 'zeitzone_secret_2024';

  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true, token: ADMIN_SECRET });
  }
  return res.status(401).json({ success: false, error: 'Invalid password' });
}
