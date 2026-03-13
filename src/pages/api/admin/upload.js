import { verifyAdmin } from '../../../lib/auth';
import { uploadImage } from '../../../lib/cloudinary';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  const { image } = req.body;
  if (!image) return res.status(400).json({ error: 'No image provided' });
  try {
    const url = await uploadImage(image);
    return res.json({ url });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
