import sql from '../../lib/db';
import { verifyAdmin } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const slides = await sql`SELECT * FROM carousel_images ORDER BY sort_order ASC, created_at ASC`;
      return res.json({ slides });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'POST') {
    const { image_url, title, subtitle, sort_order } = req.body;
    try {
      const [slide] = await sql`
        INSERT INTO carousel_images (image_url, title, subtitle, sort_order, active)
        VALUES (${image_url}, ${title || null}, ${subtitle || null}, ${sort_order || 0}, true)
        RETURNING *
      `;
      return res.json({ slide });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
