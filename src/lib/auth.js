const ADMIN_SECRET = process.env.ADMIN_SECRET || 'zeitzone_secret_2024';

export function verifyAdmin(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return false;
  const token = auth.replace('Bearer ', '');
  return token === ADMIN_SECRET;
}
