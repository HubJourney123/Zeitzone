import sql from '../../../lib/db';
import { verifyAdmin } from '../../../lib/auth';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const [product] = await sql`SELECT * FROM products WHERE id = ${id}`;
    if (!product) return res.status(404).json({ error: 'Not found' });
    return res.json({ product: { ...product, images: product.images || [], original_price: Number(product.original_price), discount_price: Number(product.discount_price) } });
  }

  if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'PUT') {
    const { name, category, subcategory, original_price, discount_price, delivery_fee, description, images, available } = req.body;
    try {
      const [product] = await sql`
        UPDATE products SET
          name = ${name}, category = ${category}, subcategory = ${subcategory || null},
          original_price = ${original_price}, discount_price = ${discount_price},
          delivery_fee = ${delivery_fee ?? 60}, description = ${description || null},
          images = ${images || []}, available = ${available !== false},
          updated_at = NOW()
        WHERE id = ${id} RETURNING *
      `;
      return res.json({ product });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  if (req.method === 'DELETE') {
    await sql`DELETE FROM products WHERE id = ${id}`;
    return res.json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
