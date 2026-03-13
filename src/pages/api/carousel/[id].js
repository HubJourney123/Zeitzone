import sql from '../../../lib/db';
import { verifyAdmin } from '../../../lib/auth';

export default async function handler(req, res) {
  if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  const { id } = req.query;
  if (req.method === 'DELETE') {
    await sql`DELETE FROM carousel_images WHERE id = ${id}`;
    return res.json({ success: true });
  }
  res.status(405).json({ error: 'Method not allowed' });
}
