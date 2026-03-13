import sql from '../../../lib/db';
import { verifyAdmin } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const products = await sql`SELECT * FROM products ORDER BY created_at DESC`;
      return res.json({ products: products.map(p => ({ ...p, images: p.images || [], original_price: Number(p.original_price), discount_price: Number(p.discount_price), delivery_fee: Number(p.delivery_fee) })) });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  if (req.method === 'POST') {
    if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
    const { name, category, subcategory, original_price, discount_price, delivery_fee, description, images, available } = req.body;
    try {
      const [product] = await sql`
        INSERT INTO products (name, category, subcategory, original_price, discount_price, delivery_fee, description, images, available)
        VALUES (${name}, ${category}, ${subcategory || null}, ${original_price}, ${discount_price}, ${delivery_fee ?? 60}, ${description || null}, ${images || []}, ${available !== false})
        RETURNING *
      `;
      return res.json({ product });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
